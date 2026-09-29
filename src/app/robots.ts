// /robots.txt per domain (ROADMAP F0.3). Domain brand: boleh dirayapi + alamat sitemap.
// Host admin & host tak dikenal: tutup semua supaya panel dan halaman "Brand tidak ditemukan" tidak terindeks.
import type { MetadataRoute } from "next";
import { brandFromHost, siteOrigin } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const brand = await brandFromHost();
  if (!brand) return { rules: { userAgent: "*", disallow: "/" } };

  const origin = await siteOrigin(brand.id);
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: new URL("/sitemap.xml", origin).toString(),
    host: origin.host,
  };
}
