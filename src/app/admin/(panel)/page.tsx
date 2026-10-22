import Link from "next/link";
import AutoRefresh from "@/components/admin/AutoRefresh";
import TrendChart from "@/components/admin/TrendChart";
import { PublishBadge } from "@/components/admin/fields";
import { listAccessibleBrands, requireAdmin } from "@/lib/admin";
import {
  addDays,
  daysBetween,
  getClickBreakdown,
  getDailyTrend,
  getRangeTotals,
  getStatsByBrand,
  getTopClicks,
  getTopPages,
  getVisitorSummary,
  todayWib,
  type DateRange,
} from "@/lib/analytics";
import { prisma } from "@/lib/prisma";
import { branchKey } from "@/lib/track";

export const metadata = { title: "Ringkasan" };

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_DAYS = 366;

function parseRange(from?: string, to?: string): DateRange {
  const today = todayWib();
  let end = to && DATE_RE.test(to) ? to : today;
  if (end > today) end = today;
  let start = from && DATE_RE.test(from) ? from : addDays(end, -29);
  if (start > end) start = end;
  if (daysBetween(start, end) >= MAX_DAYS) start = addDays(end, -(MAX_DAYS - 1));
  return { from: start, to: end };
}

const shortFmt = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", timeZone: "UTC" });
const peakFmt = new Intl.DateTimeFormat("id-ID", { weekday: "short", day: "numeric", timeZone: "UTC" });
const todayFmt = new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" });
const asDate = (day: string) => new Date(`${day}T00:00:00Z`);
const num = (n: number) => n.toLocaleString("id-ID");

type Search = { from?: string; to?: string; brand?: string };

