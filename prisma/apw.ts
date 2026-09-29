// Data Ayam Panggang Wicaksono (APW): brand + menu resmi + cabang Kesambi (alamat & jam dari bio Instagram resmi).
// Konten halaman (hero, cerita, teks antarmuka) ada di src/data/brands/apw.ts.
//
// BERBEDA dengan seed Pak Joko: seed ini MENIMPA data brand `apw` (data contoh dari prisma/seed.ts diganti data asli).
// - Kolom brand ditimpa; menu, konten halaman, promo & galeri contoh dihapus lalu menu resmi dibuat ulang.
// - Cabang selain Kesambi (Cipto contoh) dihapus; Kesambi diisi dari APW_BRANCH.
// - Hanya menyentuh baris milik brand `apw`. Domain & data analitik tidak diubah.
// Jadi isian Admin untuk brand ini ikut tertimpa: setelah live, ubah data lewat Admin atau perbarui file ini dulu.
//   npm run apw:seed   (prisma/seed-apw.ts)
import { PrismaClient } from "@prisma/client";
import { APW, APW_BRANCH } from "../src/data/brands/apw";

export const APW_SLUG = "apw";

export const APW_BRAND = {
  slug: APW_SLUG,
  name: "Ayam Panggang Wicaksono",
  tagline: APW.tagline,
  // Warna dari menu cetak: marun tua (header & tombol), emas (aksen), krem terang (latar).
  colorPrimary: "#6B0F14",
  colorSecondary: "#FBF4E8",
  colorAccent: "#F5A623",
  fontHeading: "M PLUS Rounded 1c",
  fontBody: "Nunito Sans",
  template: "TUNGKU" as const,
  // Logo dari foto profil Instagram resmi (150 px). TODO: konfirmasi Fran — file logo resolusi tinggi.
  logoUrl: "/brands/apw/foto/logo-apw.webp",
  faviconUrl: "/brands/apw/favicon.png",
  instagramUrl: "https://www.instagram.com/ayampanggangwicaksono/",
  tiktokUrl: "https://www.tiktok.com/@ayampanggang.wicaksono",
  servesCuisine: ["Ayam Panggang"],
};

type MenuCategoryData = {
  name: string;
  items: { name: string; price: number; portion?: string; description?: string; imageUrl?: string; featured?: boolean }[];
};

/** Menu resmi APW (dari Fran, 29 Sep 2026). Deskripsi hanya untuk tiga menu unggulan (popup Beranda). */
export const APW_MENU: MenuCategoryData[] = [
  {
    name: "Makanan",
    items: [
      { name: "Nasi", price: 5000 },
      {
        name: "Ayam Panggang Negeri",
        portion: "1/4 ekor · dada / paha",
        price: 25000,
        featured: true,
        imageUrl: "/brands/apw/foto/menu-ayam-panggang-negeri.webp",
        description: "Seperempat ekor ayam negeri, dibaluri bumbu rempah lalu dipanggang di dalam tungku gerabah. Pilih bagian dada atau paha.",
      },
      {
        name: "Ayam Panggang Kampung",
        portion: "1/4 ekor · dada / paha",
        price: 35000,
        featured: true,
        // TODO: konfirmasi Fran — foto khusus ayam kampung (foto sekarang: sajian nasi, lalapan & ayam panggang dari reel IG).
        imageUrl: "/brands/apw/foto/menu-ayam-panggang-kampung.webp",
        description: "Seperempat ekor ayam kampung, dibaluri bumbu rempah lalu dipanggang di dalam tungku gerabah. Pilih bagian dada atau paha.",
      },
      {
        name: "Bebek Panggang",
        portion: "paha / dada",
        price: 38000,
        featured: true,
        // TODO: konfirmasi Fran — foto bebek asli (foto sekarang: nasi & lauk panggang dari reel IG).
        imageUrl: "/brands/apw/foto/menu-bebek-panggang.webp",
        description: "Buat yang mau selain ayam: bebek panggang, pilih bagian paha atau dada. Paling pas dengan nasi dan sate pilihan.",
      },
    ],
  },
  {
    name: "Menu Tambahan",
    items: [
      { name: "Tempe", price: 3000 },
      { name: "Tahu", price: 3000 },
      { name: "Sate Usus", price: 4000 },
      { name: "Krupuk", price: 5000 },
      { name: "Kol Goreng", price: 6000 },
      { name: "Sate Kulit", price: 7000 },
      { name: "Sate Ati Ampela", price: 7000 },
      { name: "Pete", price: 15000 },
    ],
  },
  {
    name: "Minuman",
    items: [
      { name: "Teh Tawar Panas", price: 2000 },
      { name: "Es Teh Tawar", price: 3000 },
      { name: "Mineral", price: 5000 },
      { name: "Es Teh Manis", price: 5000 },
      { name: "Teh Manis Panas", price: 5000 },
      { name: "Es Teh Kampul", price: 8000 },
      { name: "Es Jeruk", price: 10000 },
      { name: "Jeruk Panas", price: 10000 },
    ],
  },
];

