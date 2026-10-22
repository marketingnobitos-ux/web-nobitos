// Metadata SEO situs publik (ROADMAP F0.2): canonical, Open Graph, Twitter card, title & description per halaman.
import { cache } from "react";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { getActiveBrand } from "@/lib/active-brand";
import { PREVIEW_COOKIE, getBrandBySlugCached, resolveBrandSlugByHost } from "@/lib/brand";
import { BAKMI_PAK_JOKO } from "@/data/brands/bakmi-pak-joko";
import { prisma } from "@/lib/prisma";

type ActiveBrand = NonNullable<Awaited<ReturnType<typeof getActiveBrand>>>;

/** Batas aman panjang description di hasil pencarian. */
const DESCRIPTION_MAX = 160;

/**
 * Origin kanonik brand: domain ACTIVE di DB (yang isPrimary didahulukan), supaya www/alias tidak dianggap duplikat.
 * Brand tanpa domain aktif (mis. preview lokal) memakai host request.
 */
export const siteOrigin = cache(async (brandId: string): Promise<URL> => {
  const domain = await prisma.domain.findFirst({
    where: { brandId, status: "ACTIVE" },
    orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
    select: { hostname: true },
  });
  if (domain) return new URL(`https://${domain.hostname}`);
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  // localhost & domain lokal "*.localhost" (preview brand di dev) dilayani lewat http.
  const local = /^(?:[^/]+\.)?localhost(?::\d+)?$/.test(host);
  const proto = h.get("x-forwarded-proto") ?? (local ? "http" : "https");
  return new URL(`${proto}://${host}`);
});

/**
 * Brand untuk /robots.txt & /sitemap.xml. Kedua route dilewati middleware (path berekstensi), jadi brand dicari
 * langsung dari hostname; saat dev juga dari cookie preview. Null untuk host admin / host tak dikenal.
 */
export async function brandFromHost() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  let slug = await resolveBrandSlugByHost(host);
  if (!slug && process.env.NODE_ENV !== "production") slug = (await cookies()).get(PREVIEW_COOKIE)?.value ?? null;
  return slug ? getBrandBySlugCached(slug) : null;
}

/** Rapikan teks (hapus penanda *miring*, spasi ganda) lalu potong di batas kata. */
export function clip(text: string, max = DESCRIPTION_MAX): string {
  const clean = text.replace(/\*/g, "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:\s]+$/, "")}…`;
}

/** "A, B dan C" */
export function joinNames(names: string[]): string {
  return names.length <= 1 ? (names[0] ?? "") : `${names.slice(0, -1).join(", ")} dan ${names.at(-1)}`;
}

/** Nama cabang brand. Template ANGLO membaca cabang dari src/data/brands, selebihnya dari DB. */
export async function branchNames(brand: ActiveBrand): Promise<string[]> {
  if (brand.template === "ANGLO") return BAKMI_PAK_JOKO.branches.map((b) => b.name);
  const rows = await prisma.branch.findMany({ where: { brandId: brand.id }, orderBy: { order: "asc" }, select: { name: true } });
  return rows.map((r) => r.name);
}

/** Gambar share (Open Graph) brand dari /og-image. Versi di URL supaya cache pratinjau (WA, FB) ikut berganti saat brand diubah. */
export function ogImage(brand: ActiveBrand) {
  return { url: `/og-image?v=${brand.updatedAt.getTime()}`, width: 1200, height: 630, alt: brand.name };
}

type PageSeo = {
  /** Judul halaman; digabung dengan nama brand ("Menu · Nama Brand") kecuali `absoluteTitle`. */
  title: string;
  absoluteTitle?: boolean;
  description: string;
  /** Path halaman ini, mis. "/menu". */
  path: string;
};

/** Metadata lengkap satu halaman publik. Open Graph & Twitter ditulis penuh karena tidak diwarisi sebagian dari layout. */
export async function pageMetadata(brand: ActiveBrand, { title, absoluteTitle, description, path }: PageSeo): Promise<Metadata> {
  const fullTitle = absoluteTitle ? title : `${title} · ${brand.name}`;
  const desc = clip(description);
  const image = ogImage(brand);
  return {
    metadataBase: await siteOrigin(brand.id),
    title: absoluteTitle ? { absolute: title } : title,
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "id_ID",
      siteName: brand.name,
      url: path,
      title: fullTitle,
      description: desc,
      images: [image],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description: desc, images: [image.url] },
  };
}

/** Pintasan untuk generateMetadata: brand aktif + builder deskripsi. Tanpa brand -> metadata kosong. */
export async function brandPageMetadata(
  build: (brand: ActiveBrand) => Promise<PageSeo> | PageSeo,
): Promise<Metadata> {
  const brand = await getActiveBrand();
  if (!brand) return {};
  return pageMetadata(brand, await build(brand));
}