// Ringkasan analitik (PRD Bagian 10.2). Filter brand ada di pil "Brand aktif" di atas (BrandSwitcher).
export default async function AdminDashboardPage({ searchParams }: { searchParams: Promise<Search> }) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const range = parseRange(params.from, params.to);

  const accessible = await listAccessibleBrands(admin);
  const selected = accessible.find((b) => b.id === params.brand);
  const brandIds = selected ? [selected.id] : accessible.map((b) => b.id);

  const [summary, totals, byBrand, trend, topPages, topClicks, clicks, brandMeta, branchRows] = await Promise.all([
    getVisitorSummary(brandIds),
    getRangeTotals(brandIds, range),
    getStatsByBrand(accessible.map((b) => b.id), range),
    getDailyTrend(brandIds, range),
    getTopPages(brandIds, range),
    getTopClicks(brandIds, range, 15),
    getClickBreakdown(brandIds, range),
    prisma.brand.findMany({
      where: { id: { in: accessible.map((b) => b.id) } },
      select: { id: true, colorPrimary: true, isPublished: true },
    }),
    prisma.branch.findMany({ where: { brandId: { in: brandIds } }, select: { brandId: true, name: true } }),
  ]);

  const statsById = new Map(byBrand.map((s) => [s.brandId, s]));
  const metaById = new Map(brandMeta.map((b) => [b.id, b]));
  const rows = accessible
    .map((b) => ({ ...b, ...metaById.get(b.id), ...(statsById.get(b.id) ?? { pageviews: 0, visitors: 0, clicks: 0 }) }))
    .sort((a, b) => b.visitors - a.visitors || a.name.localeCompare(b.name));
  const brandName = new Map(accessible.map((b) => [b.id, b.name]));
  const branchName = new Map(branchRows.map((b) => [`${b.brandId}/${branchKey(b.name)}`, b.name]));
  const contactKinds = clicks.byKind.filter((k) => CONTACT.includes(k.label));
  const otherKinds = clicks.byKind.filter((k) => !CONTACT.includes(k.label));

  const ratio = totals.visitors ? (totals.clicks / totals.visitors) * 100 : 0;
  const ratioText = `${ratio.toLocaleString("id-ID", { maximumFractionDigits: 1 })}%`;
  const peak = trend.reduce<(typeof trend)[number] | null>((best, d) => (d.visitors > (best?.visitors ?? 0) ? d : best), null);
  const days = daysBetween(range.from, range.to) + 1;
  const rangeLabel = `${shortFmt.format(asDate(range.from))} – ${shortFmt.format(asDate(range.to))}`;
  const quick = [7, 30, 90].find((d) => range.to === todayWib() && range.from === addDays(todayWib(), -(d - 1)));
  const brandQs: Record<string, string> = selected ? { brand: selected.id } : {};

  return (
    <div className="flex flex-col gap-6 lg:gap-7">
      <AutoRefresh seconds={60} />
      <p className="text-sm text-[#d4dcc8]">
        <span className="capitalize">{todayFmt.format(new Date())}</span> · diperbarui tiap 60 detik · WIB
      </p>

      {/* Judul + rasio + angka utama */}
      <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
        <div className="flex w-full items-center justify-between gap-6 sm:w-auto sm:justify-start">
          <h1 className="adm-title lg:!text-[76px]">Ringkasan</h1>
          <div className="flex items-center gap-4">
            <Ring percent={ratio} text={ratioText} />
            <span className="hidden max-w-[90px] text-[13px] leading-snug text-[#d4dcc8] sm:block">rasio klik dari pengunjung</span>
          </div>
        </div>
        <dl className="grid flex-[1_1_600px] grid-cols-2 gap-x-3 gap-y-5 sm:flex sm:flex-wrap sm:gap-x-11 2xl:justify-end">
          <Kpi label="Pengunjung hari ini" value={summary.today} />
          <Kpi label="Pengunjung 7 hari" value={summary.week} />
          <Kpi label="Pengunjung 30 hari" value={summary.month} />
          <Kpi label="Total klik" value={totals.clicks} />
        </dl>
      </div>

      {/* Rentang tanggal */}
      <div className="adm-scroll-x -mx-3 flex items-center gap-2 overflow-x-auto px-3 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0" aria-label="Rentang tanggal">
        {[7, 30, 90].map((d) => (
          <Link
            key={d}
            href={`/admin?${new URLSearchParams({ from: addDays(todayWib(), -(d - 1)), to: todayWib(), ...brandQs })}`}
            aria-current={quick === d ? "true" : undefined}
            className="adm-chip"
          >
            {d} hari
          </Link>
        ))}
        <details className="relative">
          <summary aria-current={quick ? undefined : "true"} className="adm-chip cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden>
              <rect x="3" y="5" width="18" height="16" rx="3" />
              <path d="M3 10h18M8 3v4M16 3v4" />
            </svg>
            <span className="sr-only sm:not-sr-only">{rangeLabel}</span>
          </summary>
          <form method="get" className="adm-light fixed inset-x-4 top-1/3 z-40 flex flex-col gap-3 rounded-[28px] bg-[#eef0e2] p-5 shadow-2xl sm:absolute sm:inset-x-auto sm:left-0 sm:top-full sm:mt-2 sm:w-72">
            <p className="font-bold">Pilih tanggal</p>
            {selected && <input type="hidden" name="brand" value={selected.id} />}
            <label className="text-sm font-semibold">
              Dari
              <input type="date" name="from" defaultValue={range.from} max={range.to} className="adm-input mt-1" />
            </label>
            <label className="text-sm font-semibold">
              Sampai
              <input type="date" name="to" defaultValue={range.to} max={todayWib()} className="adm-input mt-1" />
            </label>
            <div className="flex items-center gap-3">
              <button type="submit" className="adm-btn-dark">
                Terapkan
              </button>
              <Link href={`/admin${selected ? `?brand=${selected.id}` : ""}`} className="text-sm font-semibold text-[#2f3d29] hover:underline">
                Reset
              </Link>
            </div>
          </form>
        </details>
      </div>

      {/* Tren + klik */}
      <div className="flex flex-wrap gap-5">
        <section className="adm-dark adm-card flex min-w-0 flex-[999_1_520px] flex-col gap-5 sm:!p-7">
          <div className="flex items-center gap-3.5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f4f3ea] text-[#141414]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4 19V9m6 10V5m6 14v-7m4 7H2" />
              </svg>
            </span>
            <span>
              <span className="block text-lg font-bold">Tren harian</span>
              <span className="block text-[13px] text-[#a9aca3]">per hari · {rangeLabel}</span>
            </span>
          </div>
          <TrendChart data={trend} />
          <dl className="grid grid-cols-2 gap-5 sm:flex sm:flex-wrap sm:gap-8">
            <SmallStat label="Pengunjung unik" value={num(totals.visitors)} />
            <SmallStat label="Pageview" value={num(totals.pageviews)} />
            <SmallStat label="Klik" value={num(totals.clicks)} />
            <SmallStat label="Puncak" value={peak ? peakFmt.format(asDate(peak.day)).replace(",", "") : "–"} />
          </dl>
        </section>

        <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-5">
          <section className="adm-light adm-card flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[17px] font-bold">Klik per jenis</h2>
              <span className="text-xs text-[#5b6157]">{days} hari</span>
            </div>
            {clicks.byKind.length === 0 ? (
              <p className="text-sm text-[#5b6157]">Belum ada klik dalam rentang ini.</p>
            ) : (
              <>
                <BarList title="Kontak & sosial" items={contactKinds.map((k) => ({ label: kindLabel(k.label), count: k.count }))} empty="Belum ada klik kontak." />
                <BarList title="Navigasi & lainnya" items={otherKinds.map((k) => ({ label: kindLabel(k.label), count: k.count }))} empty="Belum ada." />
              </>
            )}
          </section>

          <section className="adm-light adm-card flex flex-col gap-3.5">
            <h2 className="text-[17px] font-bold">Klik kontak per cabang</h2>
            {clicks.byBranch.length === 0 ? (
              <p className="text-sm text-[#5b6157]">Belum ada klik WhatsApp, Maps, atau telepon.</p>
            ) : (
              clicks.byBranch.map((r) => (
                <div key={`${r.brandId}/${r.branch}`} className="flex items-center gap-3 rounded-[20px] bg-white px-3.5 py-3">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-bold">
                      {r.branch ? (branchName.get(`${r.brandId}/${r.branch}`) ?? humanize(r.branch)) : "Tombol umum"}
                    </span>
                    {!selected && <span className="block truncate text-xs text-[#5b6157]">{brandName.get(r.brandId)}</span>}
                  </span>
                  <span className="flex flex-wrap justify-end gap-1">
                    {(
                      [
                        ["WA", r.wa],
                        ["Maps", r.maps],
                        ["Telp", r.tel],
                      ] as const
                    )
                      .filter(([, n]) => n > 0)
                      .map(([k, n]) => (
                        <span key={k} className="rounded-full bg-[#e3eeda] px-2.5 py-1 text-xs font-bold">
                          {k} {n}
                        </span>
                      ))}
                  </span>
                  <span className="text-3xl font-semibold tabular-nums tracking-tight">{r.total}</span>
                </div>
              ))
            )}
          </section>
        </div>
      </div>

      {/* Per brand + top halaman */}
      <div className="flex flex-wrap gap-5">
        <section className="adm-light adm-card min-w-0 flex-[999_1_520px]">
          <div className="mb-3.5 flex items-center justify-between gap-3">
            <h2 className="text-[17px] font-bold">Ringkasan per brand</h2>
            <Link href="/admin/brands" className="text-sm font-semibold text-[#2f3d29] hover:underline">
              Kelola brand →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-separate border-spacing-y-2 text-sm">
              <thead>
                <tr className="text-left text-[#5b6157]">
                  <th className="px-3 font-semibold">Brand</th>
                  <th className="px-3 font-semibold">Status</th>
                  <th className="px-3 text-right font-semibold">Pengunjung</th>
                  <th className="px-3 text-right font-semibold">Pageview</th>
                  <th className="px-3 text-right font-semibold">Klik</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((b) => (
                  <tr key={b.id} className={selected?.id === b.id ? "bg-[#dcebcb]" : "bg-white"}>
                    <td className="rounded-l-2xl p-3 font-bold">
                      <Link href={`/admin?${new URLSearchParams({ from: range.from, to: range.to, brand: b.id })}`} className="flex items-center gap-2.5 hover:underline">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: b.colorPrimary }} />
                        {b.name}
                      </Link>
                    </td>
                    <td className="p-3">
                      <PublishBadge published={!!b.isPublished} />
                    </td>
                    <td className="p-3 text-right tabular-nums">{num(b.visitors)}</td>
                    <td className="p-3 text-right tabular-nums">{num(b.pageviews)}</td>
                    <td className="rounded-r-2xl p-3 text-right tabular-nums">{num(b.clicks)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="adm-card adm-card-green flex min-w-0 flex-[1_1_320px] flex-col gap-1">
          <h2 className="mb-2 text-[17px] font-bold">Top halaman</h2>
          {topPages.length === 0 ? (
            <p className="text-sm text-[#d4dcc8]">Belum ada pageview.</p>
          ) : (
            topPages.map((p) => (
              <div key={p.label} className="flex items-center justify-between gap-3 border-b border-[rgba(244,243,234,0.14)] py-2 text-[15px] last:border-0">
                <span className="truncate font-mono text-sm">{p.label}</span>
                <span className="font-bold tabular-nums">{num(p.count)}</span>
              </div>
            ))
          )}
        </section>
      </div>

      <section className="adm-light adm-card">
        <h2 className="mb-3 text-[17px] font-bold">Nama event klik terbanyak</h2>
        {topClicks.length === 0 ? (
          <p className="text-sm text-[#5b6157]">Belum ada klik.</p>
        ) : (
          <BarList items={topClicks} empty="" mono />
        )}
      </section>
    </div>
  );
}