/** Tolak DB selain lokal kecuali diizinkan eksplisit (F2.6, saat deploy). */
function assertLocalDb(allowRemote: boolean) {
  const url = process.env.DATABASE_URL ?? "";
  const host = url.match(/@([^:/?]+)/)?.[1] ?? "";
  if (!allowRemote && !["localhost", "127.0.0.1", "::1"].includes(host)) {
    throw new Error(`DATABASE_URL bukan DB lokal (host "${host}"). Seed APW menimpa data; tambahkan --izinkan-vps kalau memang disengaja.`);
  }
}

/** Timpa data contoh brand `apw` dengan data asli. Idempoten: hasil akhirnya sama walau dijalankan berkali-kali. */
export async function seedApw(prisma: PrismaClient, { allowRemote = false } = {}) {
  assertLocalDb(allowRemote);

  const brand = await prisma.brand.upsert({
    where: { slug: APW_SLUG },
    update: APW_BRAND,
    create: APW_BRAND,
  });

  const removed = await prisma.$transaction(async (tx) => {
    const where = { brandId: brand.id };
    const oldBranches = await tx.branch.findMany({ where: { ...where, NOT: { name: APW_BRANCH.name } }, select: { name: true } });
    await tx.branch.deleteMany({ where: { ...where, NOT: { name: APW_BRANCH.name } } });
    const items = await tx.menuItem.deleteMany({ where });
    await tx.menuCategory.deleteMany({ where });
    const pages = await tx.pageContent.deleteMany({ where });
    const promos = await tx.promo.deleteMany({ where });
    const albums = await tx.galleryAlbum.deleteMany({ where });

    for (const [ci, cat] of APW_MENU.entries()) {
      const category = await tx.menuCategory.create({ data: { brandId: brand.id, name: cat.name, order: ci } });
      await tx.menuItem.createMany({
        data: cat.items.map((item, ii) => ({
          brandId: brand.id,
          categoryId: category.id,
          name: item.name,
          price: item.price,
          portion: item.portion,
          description: item.description,
          imageUrl: item.imageUrl,
          isFeatured: item.featured ?? false,
          order: ii,
        })),
      });
    }

    const { slug: _slug, area: _area, hours, ...fields } = APW_BRANCH;
    const branchData = { ...fields, phone: null, order: 0 };
    const existing = await tx.branch.findFirst({ where: { ...where, name: APW_BRANCH.name } });
    const kesambi = existing
      ? await tx.branch.update({ where: { id: existing.id }, data: branchData })
      : await tx.branch.create({ data: { brandId: brand.id, ...branchData } });
    // Jam terstruktur 7 hari (bio IG: 16.00–00.00, Kamis libur) ditulis ulang utuh.
    await tx.branchHours.deleteMany({ where: { branchId: kesambi.id } });
    await tx.branchHours.createMany({ data: hours.map((h) => ({ branchId: kesambi.id, ...h })) });

    return { branches: oldBranches.map((b) => b.name), items: items.count, pages: pages.count, promos: promos.count, albums: albums.count };
  });

  const [categories, items, branches] = await Promise.all([
    prisma.menuCategory.count({ where: { brandId: brand.id } }),
    prisma.menuItem.count({ where: { brandId: brand.id } }),
    prisma.branch.findMany({ where: { brandId: brand.id }, select: { name: true } }),
  ]);
  console.log(
    `✔ ${brand.name}: template ${APW_BRAND.template}, ${categories} kategori, ${items} item, cabang: ${branches.map((b) => b.name).join(", ")}` +
      `\n  dihapus: cabang [${removed.branches.join(", ") || "-"}], ${removed.items} item lama, ${removed.pages} konten halaman, ` +
      `${removed.promos} promo, ${removed.albums} album · isPublished=${brand.isPublished} (tidak diubah)`,
  );
}
