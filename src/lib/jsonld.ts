// Data terstruktur Google (ROADMAP F0.4): satu schema.org `Restaurant` per cabang, dirender di Beranda & Cabang.
// Aturan: tidak ada data karangan. Field yang nilainya belum ada di DB / src/data/brands tidak dirender.
import type { Brand } from "@prisma/client";
import { BAKMI_PAK_JOKO, type AngloBranch } from "@/data/brands/bakmi-pak-joko";
import { formatRupiah, slugify, toIntlPhone } from "@/lib/format";
import { SCHEMA_DAYS, type DayHours } from "@/lib/hours";
import { prisma } from "@/lib/prisma";
import { ogImage, siteOrigin } from "@/lib/seo";

type JsonLd = Record<string, unknown>;

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

/** Cabang brand. Template ANGLO membaca cabang dari src/data/brands, selebihnya dari DB (+ tabel BranchHours). */
async function branchSources(brand: Brand): Promise<BranchSource[]> {
  if (brand.template === "ANGLO") {
    return BAKMI_PAK_JOKO.branches.map((b: AngloBranch) => ({
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

const TIME = /^\d{2}:\d{2}$/;

/**
 * Jam buka -> OpeningHoursSpecification, hari berjam sama digabung. Hanya dirender kalau ketujuh hari sudah diisi:
 * schema.org menganggap hari yang tidak disebut = tutup, jadi jam yang belum lengkap tidak boleh ikut.
 */
function openingHoursSpec(hours: DayHours[]): JsonLd[] | undefined {
  const days = new Set(hours.map((h) => h.dayOfWeek));
  if (![1, 2, 3, 4, 5, 6, 7].every((d) => days.has(d))) return undefined;
  const groups = new Map<string, string[]>();
  for (const h of hours) {
    if (h.isClosed) continue; // hari libur: tidak disebut
    if (!h.opens || !h.closes || !TIME.test(h.opens) || !TIME.test(h.closes)) return undefined;
    const slot = `${h.opens}-${h.closes}`;
    groups.set(slot, [...(groups.get(slot) ?? []), SCHEMA_DAYS[h.dayOfWeek - 1]]);
  }
  if (groups.size === 0) return undefined;
  return [...groups].map(([slot, dayOfWeek]) => {
    const [opens, closes] = slot.split("-");
    return { "@type": "OpeningHoursSpecification", dayOfWeek, opens, closes };
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
      "@type": "Restaurant",
      "@id": url(`/cabang#${b.key}`),
      name: `${brand.name} — ${b.name}`,
      url: url("/cabang"),
      image,
      // TODO: konfirmasi Fran — addressLocality, addressRegion & postalCode belum terstruktur (alamat masih satu teks).
      address: { "@type": "PostalAddress", streetAddress: b.address, addressCountry: "ID" },
      // TODO: konfirmasi Fran — cabang tanpa lat/lng (Pak Joko, Aminoto) tidak punya `geo`.
      geo: b.lat != null && b.lng != null ? { "@type": "GeoCoordinates", latitude: b.lat, longitude: b.lng } : undefined,
      hasMap: b.mapsUrl,
      // TODO: konfirmasi Fran — jam buka terstruktur Aminoto & APW belum ada, jadi tidak dirender.
      openingHoursSpecification: openingHoursSpec(b.hours),
      // TODO: konfirmasi Fran — servesCuisine brand selain Pak Joko masih kosong.
      servesCuisine: brand.servesCuisine,
      priceRange: prices,
      menu: url("/menu"),
      telephone: phone ? `+${toIntlPhone(phone)}` : undefined,
      // TODO: konfirmasi Fran — Instagram/TikTok Aminoto & APW belum diisi di Brand.
      sameAs,
    });
  });

  return { "@context": "https://schema.org", "@graph": restaurants };
}
