// Analitik first-party (PRD Bagian 11): rekam event & agregasi untuk dashboard.
// Tidak menyimpan data pribadi: tanpa IP, referrer hanya nama host, pengunjung = UUID acak di cookie.
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { branchKey, normalizeTarget } from "@/lib/track";

/** Cookie ID pengunjung anonim (untuk hitung pengunjung unik). */
export const VISITOR_COOKIE = "nb_vid";
export const VISITOR_MAX_AGE = 365 * 24 * 60 * 60;

const BOT_RE =
  /bot|crawl|spider|slurp|mediapartners|headless|lighthouse|pagespeed|preview|facebookexternalhit|whatsapp|telegram|curl|wget|python|axios|node-fetch|go-http|java\//i;

export function isBot(userAgent: string): boolean {
  return !userAgent || BOT_RE.test(userAgent);
}

export function detectDevice(userAgent: string): "mobile" | "tablet" | "desktop" {
  if (/ipad|tablet|android(?!.*mobile)/i.test(userAgent)) return "tablet";
  if (/mobi|iphone|ipod|android/i.test(userAgent)) return "mobile";
  return "desktop";
}

export const trackSchema = z
  .object({
    type: z.enum(["pageview", "click"]),
    path: z.string().max(500).startsWith("/"),
    target: z
      .string()
      .max(100)
      .regex(/^[\w\-.:]+$/)
      .optional(),
    referrer: z.string().max(2000).optional(),
    brandSlug: z.string().max(60).optional(),
  })
  .refine((e) => e.type !== "click" || !!e.target, { message: "click butuh target" });

/** "/preview/aminoto/menu?x=1#y" -> "/menu" */
export function normalizePath(path: string): string {
  const clean = path.split(/[?#]/)[0].replace(/^\/preview\/[^/]+/, "") || "/";
  return clean.length > 1 ? clean.replace(/\/+$/, "") : clean;
}

/** Hanya nama host referrer; null kalau kosong / dari situs sendiri. */
export function referrerHost(referrer: string | undefined, ownHost: string): string | null {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).host.toLowerCase();
    return host && host !== ownHost.toLowerCase() ? host.slice(0, 200) : null;
  } catch {
    return null;
  }
}

// ---------- Tanggal (hari dihitung dalam WIB) ----------

const TZ = "Asia/Jakarta";

/** Tanggal hari ini (WIB) "YYYY-MM-DD". */
export function todayWib(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
}

export function addDays(day: string, n: number): string {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Awal hari WIB sebagai Date. */
export function startOfDayWib(day: string): Date {
  return new Date(`${day}T00:00:00+07:00`);
}

export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}

// ---------- Query dashboard ----------

export type DateRange = { from: string; to: string }; // inklusif, WIB

// Kolom createdAt = timestamp tanpa zona (UTC). Bandingkan dengan parameter UTC eksplisit
// supaya tidak tergantung zona waktu sesi Postgres.
const ts = (d: Date) => Prisma.sql`${d.toISOString().replace("Z", "")}::timestamp`;
const rangeSql = ({ from, to }: DateRange) =>
  Prisma.sql`"createdAt" >= ${ts(startOfDayWib(from))} AND "createdAt" < ${ts(startOfDayWib(addDays(to, 1)))}`;
const brandSql = (brandIds: string[]) => Prisma.sql`"brandId" IN (${Prisma.join(brandIds)})`;
const localDay = Prisma.sql`to_char(("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE ${TZ}, 'YYYY-MM-DD')`;

const n = (v: bigint | number | null | undefined) => Number(v ?? 0);

export async function getVisitorSummary(brandIds: string[]) {
  if (!brandIds.length) return { today: 0, week: 0, month: 0 };
  const today = todayWib();
  const [row] = await prisma.$queryRaw<{ today: bigint; week: bigint; month: bigint }[]>`
    SELECT
      COUNT(DISTINCT "sessionId") FILTER (WHERE "createdAt" >= ${ts(startOfDayWib(today))}) AS today,
      COUNT(DISTINCT "sessionId") FILTER (WHERE "createdAt" >= ${ts(startOfDayWib(addDays(today, -6)))}) AS week,
      COUNT(DISTINCT "sessionId") AS month
    FROM "AnalyticsEvent"
    WHERE type = 'pageview' AND ${brandSql(brandIds)}
      AND "createdAt" >= ${ts(startOfDayWib(addDays(today, -29)))}`;
  return { today: n(row?.today), week: n(row?.week), month: n(row?.month) };
}

export type BrandStats = { brandId: string; pageviews: number; visitors: number; clicks: number };

