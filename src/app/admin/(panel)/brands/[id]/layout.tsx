import { BrandTabs } from "@/components/admin/AdminNav";
import GapBadges from "@/components/admin/GapBadges";
import { PublishBadge } from "@/components/admin/fields";
import { getBrandForAdmin } from "@/lib/admin";
import { getBrandGaps } from "@/lib/brand-health";
import { TEMPLATE_LABEL, mutedBrandTabs } from "@/lib/template-features";

// Header brand + tab (Info, Konten, Menu, Galeri, Promo, Cabang).
export default async function BrandAdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const brand = await getBrandForAdmin((await params).id);
  const gaps = (await getBrandGaps([brand.id])).get(brand.id) ?? [];
  const primaryDomain = brand.domains.find((d) => d.isPrimary) ?? brand.domains[0];
  // Brand tayang + punya domain: buka situs aslinya. Draft / tanpa domain (atau di dev): preview admin (F6.7).
  const live = process.env.NODE_ENV === "production" && brand.isPublished && primaryDomain;
  const site = live ? { href: `https://${primaryDomain.hostname}`, label: "Lihat situs ↗" } : { href: `/preview/${brand.slug}`, label: "Preview ↗" };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {brand.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={brand.logoUrl} alt="" className="h-10 w-10 shrink-0 rounded-md border border-gray-200 bg-white object-contain p-0.5" />
          ) : (
            <span className="h-10 w-10 shrink-0 rounded-md" style={{ background: brand.colorPrimary }} />
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-2xl font-bold tracking-tight">{brand.name}</h1>
              <PublishBadge published={brand.isPublished} />
            </div>
            <p className="truncate text-xs text-gray-500">
              {primaryDomain?.hostname ?? "Belum ada domain"} · template {TEMPLATE_LABEL[brand.template]}
            </p>
          </div>
        </div>
        <a
          href={site.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 hover:bg-gray-50"
        >
          {site.label}
        </a>
      </div>
      {gaps.length > 0 && (
        <details className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
          <summary className="cursor-pointer py-1 font-medium">{gaps.length} data belum lengkap</summary>
          <div className="pb-2 pt-1">
            <GapBadges gaps={gaps} />
          </div>
        </details>
      )}
      <BrandTabs brandId={brand.id} muted={mutedBrandTabs(brand.template)} />
      {children}
    </div>
  );
}
