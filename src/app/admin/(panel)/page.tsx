import Link from "next/link";
import AutoRefresh from "@/components/admin/AutoRefresh";
import TrendChart from "@/components/admin/TrendChart";
import { Card, PublishBadge } from "@/components/admin/fields";
import { listAccessibleBrands, requireAdmin } from "@/lib/admin";
import {
  addDays,
  daysBetween,
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

  const [summary, totals, byBrand, trend, topPages, topClicks, brandMeta] = await Promise.all([
    getVisitorSummary(brandIds),
    getRangeTotals(brandIds, range),
    getStatsByBrand(accessible.map((b) => b.id), range),
    getDailyTrend(brandIds, range),
    getTopPages(brandIds, range),
    getTopClicks(brandIds, range),
    prisma.brand.findMany({
      where: { id: { in: accessible.map((b) => b.id) } },
      select: { id: true, colorPrimary: true, isPublished: true },
    }),
  ]);

  const statsById = new Map(byBrand.map((s) => [s.brandId, s]));
  const metaById = new Map(brandMeta.map((b) => [b.id, b]));
  const rows = accessible
    .map((b) => ({ ...b, ...metaById.get(b.id), ...(statsById.get(b.id) ?? { pageviews: 0, visitors: 0, clicks: 0 }) }))
    .sort((a, b) => b.visitors - a.visitors || a.name.localeCompare(b.name));
  const scope = selected ? selected.name : "Semua brand";

  return (
    <div className="space-y-6">
      <AutoRefresh seconds={60} />
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-600">
          {scope} · diperbarui otomatis tiap 60 detik · waktu WIB
        </p>
      </div>

      {/* Filter */}
      <form method="get" className="flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <label className="text-sm">
          <span className="mb-1 block text-gray-600">Dari</span>
          <input type="date" name="from" defaultValue={range.from} max={range.to} className="rounded-md border border-gray-300 px-3 py-1.5" />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-gray-600">Sampai</span>
          <input type="date" name="to" defaultValue={range.to} max={todayWib()} className="rounded-md border border-gray-300 px-3 py-1.5" />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-gray-600">Brand</span>
          <select name="brand" defaultValue={selected?.id ?? ""} className="rounded-md border border-gray-300 px-3 py-1.5">
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
        <Card title="Top halaman">
          <TopList items={topPages} empty="Belum ada pageview." unit="view" />
        </Card>
        <Card title="Top klik">
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

function TopList({ items, empty, unit }: { items: { label: string; count: number }[]; empty: string; unit: string }) {
  if (!items.length) return <p className="text-sm text-gray-500">{empty}</p>;
  const max = items[0].count;
  return (
    <ol className="space-y-2 text-sm">
      {items.map((it) => (
        <li key={it.label}>
          <div className="flex justify-between gap-3">
            <span className="truncate font-mono text-gray-800">{it.label}</span>
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
