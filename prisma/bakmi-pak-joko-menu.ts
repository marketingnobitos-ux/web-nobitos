// Samakan menu Bakmi Jowo Anglo Pak Joko dengan BAKMI_PAK_JOKO_MENU di prisma/bakmi-pak-joko.ts
// (25 Nov 2026: foto menu baru dari Fran, bakmi dipisah telur ayam / telur bebek).
// Berbeda dengan `npm run bakmi-pak-joko:seed`: hanya menyentuh menu brand `bakmi-pak-joko`. Cabang, teks halaman & galeri
// tidak diubah. Item dicocokkan lewat nama, lalu nama lama (`formerly`), jadi baris lama diganti nama dan fotonya tetap.
// Harga, kategori, deskripsi, unggulan & urutan ikut kode; foto & status "tersedia" tidak diubah.
// Item & kategori yang tidak ada di BAKMI_PAK_JOKO_MENU dihapus.
//   npm run bakmi-pak-joko:menu                  (DB lokal)
//   npm run bakmi-pak-joko:menu -- --izinkan-vps (VPS, setelah backup DB)
import { PrismaClient } from "@prisma/client";
import { BAKMI_PAK_JOKO_MENU, BAKMI_PAK_JOKO_SLUG } from "./bakmi-pak-joko";

const prisma = new PrismaClient();

async function main() {
  const url = process.env.DATABASE_URL ?? "";
  const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
  if (!local && !process.argv.includes("--izinkan-vps")) {
    throw new Error("DATABASE_URL bukan lokal. Jalankan dengan --izinkan-vps setelah backup DB.");
  }

  const brand = await prisma.brand.findUnique({ where: { slug: BAKMI_PAK_JOKO_SLUG }, select: { id: true } });
  if (!brand) throw new Error(`Brand ${BAKMI_PAK_JOKO_SLUG} tidak ada.`);
  const where = { brandId: brand.id };

  const result = await prisma.$transaction(async (tx) => {
    const keepItems: string[] = [];
    const keepCats: string[] = [];
    let created = 0;
    let updated = 0;
    const renamed: string[] = [];

    for (const [ci, cat] of BAKMI_PAK_JOKO_MENU.entries()) {
      const existingCat = await tx.menuCategory.findFirst({ where: { ...where, name: cat.name } });
      const category = existingCat
        ? await tx.menuCategory.update({ where: { id: existingCat.id }, data: { order: ci } })
        : await tx.menuCategory.create({ data: { ...where, name: cat.name, order: ci } });
      keepCats.push(category.id);

      for (const [ii, item] of cat.items.entries()) {
        const data = {
          name: item.name,
          categoryId: category.id,
          price: item.price,
          description: item.description ?? null,
          isFeatured: item.featured ?? false,
          order: ii,
        };
        const existing =
          (await tx.menuItem.findFirst({ where: { ...where, name: item.name }, select: { id: true } })) ??
          (item.formerly
            ? await tx.menuItem.findFirst({ where: { ...where, name: item.formerly, id: { notIn: keepItems } }, select: { id: true } })
            : null);
        if (existing) {
          const before = await tx.menuItem.findUniqueOrThrow({ where: { id: existing.id }, select: { name: true } });
          if (before.name !== item.name) renamed.push(`${before.name} → ${item.name}`);
          await tx.menuItem.update({ where: { id: existing.id }, data });
          keepItems.push(existing.id);
          updated++;
        } else {
          const row = await tx.menuItem.create({ data: { ...where, ...data } });
          keepItems.push(row.id);
          created++;
        }
      }
    }

    const removed = await tx.menuItem.findMany({ where: { ...where, id: { notIn: keepItems } }, select: { name: true } });
    await tx.menuItem.deleteMany({ where: { ...where, id: { notIn: keepItems } } });
    await tx.menuCategory.deleteMany({ where: { ...where, id: { notIn: keepCats } } });
    return { created, updated, renamed, removed: removed.map((r) => r.name) };
  });

  console.log(`✔ Menu Bakmi Pak Joko: ${result.updated} diperbarui, ${result.created} dibuat`);
  console.log(`  ganti nama: ${result.renamed.join(", ") || "-"}`);
  console.log(`  dihapus: ${result.removed.join(", ") || "-"}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
