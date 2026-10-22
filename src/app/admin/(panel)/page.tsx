import Link from "next/link";
import AutoRefresh from "@/components/admin/AutoRefresh";
import TrendChart from "@/components/admin/TrendChart";
import { Card, PageHeader, PublishBadge } from "@/components/admin/fields";
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

export const metadata = { title: "Dashboard" };

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

type Search = { from?: string; to?: string; brand?: string };

// Dashboard analitik (PRD Bagian 10.2).
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
  const scope = selected ? selected.name : "Semua brand";
  const brandName = new Map(accessible.map((b) => [b.id, b.name]));
  const branchName = new Map(branchRows.map((b) => [`${b.brandId}/${branchKey(b.name)}`, b.name]));
  const contactKinds = clicks.byKind.filter((k) => CONTACT.includes(k.label));
  const otherKinds = clicks.byKind.filter((k) => !CONTACT.includes(k.label));

  return (
    <div className="space-y-6">
      <AutoRefresh seconds={60} />
      <PageHeader title="Dashboard" description={`${scope} · diperbarui otomatis tiap 60 detik · waktu WIB`} />

      {/* Filter */}
      <form method="get" className="space-y-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2 text-sm" aria-label="Rentang cepat">
          {[7, 30, 90].map((days) => {
            const from = addDays(todayWib(), -(days - 1));
            const active = range.to === todayWib() && range.from === from;
            const qs = new URLSearchParams({ from, to: todayWib(), ...(selected ? { brand: selected.id } : {}) });
            return (
              <Link
                key={days}
                href={`/admin?${qs}`}
                aria-current={active ? "true" : undefined}
                className={`rounded-full border px-3 py-1 ${active ? "border-gray-900 bg-gray-900 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
              >
                {days} hari
              </Link>
            );
          })}
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <label className="min-w-[9rem] flex-1 text-sm sm:flex-none">
            <span className="mb-1 block text-gray-600">Dari</span>
            <input type="date" name="from" defaultValue={range.from} max={range.to} className="w-full rounded-md border border-gray-300 px-3 py-1.5" />
          </label>
          <label className="min-w-[9rem] flex-1 text-sm sm:flex-none">
            <span className="mb-1 block text-gray-600">Sampai</span>
            <input type="date" name="to" defaultValue={range.to} max={todayWib()} className="w-full rounded-md border border-gray-300 px-3 py-1.5" />
          </label>
          <label className="w-full text-sm sm:w-auto">
            <span className="mb-1 block text-gray-600">Brand</span>
            <select name="brand" defaultValue={selected?.id ?? ""} className="w-full rounded-md border border-gray-300 px-3 py-1.5">
              <option value="">Semua brand</option>
              {accessible.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">
            Terapkan
          </button>
          <Link href="/admin" className="py-2 text-sm text-gray-600 hover:underline">
            Reset
          </Link>
        </div>
      </form>

      {/* Kartu ringkas */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Pengunjung hari ini" value={summary.today} />
        <Stat label="Pengunjung 7 hari" value={summary.week} />
        <Stat label="Pengunjung 30 hari" value={summary.month} />
        <Stat label="Total klik" value={totals.clicks} note="dalam rentang filter" />
      </div>

      <Card title={`Tren pengunjung unik harian · ${range.from} s/d ${range.to}`}>
        <p className="mb-3 text-sm text-gray-600">
          {totals.visitors} pengunjung unik · {totals.pageviews} pageview · {totals.clicks} klik dalam rentang ini
        </p>
        <TrendChart data={trend} />
      </Card>

      <Card title="Ringkasan per brand">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b text-gray-500">
              <tr>
                <th className="py-2 pr-4">Brand</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4 text-right">Pengunjung</th>
                <th className="py-2 pr-4 text-right">Pageview</th>
                <th className="py-2 text-right">Klik</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id} className={`border-b last:border-0 ${selected?.id === b.id ? "bg-gray-50" : ""}`}>
                  <td className="py-2 pr-4">
                    <Link
                      href={`/admin?${new URLSearchParams({ from: range.from, to: range.to, brand: b.id })}`}
                      className="flex items-center gap-2 font-medium hover:underline"
                    >
                      <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: b.colorPrimary }} />
                      {b.name}
                    </Link>
                  </td>
                  <td className="py-2 pr-4">
                    <PublishBadge published={!!b.isPublished} />
                  </td>
                  <td className="py-2 pr-4 text-right tabular-nums">{b.visitors}</td>
                  <td className="py-2 pr-4 text-right tabular-nums">{b.pageviews}</td>
                  <td className="py-2 text-right tabular-nums">{b.clicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Klik per jenis">
          {clicks.byKind.length === 0 ? (
            <p className="text-sm text-gray-500">Belum ada klik dalam rentang ini.</p>
          ) : (
            <div className="space-y-5">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Kontak & sosial</p>
                <TopList items={contactKinds.map((k) => ({ label: kindLabel(k.label), count: k.count }))} empty="Belum ada klik kontak." unit="klik" plain />
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Navigasi & lainnya</p>
                <TopList items={otherKinds.map((k) => ({ label: kindLabel(k.label), count: k.count }))} empty="Belum ada." unit="klik" plain />
              </div>
            </div>
          )}
        </Card>
        <Card title="Klik kontak per cabang">
          {clicks.byBranch.length === 0 ? (
            <p className="text-sm text-gray-500">Belum ada klik WhatsApp, Maps, atau telepon.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b text-gray-500">
                  <tr>
                    <th className="py-2 pr-4">Cabang</th>
                    <th className="py-2 pr-3 text-right">WA</th>
                    <th className="py-2 pr-3 text-right">Maps</th>
                    <th className="py-2 pr-3 text-right">Telp</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {clicks.byBranch.map((r) => (
                    <tr key={`${r.brandId}/${r.branch}`} className="border-b last:border-0">
                      <td className="py-2 pr-4">
                        <span className="font-medium">
                          {r.branch ? (branchName.get(`${r.brandId}/${r.branch}`) ?? humanize(r.branch)) : "Tombol umum (tanpa cabang)"}
                        </span>
                        {!selected && <span className="block text-xs text-gray-500">{brandName.get(r.brandId)}</span>}
                      </td>
                      <td className="py-2 pr-3 text-right tabular-nums">{r.wa}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{r.maps}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{r.tel}</td>
                      <td className="py-2 text-right font-semibold tabular-nums">{r.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Top halaman">
          <TopList items={topPages} empty="Belum ada pageview." unit="view" />
        </Card>
        <Card title="Nama event klik terbanyak">
          <TopList items={topClicks} empty="Belum ada klik." unit="klik" />
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value, note }: { label: string; value: number; note?: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-bold tabular-nums">{value.toLocaleString("id-ID")}</p>
      {note && <p className="text-xs text-gray-400">{note}</p>}
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

function TopList({ items, empty, unit, plain }: { items: { label: string; count: number }[]; empty: string; unit: string; plain?: boolean }) {
  if (!items.length) return <p className="text-sm text-gray-500">{empty}</p>;
  const max = Math.max(...items.map((i) => i.count));
  return (
    <ol className="space-y-2 text-sm">
      {items.map((it) => (
        <li key={it.label}>
          <div className="flex justify-between gap-3">
            <span className={`truncate text-gray-800 ${plain ? "" : "font-mono"}`}>{it.label}</span>
            <span className="shrink-0 tabular-nums text-gray-600">
              {it.count} {unit}
            </span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-gray-100">
            <div className="h-1.5 rounded-full bg-[#2a78d6]" style={{ width: `${(it.count / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ol>
  );
}
