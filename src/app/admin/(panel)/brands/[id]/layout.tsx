import { BrandTabs } from "@/components/admin/AdminNav";
import { PublishBadge } from "@/components/admin/fields";
import { getBrandForAdmin } from "@/lib/admin";

// Header brand + tab (Info, Konten, Menu, Galeri, Promo, Cabang).
export default async function BrandAdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const brand = await getBrandForAdmin((await params).id);
  const primaryDomain = brand.domains.find((d) => d.isPrimary) ?? brand.domains[0];
  const siteUrl =
    process.env.NODE_ENV !== "production" ? `/preview/${brand.slug}` : primaryDomain ? `https://${primaryDomain.hostname}` : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="h-8 w-8 rounded-md" style={{ background: brand.colorPrimary }} />
          <h1 className="text-2xl font-bold">{brand.name}</h1>
          <PublishBadge published={brand.isPublished} />
        </div>
        {siteUrl && (
          <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-700 hover:underline">
            Lihat situs ↗
          </a>
        )}
      </div>
      <BrandTabs brandId={brand.id} />
      {children}
    </div>
  );
}
