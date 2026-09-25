// Data awal Bakmi Jowo Anglo Pak Joko (BRIEF-Bakmi-Pak-Joko.md Bagian 5 & 6): brand + menu resmi.
// Konten halaman (hero, cerita, cabang, notice Bu Joko) ada di src/data/brands/bakmi-pak-joko.ts.
// Upsert per baris: yang sudah ada tidak ditimpa, jadi aman diulang & tidak menimpa isian admin.
//   npm run bakmi-pak-joko:seed   brand + menu + domain produksi + isPublished=true (prisma/seed-bakmi-pak-joko.ts)
import { PrismaClient } from "@prisma/client";

export const BAKMI_PAK_JOKO_SLUG = "bakmi-pak-joko";

export const BAKMI_PAK_JOKO_BRAND = {
  slug: BAKMI_PAK_JOKO_SLUG,
  // TODO: konfirmasi Fran — nama tampil "Pak Joko" vs "Mas Joko TMG" (logo & menu memakai "Mas Joko TMG").
  name: "Bakmi Jowo Anglo Pak Joko",
  tagline: "Rasa Asli Temanggung, Hadir di Kota Udang",
  // Brief Bagian 6.2 (revisi): tinta hitam, kertas krem, aksen oranye bara. Blok pastel ada di tema brand (globals.css).
  colorPrimary: "#161412",
  colorSecondary: "#F2E8D5",
  colorAccent: "#D9531E",
  fontHeading: "Caveat Brush",
  fontBody: "Courier Prime",
  template: "ANGLO" as const,
};

type MenuCategoryData = {
  name: string;
  items: { name: string; price: number; description?: string; featured?: boolean }[];
};

/** Menu resmi "MENU BAKMI JOWO MAS JOKO TMG". Deskripsi hanya untuk menu andalan (brief 4.3). */
export const BAKMI_PAK_JOKO_MENU: MenuCategoryData[] = [
  {
    name: "Makanan",
    items: [
      { name: "Nasi Goreng", price: 19000 },
      { name: "Bakmi Goreng", price: 21000, featured: true, description: "Gurih, suwiran ayam banyak, bawang goreng renyah." },
      { name: "Bakmi Nyemek / Cemek", price: 21000, featured: true, description: "Kuah gurih kental, sayur melimpah, telur diaduk." },
      { name: "Bakmi Godog / Rebus", price: 21000 },
      { name: "Kwetiaw Goreng / Rebus", price: 21000 },
      { name: "Otok Owok / Mawut / Magelangan", price: 21000 },
      { name: "Bihun Goreng / Rebus", price: 21000 },
      { name: "Nasi Godog", price: 21000 },
    ],
  },
  {
    name: "Sate & Gorengan",
    items: [
      { name: "Gorengan Tempe", price: 2000 },
      { name: "Gorengan Bakwan", price: 2000 },
      { name: "Kepala Ayam", price: 3000 },
      { name: "Sate Usus", price: 4000 },
      { name: "Kerupuk", price: 4000 },
      { name: "Sate Kulit", price: 6000 },
      { name: "Sate Ati Ampela", price: 6000 },
    ],
  },
  {
    name: "Minuman",
    items: [
      { name: "Teh Tawar Panas / Es Tawar", price: 2000 },
      { name: "Mineral", price: 5000 },
      { name: "Es Teh Manis", price: 5000 },
      { name: "Es Teh Kampul", price: 8000 },
      { name: "Es Campolai Susu", price: 9000 },
      { name: "Es Jeruk / Jeruk Panas", price: 10000 },
    ],
  },
];

/** Domain produksi brand ini (brief Bagian 8 no. 7). */
export const BAKMI_PAK_JOKO_DOMAIN = "bakmijowopakjoko.web.id";

type SeedOptions = {
  /** Set isPublished=true & pasang domain produksi (dipakai prisma/seed-bakmi-pak-joko.ts). */
  publish?: boolean;
};

/**
 * Upsert brand + menu Bakmi Jowo Anglo Pak Joko. Aman dijalankan berkali-kali:
 * - brand/kategori/item yang sudah ada TIDAK ditimpa (harga, urutan, deskripsi dari Admin tetap),
 * - yang belum ada dibuat; tidak ada yang dihapus,
 * - hanya menyentuh baris milik brand ini.
 */
export async function seedBakmiPakJoko(prisma: PrismaClient, { publish = false }: SeedOptions = {}) {
  const brand = await prisma.brand.upsert({
    where: { slug: BAKMI_PAK_JOKO_SLUG },
    update: publish ? { isPublished: true } : {},
    create: { ...BAKMI_PAK_JOKO_BRAND, isPublished: publish },
  });

  let createdCategories = 0;
  let createdItems = 0;
  for (const [ci, cat] of BAKMI_PAK_JOKO_MENU.entries()) {
    let category = await prisma.menuCategory.findFirst({ where: { brandId: brand.id, name: cat.name } });
    if (!category) {
      category = await prisma.menuCategory.create({ data: { brandId: brand.id, name: cat.name, order: ci } });
      createdCategories++;
    }
    for (const [ii, item] of cat.items.entries()) {
      const exists = await prisma.menuItem.findFirst({ where: { brandId: brand.id, name: item.name }, select: { id: true } });
      if (exists) continue;
      await prisma.menuItem.create({
        data: {
          brandId: brand.id,
          categoryId: category.id,
          name: item.name,
          price: item.price,
          description: item.description,
          isFeatured: item.featured ?? false,
          order: ii,
        },
      });
      createdItems++;
    }
  }

  let domainNote = "";
  if (publish) {
    const hostname = BAKMI_PAK_JOKO_DOMAIN;
    const existing = await prisma.domain.findUnique({ where: { hostname } });
    if (existing && existing.brandId !== brand.id) {
      // Jangan pernah memindahkan domain milik brand lain.
      throw new Error(`Domain ${hostname} sudah dipakai brand lain (brandId ${existing.brandId}). Tidak diubah.`);
    }
    await prisma.domain.upsert({
      where: { hostname },
      update: {},
      create: { hostname, brandId: brand.id, isPrimary: true },
    });
    domainNote = `, domain ${hostname}${existing ? " (sudah ada)" : " (baru)"}`;
  }

  const [categories, items] = await Promise.all([
    prisma.menuCategory.count({ where: { brandId: brand.id } }),
    prisma.menuItem.count({ where: { brandId: brand.id } }),
  ]);
  const fresh = await prisma.brand.findUniqueOrThrow({ where: { id: brand.id }, select: { isPublished: true, template: true } });
  console.log(
    `✔ ${brand.name}: ${categories} kategori, ${items} item (baru: ${createdCategories} kategori, ${createdItems} item)` +
      `, template ${fresh.template}, isPublished=${fresh.isPublished}${domainNote}`,
  );
}