/** Cincin rasio klik / pengunjung. */
function Ring({ percent, text }: { percent: number; text: string }) {
  const deg = Math.min(360, Math.max(0, percent * 3.6));
  return (
    <div
      role="img"
      aria-label={`Rasio klik ${text} dari pengunjung`}
      className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full lg:h-[108px] lg:w-[108px]"
      style={{ background: `conic-gradient(#141414 0 ${deg}deg, rgba(20,20,20,0.18) ${deg}deg 360deg)` }}
    >
      <span className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#45593c] text-sm font-extrabold lg:h-[82px] lg:w-[82px] lg:text-xl">{text}</span>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="adm-kpi-label">{label}</dt>
      <dd className="adm-kpi-value">{num(value)}</dd>
    </div>
  );
}

function SmallStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[13px] text-[#a9aca3]">{label}</dt>
      <dd className="mt-1 text-3xl font-semibold tabular-nums tracking-tight lg:text-[44px] lg:leading-tight">{value}</dd>
    </div>
  );
}

const CONTACT = ["wa", "maps", "tel", "ig", "tiktok", "threads", "ig_bujoko", "sosmed"];

const KIND_LABEL: Record<string, string> = {
  wa: "WhatsApp",
  maps: "Google Maps",
  tel: "Telepon",
  ig: "Instagram",
  tiktok: "TikTok",
  threads: "Threads",
  sosmed: "Sosial media lain",
  ig_bujoko: "Instagram Bu Joko",
  menu: "Lihat menu",
  cabang: "Lihat cabang",
  cerita: "Lihat cerita",
  galeri: "Lihat galeri",
  beranda: "Ke beranda",
  menu_item: "Kartu menu andalan",
  promo: "Promo",
  picker: "Pemilih menu",
  picker_result: "Hasil pemilih menu",
};

const kindLabel = (kind: string) => KIND_LABEL[kind] ?? kind;

/** "amg-ciledug" -> "Amg Ciledug" (cadangan bila nama cabang tidak ditemukan). */
const humanize = (slug: string) => slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/** Daftar dengan batang hijau zaitun (di kartu krem). */
function BarList({ title, items, empty, mono }: { title?: string; items: { label: string; count: number }[]; empty: string; mono?: boolean }) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <div className="flex flex-col gap-3">
      {title && <p className="text-xs font-bold uppercase tracking-wide text-[#5b6157]">{title}</p>}
      {items.length === 0 ? (
        <p className="text-sm text-[#5b6157]">{empty}</p>
      ) : (
        items.map((it) => (
          <div key={it.label}>
            <div className="flex justify-between gap-3 text-sm">
              <span className={`truncate font-semibold ${mono ? "font-mono text-[13px]" : ""}`}>{it.label}</span>
              <span className="shrink-0 tabular-nums text-[#5b6157]">{num(it.count)} klik</span>
            </div>
            <div className="mt-1.5 h-2.5 rounded-full bg-[#d8dcc9]">
              <div className="h-2.5 rounded-full bg-[#45593c]" style={{ width: `${(it.count / max) * 100}%` }} />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
