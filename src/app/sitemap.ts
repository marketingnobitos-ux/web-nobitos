// /sitemap.xml per domain (ROADMAP F0.3), dari halaman yang benar-benar dipakai template brand.
import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { brandFromHost, siteOrigin } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const brand = await brandFromHost();
  if (!brand) return [];

  const origin = await siteOrigin(brand.id);
  const url = (path: string) => new URL(path, origin).toString();
  // ANGLO, TUNGKU, DADAK & GERABAH tidak punya halaman galeri & detail menu (keduanya redirect), jadi tidak dicantumkan.
  const anglo = brand.template === "ANGLO" || brand.template === "TUNGKU" || brand.template === "DADAK" || brand.template === "GERABAH";

  const [photoCount, items] = await Promise.all([
    anglo ? 0 : prisma.galleryPhoto.count({ where: { album: { brandId: brand.id } } }),
    anglo
      ? []
      : prisma.menuItem.findMany({
          where: { brandId: brand.id, isAvailable: true },
          orderBy: [{ category: { order: "asc" } }, { order: "asc" }],
          select: { id: true, createdAt: true },
        }),
  ]);

  const lastModified = brand.updatedAt;
  return [
    { url: url("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    { url: url("/menu"), lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: url("/cabang"), lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: url("/cerita"), lastModified, changeFrequency: "monthly", priority: 0.6 },
    ...(photoCount > 0 ? [{ url: url("/galeri"), lastModified, changeFrequency: "monthly" as const, priority: 0.5 }] : []),
    ...items.map((i) => ({ url: url(`/menu/${i.id}`), lastModified: i.createdAt, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
