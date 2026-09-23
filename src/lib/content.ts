// Pengambil data konten situs publik per brand.
import { prisma } from "@/lib/prisma";

/** Bentuk data JSON di PageContent.data yang dipakai situs publik. */
export type SectionData = {
  title?: string;
  subtitle?: string;
  body?: string;
  imageUrl?: string;
  items?: string[];
};

export type Section = { key: string; data: SectionData };

function toSectionData(raw: unknown): SectionData {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const r = raw as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" && v.trim() ? v : undefined);
  return {
    title: str(r.title),
    subtitle: str(r.subtitle),
    body: str(r.body),
    imageUrl: str(r.imageUrl),
    items: Array.isArray(r.items) ? r.items.filter((i): i is string => typeof i === "string") : undefined,
  };
}

/** Section yang tampil untuk satu halaman, urut sesuai `order`. */
export async function getSections(brandId: string, pageKey: string): Promise<Section[]> {
  const rows = await prisma.pageContent.findMany({
    where: { brandId, pageKey, isVisible: true },
    orderBy: { order: "asc" },
  });
  return rows.map((r) => ({ key: r.sectionKey, data: toSectionData(r.data) }));
}

/** Promo aktif & dalam rentang tanggal (kalau tanggal diisi). */
export function getActivePromos(brandId: string) {
  const now = new Date();
  return prisma.promo.findMany({
    where: {
      brandId,
      isActive: true,
      AND: [
        { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
        { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
      ],
    },
    orderBy: { order: "asc" },
  });
}

type SectionField = "title" | "subtitle" | "body" | "imageUrl" | "items";

/** Section yang bisa diedit dari admin, per halaman publik. */
export const PAGE_SECTIONS: {
  pageKey: string;
  sectionKey: string;
  label: string;
  fields: SectionField[];
  imageLabel?: string;
  itemsHint?: string;
}[] = [
  {
    pageKey: "home",
    sectionKey: "hero",
    label: "Beranda — Hero sambutan",
    fields: ["title", "subtitle", "imageUrl"],
    imageLabel: "Foto hero (layar penuh, sebaiknya foto makanan landscape)",
  },
  {
    pageKey: "home",
    sectionKey: "process",
    label: "Beranda — Cerita singkat (teks berganti saat scroll)",
    fields: ["body", "items", "imageUrl"],
    imageLabel: "Foto proses (mis. ngulek sambal)",
    itemsHint: "Satu baris per langkah, mis. Diulek. / Digoreng. / Disajikan hangat.",
  },
  {
    pageKey: "site",
    sectionKey: "social",
    label: "Footer — Sosial media",
    fields: ["items"],
    itemsHint: "Satu akun per baris: Nama | link. Contoh: Instagram | https://instagram.com/namaakun",
  },
  { pageKey: "story", sectionKey: "profile", label: "Cerita — Profil", fields: ["title", "subtitle", "body", "imageUrl"] },
  { pageKey: "story", sectionKey: "history", label: "Cerita — Sejarah", fields: ["title", "body", "imageUrl"] },
  { pageKey: "story", sectionKey: "values", label: "Cerita — Nilai", fields: ["title", "body", "items"] },
  { pageKey: "story", sectionKey: "atmosphere", label: "Cerita — Suasana outlet", fields: ["title", "body", "imageUrl"] },
];
