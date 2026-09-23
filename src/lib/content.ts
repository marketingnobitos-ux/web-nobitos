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