export async function getStatsByBrand(brandIds: string[], range: DateRange): Promise<BrandStats[]> {
  if (!brandIds.length) return [];
  const rows = await prisma.$queryRaw<{ brandId: string; pageviews: bigint; visitors: bigint; clicks: bigint }[]>`
    SELECT "brandId",
      COUNT(*) FILTER (WHERE type = 'pageview') AS pageviews,
      COUNT(DISTINCT "sessionId") FILTER (WHERE type = 'pageview') AS visitors,
      COUNT(*) FILTER (WHERE type = 'click') AS clicks
    FROM "AnalyticsEvent"
    WHERE ${brandSql(brandIds)} AND ${rangeSql(range)}
    GROUP BY "brandId"`;
  return rows.map((r) => ({ brandId: r.brandId, pageviews: n(r.pageviews), visitors: n(r.visitors), clicks: n(r.clicks) }));
}

export async function getRangeTotals(brandIds: string[], range: DateRange) {
  if (!brandIds.length) return { pageviews: 0, visitors: 0, clicks: 0 };
  const [row] = await prisma.$queryRaw<{ pageviews: bigint; visitors: bigint; clicks: bigint }[]>`
    SELECT
      COUNT(*) FILTER (WHERE type = 'pageview') AS pageviews,
      COUNT(DISTINCT "sessionId") FILTER (WHERE type = 'pageview') AS visitors,
      COUNT(*) FILTER (WHERE type = 'click') AS clicks
    FROM "AnalyticsEvent"
    WHERE ${brandSql(brandIds)} AND ${rangeSql(range)}`;
  return { pageviews: n(row?.pageviews), visitors: n(row?.visitors), clicks: n(row?.clicks) };
}

export type DailyPoint = { day: string; visitors: number; pageviews: number; clicks: number };

/** Satu baris per hari dalam rentang (hari tanpa data = 0). */
export async function getDailyTrend(brandIds: string[], range: DateRange): Promise<DailyPoint[]> {
  const rows = brandIds.length
    ? await prisma.$queryRaw<{ day: string; visitors: bigint; pageviews: bigint; clicks: bigint }[]>`
        SELECT ${localDay} AS day,
          COUNT(DISTINCT "sessionId") FILTER (WHERE type = 'pageview') AS visitors,
          COUNT(*) FILTER (WHERE type = 'pageview') AS pageviews,
          COUNT(*) FILTER (WHERE type = 'click') AS clicks
        FROM "AnalyticsEvent"
        WHERE ${brandSql(brandIds)} AND ${rangeSql(range)}
        GROUP BY day`
    : [];
  const byDay = new Map(rows.map((r) => [r.day, r]));
  const days: DailyPoint[] = [];
  for (let d = range.from; d <= range.to; d = addDays(d, 1)) {
    const r = byDay.get(d);
    days.push({ day: d, visitors: n(r?.visitors), pageviews: n(r?.pageviews), clicks: n(r?.clicks) });
  }
  return days;
}

export async function getTopPages(brandIds: string[], range: DateRange, limit = 10) {
  if (!brandIds.length) return [];
  const rows = await prisma.$queryRaw<{ label: string; count: bigint }[]>`
    SELECT path AS label, COUNT(*) AS count
    FROM "AnalyticsEvent"
    WHERE type = 'pageview' AND ${brandSql(brandIds)} AND ${rangeSql(range)}
    GROUP BY path ORDER BY count DESC, path LIMIT ${limit}`;
  return rows.map((r) => ({ label: r.label, count: n(r.count) }));
}

// Nama event lama (sebelum F0.6) diterjemahkan ke nama baru lalu dijumlah ulang, jadi limit dipotong setelahnya.
export async function getTopClicks(brandIds: string[], range: DateRange, limit = 10) {
  if (!brandIds.length) return [];
  const [rows, branches] = await Promise.all([
    prisma.$queryRaw<{ label: string; count: bigint }[]>`
      SELECT target AS label, COUNT(*) AS count
      FROM "AnalyticsEvent"
      WHERE type = 'click' AND target IS NOT NULL AND ${brandSql(brandIds)} AND ${rangeSql(range)}
      GROUP BY target`,
    prisma.branch.findMany({ where: { brandId: { in: brandIds } }, select: { id: true, name: true } }),
  ]);
  const slugById = new Map(branches.map((b) => [b.id, branchKey(b.name)]));
  const totals = new Map<string, number>();
  for (const r of rows) {
    const label = normalizeTarget(r.label, slugById);
    totals.set(label, (totals.get(label) ?? 0) + n(r.count));
  }
  return [...totals]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, limit);
}
