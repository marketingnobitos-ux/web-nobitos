import { Suspense } from "react";
import Link from "next/link";
import GapBadges from "@/components/admin/GapBadges";
import { Card, Notice, PageHeader, PublishBadge } from "@/components/admin/fields";
import { listAccessibleBrands, requireAdmin } from "@/lib/admin";
import { getBrandGaps, type Gap } from "@/lib/brand-health";
import { prisma } from "@/lib/prisma";
import { checkSite, type Check } from "@/lib/seo-health";

export const metadata = { title: "Kesehatan SEO" };
export const dynamic = "force-dynamic";

// Data yang ikut menentukan tampilan di Google (JSON-LD, Maps, sosial).
const SEO_GAPS = new Set(["domain", "ig", "tiktok", "cuisine", "branch", "hours", "maps", "logo"]);

function Status({ ok }: { ok: boolean | null }) {
  const [cls, label] = ok === null ? ["bg-gray-100 text-gray-600", "?"] : ok ? ["bg-green-100 text-green-800", "OK"] : ["bg-red-100 text-red-800", "Cek"];
  return <span className={`inline-flex w-10 shrink-0 justify-center rounded-full px-2 py-0.5 text-xs font-semibold ${cls}`}>{label}</span>;
}

function CheckList({ checks }: { checks: Check[] }) {
  return (
    <ul className="divide-y divide-gray-100">
      {checks.map((c) => (
        <li key={c.key} className="flex items-start gap-3 py-2 text-sm">
          <Status ok={c.ok} />
          <span className="min-w-0 flex-1">
            <span className="font-medium text-gray-900">{c.label}</span>
            <span className="block break-words text-xs text-gray-500">{c.detail}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

async function LiveChecks({ hostname }: { hostname: string }) {
  const checks = await checkSite(hostname);
  const bad = checks.filter((c) => c.ok === false).length;
  return (
    <div>
      <p className={`mb-2 text-sm font-medium ${bad ? "text-red-700" : "text-green-700"}`}>
        {bad ? `${bad} hal perlu dicek` : "Semua cek lolos"} · dicek {new Date().toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit" })} WIB
      </p>
      <CheckList checks={checks} />
    </div>
  );
}

function LiveSkeleton() {
  return (
    <div role="status" className="animate-pulse space-y-2" aria-label="Mengecek situs">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="h-8 rounded bg-gray-100" />
      ))}
    </div>
  );
}

export default async function SeoHealthPage() {
  const admin = await requireAdmin();
  const ids = (await listAccessibleBrands(admin)).map((b) => b.id);
  const [brands, gaps] = await Promise.all([
    prisma.brand.findMany({
      where: { id: { in: ids } },
      orderBy: [{ isPublished: "desc" }, { name: "asc" }],
      include: { domains: { orderBy: [{ isPrimary: "desc" }, { hostname: "asc" }] } },
    }),
    getBrandGaps(ids),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kesehatan SEO"
        description="Cek langsung situs live tiap brand: beranda, meta, data terstruktur, sitemap, robots, dan domain. Muat ulang halaman untuk cek ulang."
      />
      <Notice tone="muted">
        <p>
          Skor Lighthouse tidak diukur otomatis di sini. Klik <strong>Ukur di PageSpeed</strong> pada brand untuk skor terbaru (target Performance ≥ 85).
        </p>
      </Notice>

      {brands.map((b) => {
        const primary = b.domains.find((d) => d.isPrimary) ?? b.domains[0];
        const seoGaps: Gap[] = (gaps.get(b.id) ?? []).filter((g) => SEO_GAPS.has(g.key) && g.key !== "domain");
        const live = b.isPublished && primary;
        return (
          <Card
            key={b.id}
            title={b.name}
            actions={
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <PublishBadge published={b.isPublished} />
                {primary && (
                  <a
                    href={`https://pagespeed.web.dev/analysis?url=${encodeURIComponent(`https://${primary.hostname}/`)}&form_factor=mobile`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:underline"
                  >
                    Ukur di PageSpeed ↗
                  </a>
                )}
              </div>
            }
          >
            <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
              <div>
                {live && primary ? (
                  <Suspense fallback={<LiveSkeleton />}>
                    <LiveChecks hostname={primary.hostname} />
                  </Suspense>
                ) : (
                  <p className="text-sm text-gray-500">
                    {primary ? "Brand masih Draft, situs belum tayang di domain." : "Belum ada domain."} Cek live dijalankan setelah brand tayang.
                  </p>
                )}
              </div>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Domain</p>
                  {primary ? (
                    <p>
                      <span className="font-mono">{primary.hostname}</span>
                      <span className="block text-xs text-gray-600">
                        {primary.status} · {primary.sslIssued ? "SSL terpasang" : "SSL belum"}
                      </span>
                    </p>
                  ) : (
                    <Link href="/admin/domains" className="text-gray-700 hover:underline">
                      Tambah domain →
                    </Link>
                  )}
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Data untuk Google</p>
                  <GapBadges gaps={seoGaps} />
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
