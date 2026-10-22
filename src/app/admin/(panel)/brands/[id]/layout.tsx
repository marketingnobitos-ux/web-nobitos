import { BrandTabs } from "@/components/admin/AdminNav";
import GapBadges from "@/components/admin/GapBadges";
import BrandHeader from "@/components/admin/BrandHeader";
import PermissionGate from "@/components/admin/PermissionGate";
import { can, getBrandForAdmin, requireAdmin } from "@/lib/admin";
import { getBrandGaps } from "@/lib/brand-health";
import { TEMPLATE_LABEL, mutedBrandTabs } from "@/lib/template-features";

// Kepala brand + tab pil (HP). Di desktop bagian brand ada di sidebar.
export default async function BrandAdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const brand = await getBrandForAdmin((await params).id);
  const admin = await requireAdmin();
  const gaps = (await getBrandGaps([brand.id])).get(brand.id) ?? [];
  const primaryDomain = brand.domains.find((d) => d.isPrimary) ?? brand.domains[0];
  // Brand tayang + punya domain: buka situs aslinya. Draft / tanpa domain (atau di dev): preview admin (F6.7).
  const live = process.env.NODE_ENV === "production" && brand.isPublished && primaryDomain;
  const site = live ? { href: `https://${primaryDomain.hostname}`, label: "Lihat situs ↗" } : { href: `/preview/${brand.slug}`, label: "Preview ↗" };

  return (
    <div className="space-y-6">
      <BrandHeader
        brandId={brand.id}
        name={brand.name}
        logoUrl={brand.logoUrl}
        color={brand.colorPrimary}
        published={brand.isPublished}
        meta={`${primaryDomain?.hostname ?? "belum ada domain"} · template ${TEMPLATE_LABEL[brand.template]}`}
        site={site}
      />
      <BrandTabs brandId={brand.id} muted={mutedBrandTabs(brand.template)} />
      {gaps.length > 0 && (
        <details className="adm-light rounded-[24px] bg-[#f6e3b8] px-5 py-2.5 text-sm">
          <summary className="cursor-pointer py-1 font-bold">{gaps.length} data belum lengkap</summary>
          <div className="pb-2 pt-1.5">
            <GapBadges gaps={gaps} />
          </div>
        </details>
      )}
      <PermissionGate brandId={brand.id} canContent={can(admin.role, "content")} canBrand={can(admin.role, "brand")}>
        {children}
      </PermissionGate>
    </div>
  );
}
