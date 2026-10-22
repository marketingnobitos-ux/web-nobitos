import Link from "next/link";
import GapBadges from "@/components/admin/GapBadges";
import { Card, PageHeader, PublishBadge } from "@/components/admin/fields";
import { listAccessibleBrands, requireAdmin } from "@/lib/admin";
import { getBrandGaps } from "@/lib/brand-health";
import { prisma } from "@/lib/prisma";
import { TEMPLATE_LABEL } from "@/lib/template-features";

export const metadata = { title: "Brand & Outlet" };

export default async function BrandsPage() {
  const admin = await requireAdmin();
  const ids = (await listAccessibleBrands(admin)).map((b) => b.id);
  const [brands, gaps] = await Promise.all([
    prisma.brand.findMany({
      where: { id: { in: ids } },
      orderBy: { name: "asc" },
      include: {
        domains: { where: { isPrimary: true }, take: 1 },
        _count: { select: { menuItems: true, branches: true } },
      },
    }),
    getBrandGaps(ids),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Brand & Outlet"
        description="Badge kuning = data yang belum lengkap. Klik badge untuk langsung melengkapinya."
        actions={
          admin.role === "SUPER_ADMIN" && (
            <Link href="/admin/brands/new" className="adm-btn">
              + Tambah brand
            </Link>
          )
        }
      />

      {brands.length === 0 && <p className="text-sm text-gray-500">Belum ada brand yang bisa Anda kelola.</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {brands.map((b) => (
          <Card key={b.id}>
            <div className="flex items-start gap-3">
              {b.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={b.logoUrl} alt="" loading="lazy" className="h-12 w-12 shrink-0 rounded-full border border-gray-200 bg-white object-contain p-1" />
              ) : (
                <span className="h-12 w-12 shrink-0 rounded-full" style={{ background: b.colorPrimary }} />
              )}
              <div className="min-w-0 flex-1">
                <Link href={`/admin/brands/${b.id}`} className="text-[17px] font-bold leading-tight hover:underline">
                  {b.name}
                </Link>
                <p className="truncate text-xs text-gray-500">{b.domains[0]?.hostname ?? `slug: ${b.slug}`}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <PublishBadge published={b.isPublished} />
                  <span>{TEMPLATE_LABEL[b.template]}</span>
                  <span aria-hidden>·</span>
                  <span>{b._count.menuItems} menu</span>
                  <span aria-hidden>·</span>
                  <span>{b._count.branches} cabang</span>
                </div>
              </div>
            </div>
            <div className="mt-4 border-t border-gray-100 pt-3">
              <GapBadges gaps={gaps.get(b.id) ?? []} max={4} />
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5 text-sm">
              {[
                ["Profil", ""],
                ["Daftar Menu", "/menu"],
                ["Lokasi & Jam", "/branches"],
                ["Isi Halaman", "/pages"],
              ].map(([label, path]) => (
                <Link key={label} href={`/admin/brands/${b.id}${path}`} className="rounded-full border border-gray-300 px-3 py-1.5 font-semibold hover:border-gray-900">
                  {label}
                </Link>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
