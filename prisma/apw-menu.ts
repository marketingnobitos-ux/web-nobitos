// Samakan menu Ayam Panggang Wicaksono dengan APW_MENU di prisma/apw.ts (17 Nov 2026: menu baru dari Fran).
// Berbeda dengan `npm run apw:seed`: hanya menyentuh menu brand `apw`. Cabang, teks halaman (Admin), promo & galeri
// tidak diubah. Item dicocokkan lewat nama: harga, porsi, deskripsi, unggulan & urutan ikut kode; foto yang sudah diisi
// upload Admin (/uploads/...) dipertahankan; foto bawaan repo (/brands/...) atau kosong ikut kode. Status "tersedia" tidak diubah.
// Item & kategori yang tidak ada di APW_MENU dihapus (mis. "Sate Ati Ampela" → "Ati Ampela", "Mineral" → "Air Mineral").
//   npm run apw:menu                  (DB lokal)
//   npm run apw:menu -- --izinkan-vps (VPS, setelah backup DB)
import { PrismaClient } from "@prisma/client";
import { APW_MENU, APW_SLUG } from "./apw";

const prisma = new PrismaClient();

async function main() {
  const url = process.env.DATABASE_URL ?? "";
  const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
  if (!local && !process.argv.includes("--izinkan-vps")) {
    throw new Error("DATABASE_URL bukan lokal. Jalankan dengan --izinkan-vps setelah backup DB.");
  }

  const brand = await prisma.brand.findUnique({ where: { slug: APW_SLUG }, select: { id: true } });
  if (!brand) throw new Error(`Brand ${APW_SLUG} tidak ada.`);
  const where = { brandId: brand.id };

  const result = await prisma.$transaction(async (tx) => {
    const keepItems: string[] = [];
    const keepCats: string[] = [];
    let created = 0;
    let updated = 0;

    for (const [ci, cat] of APW_MENU.entries()) {
      const existingCat = await tx.menuCategory.findFirst({ where: { ...where, name: cat.name } });
      const category = existingCat
        ? await tx.menuCategory.update({ where: { id: existingCat.id }, data: { order: ci } })
        : await tx.menuCategory.create({ data: { ...where, name: cat.name, order: ci } });
      keepCats.push(category.id);

      for (const [ii, item] of cat.items.entries()) {
        const data = {
          categoryId: category.id,
          price: item.price,
          portion: item.portion ?? null,
          description: item.description ?? null,
          isFeatured: item.featured ?? false,
          order: ii,
        };
        const existing = await tx.menuItem.findFirst({ where: { ...where, name: item.name }, select: { id: true, imageUrl: true } });
        if (existing) {
          // Foto bawaan repo (/brands/...) boleh diganti foto baru dari kode; foto upload Admin (/uploads/...) dipertahankan.
          const keepPhoto = existing.imageUrl && !existing.imageUrl.startsWith("/brands/");
          const imageUrl = keepPhoto ? existing.imageUrl : (item.imageUrl ?? existing.imageUrl ?? null);
          await tx.menuItem.update({ where: { id: existing.id }, data: { ...data, imageUrl } });
          keepItems.push(existing.id);
          updated++;
        } else {
          const row = await tx.menuItem.create({ data: { ...where, ...data, name: item.name, imageUrl: item.imageUrl ?? null } });
          keepItems.push(row.id);
          created++;
        }
      }
    }

    const removed = await tx.menuItem.findMany({ where: { ...where, id: { notIn: keepItems } }, select: { name: true } });
    await tx.menuItem.deleteMany({ where: { ...where, id: { notIn: keepItems } } });
    await tx.menuCategory.deleteMany({ where: { ...where, id: { notIn: keepCats } } });
    return { created, updated, removed: removed.map((r) => r.name) };
  });

  console.log(`✔ Menu APW: ${result.updated} diperbarui, ${result.created} dibuat, dihapus: ${result.removed.join(", ") || "-"}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
