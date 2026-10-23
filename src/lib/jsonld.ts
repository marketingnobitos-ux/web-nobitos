// Data terstruktur Google (ROADMAP F0.4): satu schema.org `Restaurant` (atau subtipe lain, lihat BUSINESS_TYPE) per cabang,
// dirender di Beranda & Cabang.
// Aturan: tidak ada data karangan. Field yang nilainya belum ada di DB / src/data/brands tidak dirender.
import type { Brand } from "@prisma/client";
import { getAngloBranches } from "@/lib/anglo-branches";
import { formatRupiah, slugify, toIntlPhone } from "@/lib/format";
import { SCHEMA_DAYS, isCompleteWeek, type DayHours } from "@/lib/hours";
import { prisma } from "@/lib/prisma";
import { ogImage, siteOrigin } from "@/lib/seo";

type JsonLd = Record<string, unknown>;

/** Jenis usaha schema.org per brand (subtipe FoodEstablishment). Brand yang tidak tercantum = `Restaurant`. */
const BUSINESS_TYPE: Record<string, string> = {
  "bolu-sunyaragi": "Bakery", // toko kue & oleh-oleh, bukan rumah makan
};

type BranchSource = {
  key: string;
  name: string;
  address: string;
  lat?: number | null;
  lng?: number | null;
  mapsUrl?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  hours: DayHours[];
};

/** Cabang brand dari DB (+ tabel BranchHours). ANGLO lewat getAngloBranches (cadangan data kode bila DB kosong). */
async function branchSources(brand: Brand): Promise<BranchSource[]> {
  if (brand.template === "ANGLO") {
    return (await getAngloBranches(brand.id)).map((b) => ({
      key: b.slug,
      name: b.name,
      address: b.address,
      lat: b.lat,
      lng: b.lng,
      mapsUrl: b.mapsUrl,
      whatsapp: b.whatsapp,
      hours: b.openingHours ?? [],
    }));
  }
  const rows = await prisma.branch.findMany({
    where: { brandId: brand.id },
    orderBy: { order: "asc" },
    include: { hours: { orderBy: { dayOfWeek: "asc" } } },
  });
  return rows.map((b) => ({ ...b, key: slugify(b.name) }));
}

/**
 * Jam buka -> OpeningHoursSpecification, hari berjam sama digabung. Hanya dirender kalau ketujuh hari sudah diisi:
 * schema.org menganggap hari yang tidak disebut = tutup, jadi jam yang belum lengkap tidak boleh ikut.
 */
function openingHoursSpec(hours: DayHours[]): JsonLd[] | undefined {
  if (!isCompleteWeek(hours)) return undefined;
  const groups = new Map<string, string[]>();
  for (const h of hours) {
    if (h.isClosed) continue; // hari libur: tidak disebut
    const slot = `${h.opens}-${h.closes}`;
    groups.set(slot, [...(groups.get(slot) ?? []), SCHEMA_DAYS[h.dayOfWeek - 1]]);
  }
  if (groups.size === 0) return undefined;
  return [...groups].map(([slot, dayOfWeek]) => {
    const [opens, closes] = slot.split("-");
    // Tutup tengah malam: Google menyarankan "23:59", bukan "00:00" (dibaca tutup di awal hari).
    return { "@type": "OpeningHoursSpecification", dayOfWeek, opens, closes: closes === "00:00" ? "23:59" : closes };
  });
}

/** Kisaran harga dari menu yang tersedia, mis. "Rp 2.000 – Rp 21.000". */
async function priceRange(brandId: string): Promise<string | undefined> {
  const { _min, _max } = await prisma.menuItem.aggregate({
    where: { brandId, isAvailable: true },
    _min: { price: true },
    _max: { price: true },
  });
  if (_min.price == null || _max.price == null) return undefined;
  return _min.price === _max.price ? formatRupiah(_min.price) : `${formatRupiah(_min.price)} – ${formatRupiah(_max.price)}`;
}

/** Hapus field kosong (undefined, null, "", []) supaya tidak ada nilai kosong yang ikut dirender. */
function compact(obj: JsonLd): JsonLd {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v != null && v !== "" && !(Array.isArray(v) && v.length === 0)),
  );
}

