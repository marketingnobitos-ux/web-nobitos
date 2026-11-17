// Perbarui cabang Ayam Panggang Wicaksono (17 Nov 2026): jam Kesambi jadi 17.00–00.00 (Kamis libur) dan tambah cabang
// Sumber (10.00–22.00 setiap hari, satu tempat dengan Aminoto Sumber). Data dari src/data/brands/apw.ts (APW_BRANCHES).
// Berbeda dengan `npm run apw:seed`: hanya menyentuh cabang & jam buka brand `apw`. Menu, teks halaman (Admin), promo,
// dan cabang lain tidak diubah. Cabang yang sudah ada hanya diperbarui jam & teks jamnya; WhatsApp, telepon, alamat,
// dan pin yang mungkin sudah diubah di Admin tidak ditimpa. Cabang yang belum ada dibuat lengkap.
//   npm run apw:cabang                  (DB lokal)
//   npm run apw:cabang -- --izinkan-vps (VPS, setelah backup DB)
import { PrismaClient } from "@prisma/client";
import { APW_BRANCHES } from "../src/data/brands/apw";
import { APW_SLUG } from "./apw";

const prisma = new PrismaClient();

async function main() {
  const url = process.env.DATABASE_URL ?? "";
  const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
  if (!local && !process.argv.includes("--izinkan-vps")) {
    throw new Error("DATABASE_URL bukan lokal. Jalankan dengan --izinkan-vps setelah backup DB.");
  }

  const brand = await prisma.brand.findUnique({ where: { slug: APW_SLUG }, select: { id: true } });
  if (!brand) throw new Error(`Brand ${APW_SLUG} tidak ada.`);

  for (const [order, b] of APW_BRANCHES.entries()) {
    const { slug: _slug, area: _area, hours, ...fields } = b;
    const existing = await prisma.branch.findFirst({ where: { brandId: brand.id, name: b.name }, select: { id: true } });
    const branch = await prisma.$transaction(async (tx) => {
      const row = existing
        ? await tx.branch.update({ where: { id: existing.id }, data: { openHours: b.openHours } })
        : await tx.branch.create({ data: { brandId: brand.id, ...fields, phone: null, order } });
      await tx.branchHours.deleteMany({ where: { branchId: row.id } });
      await tx.branchHours.createMany({ data: hours.map((h) => ({ branchId: row.id, ...h })) });
      return row;
    });
    console.log(`✔ ${existing ? "diperbarui" : "dibuat"}: ${branch.name} — ${b.openHours}`);
  }

  const branches = await prisma.branch.findMany({ where: { brandId: brand.id }, orderBy: { order: "asc" }, select: { name: true, order: true } });
  console.log(`Cabang APW sekarang: ${branches.map((b) => `${b.name} (urutan ${b.order})`).join(", ")}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
