// Data awal Bakmi Jowo Anglo Pak Joko (BRIEF-Bakmi-Pak-Joko.md Bagian 5 & 6): brand + menu resmi.
// Konten halaman (hero, cerita, cabang, notice Bu Joko) ada di src/data/brands/bakmi-pak-joko.ts.
// Idempoten: brand & menu hanya dibuat kalau belum ada, jadi tidak menimpa isian admin.
//   npm run bakmi-pak-joko:seed            buat brand + menu kalau belum ada
//   npm run bakmi-pak-joko:seed -- --replace  ganti seluruh menu dengan BAKMI_PAK_JOKO_MENU
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

/** Buat brand kalau belum ada, lalu isi menu kalau brand belum punya kategori (atau `replace`). */
export async function seedBakmiPakJoko(prisma: PrismaClient, { replace = false } = {}) {
  const brand = await prisma.brand.upsert({
    where: { slug: BAKMI_PAK_JOKO_SLUG },
    update: {},
    create: BAKMI_PAK_JOKO_BRAND,
  });

  const hasMenu = (await prisma.menuCategory.count({ where: { brandId: brand.id } })) > 0;
  if (hasMenu && !replace) {
    console.log(`• ${brand.name} — menu sudah ada, tidak diubah`);
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.menuCategory.deleteMany({ where: { brandId: brand.id } }); // item ikut terhapus (cascade)
    for (const [ci, cat] of BAKMI_PAK_JOKO_MENU.entries()) {
      const category = await tx.menuCategory.create({ data: { brandId: brand.id, name: cat.name, order: ci } });
      await tx.menuItem.createMany({
        data: cat.items.map((item, ii) => ({
          brandId: brand.id,
          categoryId: category.id,
          name: item.name,
          price: item.price,
          description: item.description,
          isFeatured: item.featured ?? false,
          order: ii,
        })),
      });
    }
  });
  const count = BAKMI_PAK_JOKO_MENU.reduce((n, c) => n + c.items.length, 0);
  console.log(`✔ ${brand.name} — menu dibuat: ${BAKMI_PAK_JOKO_MENU.length} kategori, ${count} item`);
}

// Jalan langsung (bukan di-import oleh seed.ts).
if (process.argv[1]?.replace(/\\/g, "/").endsWith("prisma/bakmi-pak-joko.ts")) {
  const prisma = new PrismaClient();
  seedBakmiPakJoko(prisma, { replace: process.argv.includes("--replace") })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