/** Graph JSON-LD semua cabang brand, atau null kalau brand belum punya cabang. */
export async function restaurantJsonLd(brand: Brand): Promise<JsonLd | null> {
  const [origin, branches, prices] = await Promise.all([siteOrigin(brand.id), branchSources(brand), priceRange(brand.id)]);
  if (branches.length === 0) return null;

  const url = (path: string) => new URL(path, origin).toString();
  const image = url(brand.logoUrl ?? ogImage(brand).url);
  const sameAs = [brand.instagramUrl, brand.tiktokUrl].filter(Boolean);

  const restaurants = branches.map((b) => {
    const phone = b.phone ?? b.whatsapp;
    return compact({
      "@type": BUSINESS_TYPE[brand.slug] ?? "Restaurant",
      "@id": url(`/cabang#${b.key}`),
      name: `${brand.name} — ${b.name}`,
      url: url("/cabang"),
      image,
      address: b.address ? postalAddress(b.address) : undefined,
      // TODO: konfirmasi Fran — cabang tanpa lat/lng (Aminoto) tidak punya `geo`.
      geo: b.lat != null && b.lng != null ? { "@type": "GeoCoordinates", latitude: b.lat, longitude: b.lng } : undefined,
      hasMap: b.mapsUrl,
      // TODO: konfirmasi Fran — jam buka terstruktur Aminoto belum ada, jadi tidak dirender.
      openingHoursSpecification: openingHoursSpec(b.hours),
      // TODO: konfirmasi Fran — servesCuisine brand selain Pak Joko masih kosong.
      servesCuisine: brand.servesCuisine,
      priceRange: prices,
      menu: url("/menu"),
      telephone: phone ? `+${toIntlPhone(phone)}` : undefined,
      // TODO: konfirmasi Fran — Instagram/TikTok Aminoto belum diisi di Brand.
      sameAs,
    });
  });

  return { "@context": "https://schema.org", "@graph": restaurants };
}

/**
 * Alamat bebas -> PostalAddress terstruktur. Semua cabang Nobitos di wilayah Cirebon: kota & provinsi diisi bila
 * alamat menyebut "Cirebon"; kode pos 5 digit diambil dari teks. Field yang tidak ketemu tidak dirender.
 */
export function postalAddress(text: string): JsonLd {
  const cirebon = /\bcirebon\b/i.test(text);
  const postalCode = text.match(/\b\d{5}\b/)?.[0];
  return compact({
    "@type": "PostalAddress",
    streetAddress: text,
    addressLocality: cirebon ? "Cirebon" : undefined,
    addressRegion: cirebon || /jawa barat/i.test(text) ? "Jawa Barat" : undefined,
    postalCode,
    addressCountry: "ID",
  });
}

/** WebSite + Organization brand (Beranda). Organization menautkan akun sosial & induk usaha Nobitos. */
export async function siteJsonLd(brand: Brand): Promise<JsonLd> {
  const origin = await siteOrigin(brand.id);
  const url = (path: string) => new URL(path, origin).toString();
  const sameAs = [brand.instagramUrl, brand.tiktokUrl].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@graph": [
      compact({ "@type": "WebSite", "@id": url("/#website"), url: url("/"), name: brand.name, inLanguage: "id-ID", publisher: { "@id": url("/#organization") } }),
      compact({
        "@type": "Organization",
        "@id": url("/#organization"),
        name: brand.name,
        url: url("/"),
        logo: brand.logoUrl ? url(brand.logoUrl) : undefined,
        description: brand.tagline,
        sameAs,
        parentOrganization: { "@type": "Organization", name: "Nobitos" },
      }),
    ],
  };
}

/** BreadcrumbList "Beranda › <halaman>" untuk halaman selain Beranda. */
export async function breadcrumbJsonLd(brand: Brand, items: { name: string; path: string }[]): Promise<JsonLd> {
  const origin = await siteOrigin(brand.id);
  const all = [{ name: "Beranda", path: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: new URL(it.path, origin).toString() })),
  };
}

/** Menu (schema.org Menu → MenuSection → MenuItem + harga) dari menu yang tersedia. Null bila belum ada menu. */
export async function menuJsonLd(brand: Brand): Promise<JsonLd | null> {
  const [origin, categories] = await Promise.all([
    siteOrigin(brand.id),
    prisma.menuCategory.findMany({
      where: { brandId: brand.id },
      orderBy: [{ order: "asc" }, { name: "asc" }],
      select: { name: true, items: { where: { isAvailable: true }, orderBy: [{ order: "asc" }, { createdAt: "asc" }], select: { name: true, description: true, price: true } } },
    }),
  ]);
  const sections = categories.filter((c) => c.items.length);
  if (!sections.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": new URL("/menu#menu", origin).toString(),
    name: `Menu ${brand.name}`,
    url: new URL("/menu", origin).toString(),
    inLanguage: "id-ID",
    hasMenuSection: sections.map((c) => ({
      "@type": "MenuSection",
      name: c.name,
      hasMenuItem: c.items.map((i) =>
        compact({
          "@type": "MenuItem",
          name: i.name,
          description: i.description,
          offers: { "@type": "Offer", price: i.price, priceCurrency: "IDR" },
        }),
      ),
    })),
  };
}
