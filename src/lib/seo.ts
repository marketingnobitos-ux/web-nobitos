// Metadata SEO situs publik (ROADMAP F0.2): canonical, Open Graph, Twitter card, title & description per halaman.
import { cache } from "react";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { getActiveBrand } from "@/lib/active-brand";
import { PREVIEW_COOKIE, getBrandBySlugCached, resolveBrandSlugByHost } from "@/lib/brand";
import { getAngloBranches } from "@/lib/anglo-branches";
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

/** Nama cabang brand dari DB (ANGLO: cadangan data kode bila DB kosong). */
export async function branchNames(brand: ActiveBrand): Promise<string[]> {
  if (brand.template === "ANGLO") return (await getAngloBranches(brand.id)).map((b) => b.name);
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
  /** Halaman tidak untuk diindeks (mis. detail menu Bolu yang tipis). */
  noindex?: boolean;
};

// ---- Judul & deskripsi Google yang ditulis manual di Admin > Isi Halaman (F6.14) ----

export const SEO_PAGE_KEY = "seo";
export const SEO_SECTION_KEY = "halaman";
/** Halaman yang punya field SEO di Admin. Kunci = path. */
export const SEO_PAGES = [
  { path: "/", label: "Beranda" },
  { path: "/menu", label: "Menu" },
  { path: "/cabang", label: "Cabang" },
  { path: "/cerita", label: "Cerita" },
] as const;
export type SeoOverride = { title?: string; description?: string };
export type SeoOverrides = Record<string, SeoOverride>;

/** Timpaan judul/deskripsi per path dari tabel PageContent (kosong = rumus otomatis). */
export const getSeoOverrides = cache(async (brandId: string): Promise<SeoOverrides> => {
  const row = await prisma.pageContent.findUnique({
    where: { brandId_pageKey_sectionKey: { brandId, pageKey: SEO_PAGE_KEY, sectionKey: SEO_SECTION_KEY } },
    select: { data: true },
  });
  const data = row?.data;
  return data && typeof data === "object" && !Array.isArray(data) ? (data as SeoOverrides) : {};
});

/** Kota brand untuk judul lokal: semua brand Nobitos di Cirebon, dicek dari alamat cabang. */
export async function brandCity(brand: ActiveBrand): Promise<string | null> {
  const addresses =
    brand.template === "ANGLO"
      ? (await getAngloBranches(brand.id)).map((b) => b.address)
      : (await prisma.branch.findMany({ where: { brandId: brand.id }, select: { address: true } })).map((b) => b.address);
  return addresses.some((a) => /cirebon/i.test(a)) || brand.template === "ANGLO" ? "Cirebon" : null;
}

/**
 * Judul Beranda dengan jenis makanan + kota supaya cocok dengan pencarian lokal (mis. "bakmi jawa cirebon"):
 * "Bakmi Jowo Anglo Pak Joko — Bakmi Jawa di Cirebon", "Pecel Lele Sambel Dadak Aminoto di Cirebon".
 * Tagline yang sudah menyebut kota tetap dipakai ("Bolu Sunyaragi — Dari Cirebon, pulang membawa rasa").
 */
export function homeTitle(brand: ActiveBrand, city: string | null, max = 65): string {
  const name = brand.name;
  if (brand.tagline && city && brand.tagline.toLowerCase().includes(city.toLowerCase()) && `${name} — ${brand.tagline}`.length <= max) {
    return `${name} — ${brand.tagline}`;
  }
  const cuisine = brand.servesCuisine[0];
  if (city && cuisine && !name.toLowerCase().includes(cuisine.toLowerCase())) {
    const t = `${name} — ${cuisine} di ${city}`;
    if (t.length <= max) return t;
  }
  if (city && `${name} di ${city}`.length <= max) return `${name} di ${city}`;
  return name;
}

/** Metadata lengkap satu halaman publik. Open Graph & Twitter ditulis penuh karena tidak diwarisi sebagian dari layout. */
export async function pageMetadata(brand: ActiveBrand, { title, absoluteTitle, description, path, noindex }: PageSeo): Promise<Metadata> {
  // Judul/deskripsi manual dari Admin menang atas rumus otomatis. Judul manual dipakai utuh (tanpa " · Nama Brand").
  const manual = (await getSeoOverrides(brand.id))[path];
  if (manual?.title) {
    title = manual.title;
    absoluteTitle = true;
  }
  if (manual?.description) description = manual.description;
  const fullTitle = absoluteTitle ? title : `${title} · ${brand.name}`;
  const desc = clip(description);
  const image = ogImage(brand);
  const origin = await siteOrigin(brand.id);
  return {
    metadataBase: origin,
    title: absoluteTitle ? { absolute: title } : title,
    description: desc,
    // URL penuh supaya beranda tetap "https://domain/" (sama dengan sitemap).
    alternates: { canonical: new URL(path, origin).toString() },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
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
