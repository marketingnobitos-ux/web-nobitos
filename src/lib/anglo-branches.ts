// Cabang template ANGLO (Bakmi Pak Joko). Sejak F6.13 dibaca dari tabel Branch supaya bisa diubah di Admin.
// Cadangan: selama brand belum punya cabang di DB (sebelum `npm run bakmi-pak-joko:cabang`), pakai data di kode.
import { cache } from "react";
import { BAKMI_PAK_JOKO, type AngloBranch } from "@/data/brands/bakmi-pak-joko";
import { slugify } from "@/lib/format";
import { prisma } from "@/lib/prisma";

/** Cabang yang kartunya diberi strip Dapur Bu Joko (satu lokasi). */
const BU_JOKO_BRANCH = "kartini";

export const getAngloBranches = cache(async (brandId: string): Promise<AngloBranch[]> => {
  const rows = await prisma.branch.findMany({
    where: { brandId },
    orderBy: { order: "asc" },
    include: { hours: { orderBy: { dayOfWeek: "asc" } } },
  });
  if (!rows.length) return BAKMI_PAK_JOKO.branches;
  return rows.map((b) => {
    const slug = slugify(b.name);
    return {
      slug,
      name: b.name,
      address: b.address,
      hours: b.openHours ?? undefined,
      openingHours: b.hours.length ? b.hours : undefined,
      lat: b.lat ?? undefined,
      lng: b.lng ?? undefined,
      whatsapp: b.whatsapp ?? "",
      mapsUrl: b.mapsUrl ?? "",
      showBuJoko: slug === BU_JOKO_BRANCH,
    };
  });
});
