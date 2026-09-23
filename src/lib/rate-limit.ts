// Rate limit sederhana di memory (per proses). Cukup untuk 1 instance di VPS.
type Entry = { count: number; resetAt: number };

const store = ((globalThis as { __rateLimit?: Map<string, Entry> }).__rateLimit ??= new Map());

function current(key: string): Entry | undefined {
  const entry = store.get(key);
  if (entry && entry.resetAt <= Date.now()) {
    store.delete(key);
    return undefined;
  }
  return entry;
}

export function isRateLimited(key: string, limit: number): boolean {
  return (current(key)?.count ?? 0) >= limit;
}

const MAX_KEYS = 10_000;

export function hit(key: string, windowMs: number): void {
  if (store.size > MAX_KEYS) purgeExpired();
  const entry = current(key);
  if (entry) entry.count++;
  else store.set(key, { count: 1, resetAt: Date.now() + windowMs });
}

export function resetLimit(key: string): void {
  store.delete(key);
}

function purgeExpired(): void {
  const now = Date.now();
  for (const [key, entry] of store) if (entry.resetAt <= now) store.delete(key);
}

/** IP klien dari header Nginx (hanya untuk rate limit, tidak disimpan). */
export function clientIp(request: Request): string {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}
