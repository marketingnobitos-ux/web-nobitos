// Pindahkan cabang Bakmi Jowo Anglo Pak Joko dari kode (src/data/brands/bakmi-pak-joko.ts) ke tabel Branch (F6.13),
// supaya alamat, jam, WhatsApp & Maps bisa diubah dari Admin > Lokasi & Jam Buka.
// Hanya mengisi bila brand belum punya cabang di DB; tidak menimpa data yang sudah diubah di Admin.
// Dengan --samakan-jam: cabang yang sudah ada di DB (dicocokkan lewat nama) diberi jam buka dari kode
// (teks jam + jam per hari). Alamat, WhatsApp & Maps tidak diubah. Dipakai 25 Nov 2026: Kartini tutup 23.30.
//   npm run bakmi-pak-joko:cabang                 (DB lokal)
//   npm run bakmi-pak-joko:cabang -- --izinkan-vps (VPS, setelah backup DB)
//   npm run bakmi-pak-joko:cabang -- --samakan-jam [--izinkan-vps]
import { PrismaClient } from "@prisma/client";
import { BAKMI_PAK_JOKO } from "../src/data/brands/bakmi-pak-joko";

const prisma = new PrismaClient();
const SLUG = "bakmi-pak-joko";

async function main() {
  const url = process.env.DATABASE_URL ?? "";
  const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
  if (!local && !process.argv.includes("--izinkan-vps")) {
    throw new Error("DATABASE_URL bukan lokal. Jalankan dengan --izinkan-vps setelah backup DB.");
  }

  const brand = await prisma.brand.findUnique({ where: { slug: SLUG }, select: { id: true, _count: { select: { branches: true } } } });
  if (!brand) throw new Error(`Brand ${SLUG} tidak ada.`);
  if (brand._count.branches > 0 && process.argv.includes("--samakan-jam")) {
    for (const b of BAKMI_PAK_JOKO.branches) {
      const row = await prisma.branch.findFirst({ where: { brandId: brand.id, name: b.name }, select: { id: true } });
      if (!row) {
        console.log(`- Cabang ${b.name} tidak ada di DB, dilewati.`);
        continue;
      }
      const days = b.openingHours ?? [];
      await prisma.$transaction([
        prisma.branch.update({ where: { id: row.id }, data: { openHours: b.hours ?? null } }),
        prisma.branchHours.deleteMany({ where: { branchId: row.id } }),
        prisma.branchHours.createMany({
          data: days.map((h) => ({ branchId: row.id, dayOfWeek: h.dayOfWeek, isClosed: h.isClosed, opens: h.opens, closes: h.closes })),
        }),
      ]);
      console.log(`✔ Jam ${b.name}: ${b.hours ?? "-"}`);
    }
    return;
  }
  if (brand._count.branches > 0) {
    console.log(`Brand ${SLUG} sudah punya ${brand._count.branches} cabang di DB. Tidak ada yang diubah.`);
    return;
  }

  for (const [order, b] of BAKMI_PAK_JOKO.branches.entries()) {
    await prisma.branch.create({
      data: {
        brandId: brand.id,
        name: b.name,
        address: b.address,
        mapsUrl: b.mapsUrl,
        lat: b.lat ?? null,
        lng: b.lng ?? null,
        openHours: b.hours ?? null,
        whatsapp: b.whatsapp,
        order,
        hours: { create: (b.openingHours ?? []).map((h) => ({ dayOfWeek: h.dayOfWeek, isClosed: h.isClosed, opens: h.opens, closes: h.closes })) },
      },
    });
    console.log(`✔ Cabang ${b.name} dibuat.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
