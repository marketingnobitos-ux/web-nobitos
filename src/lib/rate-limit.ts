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

export function hit(key: string, windowMs: number): void {
  const entry = current(key);
  if (entry) entry.count++;
  else store.set(key, { count: 1, resetAt: Date.now() + windowMs });
}

export function resetLimit(key: string): void {
  store.delete(key);
}
