// Kelengkapan data per brand (ROADMAP F6.10): daftar kekurangan yang memengaruhi situs & data Google.
// Hanya memeriksa data yang memang dibaca template brand itu (lihat template-features).
import { isCompleteWeek } from "@/lib/hours";
import { prisma } from "@/lib/prisma";
import { TEMPLATE_FEATURES } from "@/lib/template-features";

/** Satu kekurangan + tempat memperbaikinya di Admin. */
export type Gap = { key: string; label: string; href: string };

export async function getBrandGaps(brandIds: string[]): Promise<Map<string, Gap[]>> {
  if (!brandIds.length) return new Map();
  const [brands, photoless] = await Promise.all([
    prisma.brand.findMany({
      where: { id: { in: brandIds } },
      select: {
        id: true,
        template: true,
        logoUrl: true,
        instagramUrl: true,
        tiktokUrl: true,
        servesCuisine: true,
        domains: { select: { status: true, sslIssued: true, isPrimary: true } },
        branches: { select: { whatsapp: true, mapsUrl: true, hours: { select: { dayOfWeek: true, isClosed: true, opens: true, closes: true } } } },
        _count: { select: { menuItems: true } },
      },
    }),
    // Hanya menu andalan: tampil sebagai kartu foto di Beranda. Menu biasa tanpa foto memang tampil sebagai baris daftar harga.
    prisma.menuItem.groupBy({ by: ["brandId"], where: { brandId: { in: brandIds }, isFeatured: true, imageUrl: null }, _count: { _all: true } }),
  ]);
  const noPhoto = new Map(photoless.map((r) => [r.brandId, r._count._all]));

  return new Map(
    brands.map((b) => {
      const base = `/admin/brands/${b.id}`;
      const f = TEMPLATE_FEATURES[b.template];
      const gaps: Gap[] = [];
      const add = (key: string, label: string, href: string) => gaps.push({ key, label, href });

      const primary = b.domains.find((d) => d.isPrimary) ?? b.domains[0];
      if (!primary) add("domain", "Belum ada domain", "/admin/domains");
      else if (primary.status !== "ACTIVE" || !primary.sslIssued) add("domain", "Domain belum ACTIVE", "/admin/domains");

      if (f.logo && !b.logoUrl) add("logo", "Logo kosong", base);
      if (!b.instagramUrl) add("ig", "Instagram kosong", base);
      if (!b.tiktokUrl) add("tiktok", "TikTok kosong", base);
      if (!b.servesCuisine.length) add("cuisine", "Jenis masakan kosong", base);

      if (f.dbBranches) {
        const branches = `${base}/branches`;
        if (!b.branches.length) add("branch", "Belum ada cabang", branches);
        const hoursMissing = b.branches.filter((br) => !isCompleteWeek(br.hours)).length;
        if (hoursMissing) add("hours", `Jam 7 hari belum lengkap (${hoursMissing} cabang)`, branches);
        const waMissing = b.branches.filter((br) => !br.whatsapp).length;
        if (waMissing) add("wa", `Cabang tanpa WA (${waMissing})`, branches);
        const mapsMissing = b.branches.filter((br) => !br.mapsUrl).length;
        if (mapsMissing) add("maps", `Cabang tanpa Maps (${mapsMissing})`, branches);
      }

      if (!b._count.menuItems) add("menu", "Menu kosong", `${base}/menu`);
      else if (f.menuPhotos && noPhoto.get(b.id)) add("photo", `Menu andalan tanpa foto (${noPhoto.get(b.id)})`, `${base}/menu`);

      return [b.id, gaps];
    }),
  );
}
