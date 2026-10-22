// Data Pecel Lele Sambel Dadak Aminoto: brand + menu resmi + 3 cabang (F4.2, template DADAK).
// Konten halaman (hero, cerita, catering, teks antarmuka) ada di src/data/brands/aminoto.ts.
//
// Seed ini MENIMPA data contoh brand `aminoto` (isi web lama: menu 5 item, alamat umum, cerita "Teks contoh", promo contoh).
// - Kolom brand ditimpa; menu dibuat ulang; konten halaman, promo & galeri contoh dihapus.
// - Cabang lama dicocokkan dari nama ("AMC - Cipto" -> "Cipto") lalu diperbarui, jadi id cabang & data klik tetap utuh.
// - Hanya menyentuh baris milik brand `aminoto`. Domain & data analitik tidak diubah.
//   npm run aminoto:seed   (prisma/seed-aminoto.ts; DB selain lokal butuh --izinkan-vps)
import { PrismaClient } from "@prisma/client";
import { AMINOTO_BRANCHES, AMINOTO_HOURS, AMINOTO_OPEN_HOURS } from "../src/data/brands/aminoto";

export const AMINOTO_SLUG = "aminoto";

export const AMINOTO_BRAND = {
  slug: AMINOTO_SLUG,
  name: "Pecel Lele Sambel Dadak Aminoto",
  tagline: "Sambal diulek dadakan, khas Cirebon",
  // Hijau tua + stabilo (arahan Fran 22 Okt 2026), latar terang kehijauan.
  colorPrimary: "#0E3B2C",
  colorSecondary: "#F2F5EC",
  colorAccent: "#DDF247",
  fontHeading: "Outfit",
  fontBody: "Outfit",
  template: "DADAK" as const,
  logoUrl: null,
  faviconUrl: "/brands/aminoto/favicon.png",
  instagramUrl: "https://www.instagram.com/pecellele.aminoto/",
  tiktokUrl: "https://www.tiktok.com/@pecellele.aminoto",
  servesCuisine: ["Pecel Lele", "Ikan Bakar"],
};

type MenuCategoryData = {
  name: string;
  items: { name: string; price: number; portion?: string; description?: string; imageUrl?: string; featured?: boolean }[];
};

const BAKAR = "Bisa dibakar +Rp2.000";

/**
 * Menu resmi cabang Cipto (kiriman Fran, 22 Okt 2026). Kategori dipecah dari "Makanan" supaya mudah dibaca;
 * nama & harga persis seperti daftar menu. Deskripsi hanya untuk menu andalan.
 */
export const AMINOTO_MENU: MenuCategoryData[] = [
  {
    name: "Lauk Utama",
    items: [
      {
        name: "Pecel Lele",
        price: 18000,
        featured: true,
        imageUrl: "/brands/aminoto/foto/menu-pecel-lele.webp",
        description: "Lele goreng garing dengan sambal dadak dan lalapan.",
      },
      {
        name: "Ayam Negri",
        price: 23000,
        portion: `per porsi · ${BAKAR}`,
        featured: true,
        imageUrl: "/brands/aminoto/foto/menu-ayam-bakar.webp",
        description: "Ayam per porsi, digoreng atau dibakar di atas bara, lengkap dengan sambal dadak.",
      },
      { name: "Ayam Kampung", price: 30000, portion: `per porsi · ${BAKAR}` },
      { name: "Bebek", price: 33000, portion: `per porsi · ${BAKAR}` },
      { name: "Nila", price: 25000, portion: BAKAR },
      { name: "Gurame", price: 35000, portion: BAKAR },
    ],
  },
  {
    name: "Lauk Tambahan",
    items: [
      { name: "Tahu", price: 3000 },
      { name: "Tempe", price: 3000 },
      {
        name: "Sate Usus",
        price: 5000,
        featured: true,
        imageUrl: "/brands/aminoto/foto/menu-ayam-sate.webp",
        description: "Teman makan paling dicari, pas disandingkan dengan ayam dan sambal dadak.",
      },
      { name: "Sate Kulit", price: 7000 },
      { name: "Kepala Ayam", price: 7000 },
      { name: "Telor Dadar / Ceplok", price: 7000 },
      { name: "Ati Ampela", price: 10000 },
      { name: "Cumi Asin", price: 10000 },
      { name: "Pete", price: 15000 },
    ],
  },
  {
    name: "Sambal & Sayur",
    items: [
      { name: "Sambal Korek", price: 7000 },
      { name: "Sambel Bawang", price: 7000 },
      { name: "Sambel Dadak Xtra", price: 10000 },
      { name: "Sayur Asem", price: 7000 },
      { name: "Kol Goreng", price: 6000 },
      { name: "Jukut Goreng", price: 8000 },
      { name: "Pencok Katel", price: 8000 },
    ],
  },
  {
    name: "Nasi & Kerupuk",
    items: [
      { name: "Nasi Putih", price: 5000 },
      { name: "Krupuk 1 Bungkus", price: 5000 },
    ],
  },
  {
    name: "Minuman",
    items: [
      { name: "Tawar Hangat", price: 3000 },
      { name: "Es Teh Tawar", price: 3000 },
      { name: "Es Teh Manis", price: 5000 },
      { name: "Teh Pucuk", price: 5000 },
      { name: "Air Mineral", price: 5000 },
      { name: "Jeruk Panas", price: 7000 },
      { name: "Nipis Madu", price: 7000 },
      { name: "Samore", price: 8000 },
      { name: "Es Teh Kampul", price: 8000 },
      { name: "Es Tjampolay", price: 8000 },
      { name: "Es Jeruk", price: 10000 },
      { name: "Kopi Sunyaragi", price: 15000 },
    ],
  },
];

/** Tolak DB selain lokal kecuali diizinkan eksplisit (saat deploy). */
function assertLocalDb(allowRemote: boolean) {
  const url = process.env.DATABASE_URL ?? "";
  const host = url.match(/@([^:/?]+)/)?.[1] ?? "";
  if (!allowRemote && !["localhost", "127.0.0.1", "::1"].includes(host)) {
    throw new Error(`DATABASE_URL bukan DB lokal (host "${host}"). Seed Aminoto menimpa data; tambahkan --izinkan-vps kalau memang disengaja.`);
  }
}

/** Timpa data contoh brand `aminoto` dengan data asli. Idempoten: hasil akhirnya sama walau dijalankan berkali-kali. */
export async function seedAminoto(prisma: PrismaClient, { allowRemote = false } = {}) {
  assertLocalDb(allowRemote);

  const brand = await prisma.brand.upsert({
    where: { slug: AMINOTO_SLUG },
    update: AMINOTO_BRAND,
    create: AMINOTO_BRAND,
  });

  const removed = await prisma.$transaction(async (tx) => {
    const where = { brandId: brand.id };
    const items = await tx.menuItem.deleteMany({ where });
    await tx.menuCategory.deleteMany({ where });
    const pages = await tx.pageContent.deleteMany({ where });
    const promos = await tx.promo.deleteMany({ where });
    const albums = await tx.galleryAlbum.deleteMany({ where });

    for (const [ci, cat] of AMINOTO_MENU.entries()) {
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

    // Cabang: perbarui baris lama yang namanya memuat nama cabang (mis. "AMC - Cipto"), buat kalau belum ada,
    // hapus sisanya. Jam terstruktur 7 hari ditulis ulang utuh.
    const old = await tx.branch.findMany({ where, select: { id: true, name: true } });
    const kept = new Set<string>();
    for (const [i, b] of AMINOTO_BRANCHES.entries()) {
      const match = old.find((o) => !kept.has(o.id) && o.name.toLowerCase().includes(b.name.toLowerCase()));
      const data = { ...b, openHours: AMINOTO_OPEN_HOURS, order: i };
      const branch = match
        ? await tx.branch.update({ where: { id: match.id }, data })
        : await tx.branch.create({ data: { brandId: brand.id, ...data } });
      kept.add(branch.id);
      await tx.branchHours.deleteMany({ where: { branchId: branch.id } });
      await tx.branchHours.createMany({ data: AMINOTO_HOURS.map((h) => ({ branchId: branch.id, ...h })) });
    }
    const extra = old.filter((o) => !kept.has(o.id));
    await tx.branch.deleteMany({ where: { id: { in: extra.map((o) => o.id) } } });

    return { branches: extra.map((b) => b.name), items: items.count, pages: pages.count, promos: promos.count, albums: albums.count };
  });

  const [categories, items, branches] = await Promise.all([
    prisma.menuCategory.count({ where: { brandId: brand.id } }),
    prisma.menuItem.count({ where: { brandId: brand.id } }),
    prisma.branch.findMany({ where: { brandId: brand.id }, orderBy: { order: "asc" }, select: { name: true } }),
  ]);
  console.log(
    `✔ ${brand.name}: template ${AMINOTO_BRAND.template}, ${categories} kategori, ${items} item, cabang: ${branches.map((b) => b.name).join(", ")}` +
      `\n  dihapus: cabang [${removed.branches.join(", ") || "-"}], ${removed.items} item lama, ${removed.pages} konten halaman, ` +
      `${removed.promos} promo, ${removed.albums} album · isPublished=${brand.isPublished} (tidak diubah)`,
  );
}
