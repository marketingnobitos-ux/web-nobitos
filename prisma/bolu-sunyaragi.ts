// Konten resmi Bolu Sunyaragi: menu (sesuai menu cetak), cerita brand, dan logo transparan.
// Dipakai seed untuk brand baru, dan oleh `npm run bolu:sync` yang MENIMPA data Bolu di database:
//   --replace  ganti seluruh menu,
//   --story    tulis ulang tagline + semua teks cerita (Beranda & halaman Cerita),
//   --branches ganti seluruh cabang + tulis ulang link sosial media,
//   --gallery  ganti album galeri dengan foto asli toko (public/brand/galeri),
//   --logo     pasang logo transparan dari public/brand.
//   --jsonld   upsert jam buka terstruktur per cabang + URL Instagram/TikTok di Brand (JSON-LD, ROADMAP F0.4).
//              Tidak menghapus apa pun; cabang dicocokkan dari nama. `npm run bolu:jsonld`
//   --address  tulis ulang alamat lengkap tiap cabang (dicocokkan dari nama, tidak menghapus apa pun).
//   --favicon  pasang favicon 256px dari public/brands/bolu-sunyaragi (pengganti upload 1920px). `npm run bolu:alamat-favicon`
import { PrismaClient, type Prisma } from "@prisma/client";
import { weeklyHours, type DayHours } from "../src/lib/hours";

export const BOLU_TAGLINE = "Dari Cirebon, pulang membawa rasa";

/** Cerita brand: dari asal nama Sunyaragi sampai hari ini. Ditulis tanpa tahun & nama pendiri (belum ada data resmi). */
export const BOLU_STORY = {
  hero: {
    title: "Bolu Sunyaragi",
    subtitle: "Lembutnya Cirebon, dioven dengan sabar dan digulung selagi hangat.",
    /** Rekaman asli proses Bolen Crispy (hanya tangan), diperlambat & dihaluskan. Poster = frame pertama. */
    videoUrl: "/video/bolu-sunyaragi-proses.mp4",
    imageUrl: "/brand/bolu-sunyaragi-proses.jpg",
  },
  /** Pernyataan pembuka Beranda. Kata di antara *bintang* tampil miring. */
  intro:
    "Namanya kami ambil dari Sunyaragi, tempat orang Cirebon dulu datang untuk *menyepi.* Dari situ kami belajar satu hal: yang baik tidak bisa *diburu-buru.*",
  /** Babak cerita di Beranda, format "Judul | isi". */
  chapters: [
    "Nama yang kami pinjam | Sunyaragi berasal dari kata sunya dan raga: tempat menenangkan diri. Di Cirebon, nama itu melekat pada taman gua karang peninggalan keraton, tempat para bangsawan dulu bertapa dan mencari hening.",
    "Satu resep, satu keyakinan | Kami memulai dari satu resep bolu gulung dan keyakinan sederhana: kue yang enak lahir dari tangan yang sabar. Telur dikocok sampai mengembang, adonan dioven tipis, lalu digulung selagi hangat.",
    "Isian yang tumbuh bersama kota | Dari coklat dan buttercream, isiannya bertambah mengikuti selera orang yang mampir: blueberry, pandan, keju, mangga, sampai abon sapi yang gurih.",
    "Keluarga yang makin besar | Lalu lahir Spikoe Sunyaragi dengan selai blueberry, Chiffon Cheese yang ringan, Roti Bluder Plat E yang membawa kode kendaraan Cirebon di namanya, dan Bolen Crispy yang renyah untuk teman ngopi.",
    "Hari ini, dan seterusnya | Sekarang Bolu Sunyaragi ikut pulang di bagasi, dibagi di meja keluarga, dan jadi alasan untuk kembali ke Cirebon. Resepnya tetap sama. Yang bertambah hanya orang yang ingin membawanya pulang.",
  ],
  profile: {
    title: "Tentang Bolu Sunyaragi",
    subtitle: "Oleh-oleh lembut dari Cirebon",
    body: "Bolu Sunyaragi adalah toko kue khas Cirebon yang dikenal lewat bolu gulungnya. Kami mengoven setiap loyang dengan sabar, memilih bahan dengan teliti, dan mengemasnya rapi supaya sampai di tangan kamu dalam keadaan terbaik.",
  },
  history: {
    title: "Awal mulanya",
    /** Gua Sunyaragi, Cirebon: asal nama brand. */
    imageUrl: "/brand/cerita/gua-sunyaragi.jpg",
    body: "Nama Sunyaragi datang dari sebuah tempat di Cirebon yang dibangun untuk menyepi. Semangat itu yang kami bawa ke dapur: tidak terburu-buru, tidak mengambil jalan pintas. Berawal dari satu resep bolu gulung, kini keluarga kue kami tumbuh menjadi spikoe, chiffon, roti bluder, dan bolen crispy, tanpa mengubah cara kami membuatnya.",
  },
  values: {
    title: "Yang kami jaga",
    items: ["Dioven dengan sabar", "Bahan pilihan, rasa yang jujur", "Resep yang tidak berubah", "Dikemas rapi untuk oleh-oleh"],
  },
  atmosphere: {
    title: "Suasana toko",
    imageUrl: "/brand/galeri/toko-dalam.jpg",
    body: "Pintu terbuka, wangi mentega dan pandan langsung menyambut. Etalase berisi gulungan bolu yang baru dipotong. Tinggal pilih, kami kemas rapi untuk dibawa pulang.",
  },
  /** Teks berganti saat scroll (dipakai template BOLD). */
  process: { items: ["Dikocok.", "Dioven.", "Digulung hangat."], body: "Adonan dikocok sampai mengembang, dioven tipis, lalu digulung selagi hangat. Tidak ada yang diburu-buru." },
};

export type MenuCategoryData = {
  name: string;
  items: { name: string; price: number; portion?: string; description?: string; featured?: boolean }[];
};

export const BOLU_MENU: MenuCategoryData[] = [
  {
    name: "Bolu Gulung",
    items: [
      { name: "Coklat", price: 35000, featured: true, description: "Bolu gulung klasik dengan olesan buttercream lembut dan topping coklat melimpah." },
      { name: "Blueberry", price: 35000, description: "Bolu gulung lembut dengan kombinasi selai blueberry di dalam dan topping keju di atasnya." },
      { name: "Pandan", price: 36000, featured: true, description: "Aroma pandan asli berpadu gurihnya buttercream dan keju di setiap gigitan." },
      { name: "Keju", price: 36000, description: "Isian dan topping keju premium yang memberikan rasa gurih alami." },
      { name: "Mangga", price: 37000, description: "Isian selai mangga segar premium yang memberikan rasa manis alami." },
      { name: "Abon Sapi", price: 47000, featured: true, description: "Gurih yang pas dari abon sapi pilihan di setiap gigitan bolu super lembut." },
    ],
  },
  {
    name: "Spikoe Sunyaragi",
    items: [
      { name: "Spikoe", price: 38000, featured: true, description: "Spikoe khas Sunyaragi, cita rasa otentik yang lembut berpadu selai blueberry premium." },
    ],
  },
  {
    name: "Chiffon Sunyaragi",
    items: [
      { name: "Chiffon Cheese", price: 48000, featured: true, description: "Bolu chiffon keju super lembut dan fluffy dengan keju pilihan yang melimpah." },
    ],
  },
  {
    name: "Roti Bluder Plat E",
    items: [{ name: "Roti Bluder", price: 35000, featured: true, description: "Coklat, Tiramisu, Strawberry, Matcha, Vanilla." }],
  },
  {
    name: "Bolen Crispy",
    items: [
      { name: "Keju", price: 6000 },
      { name: "Coklat", price: 6000 },
      { name: "Coklat + Keju", price: 7000 },
      { name: "Coklat + Kacang", price: 7000 },
      { name: "Durian", price: 8000 },
      { name: "Durian + Keju", price: 9000 },
      { name: "Abon", price: 10000 },
    ],
  },
];

/** Hapus semua kategori & item menu Bolu Sunyaragi, lalu isi ulang dengan BOLU_MENU. */
async function replaceBoluMenu() {
  const prisma = new PrismaClient();
  try {
    const brand = await prisma.brand.findUniqueOrThrow({ where: { slug: "bolu-sunyaragi" } });
    await prisma.$transaction(async (tx) => {
      await tx.menuCategory.deleteMany({ where: { brandId: brand.id } }); // item ikut terhapus (cascade)
      for (const [ci, cat] of BOLU_MENU.entries()) {
        const category = await tx.menuCategory.create({ data: { brandId: brand.id, name: cat.name, order: ci } });
        await tx.menuItem.createMany({
          data: cat.items.map((item, ii) => ({
            brandId: brand.id,
            categoryId: category.id,
            name: item.name,
            price: item.price,
            portion: item.portion,
            description: item.description,
            isFeatured: item.featured ?? false,
            order: ii,
          })),
        });
      }
    });
    const count = BOLU_MENU.reduce((n, c) => n + c.items.length, 0);
    console.log(`Menu Bolu Sunyaragi diganti: ${BOLU_MENU.length} kategori, ${count} item.`);
  } finally {
    await prisma.$disconnect();
  }
}

/** Satu nomor WhatsApp admin untuk semua outlet. */
export const BOLU_WHATSAPP = "085165206098";

/**
 * Outlet resmi. Titik koordinat & alamat dari pin Google Maps resmi tiap cabang (alamat diambil 22 Okt 2026);
 * jam buka terstruktur ada di BOLU_HOURS.
 */
export const BOLU_BRANCHES = [
  {
    name: "Kartini",
    address: "Jl. Kartini No.6, Kebonbaru, Kec. Kejaksan, Kota Cirebon 45121",
    mapsUrl: "https://maps.app.goo.gl/6AzYqbjfKbHqxvZy5",
    lat: -6.7103911,
    lng: 108.557727,
  },
  {
    name: "Kedawung",
    address: "Jl. Raya Kedawung, Kemlakagede, Kec. Tengah Tani, Kabupaten Cirebon 45153",
    mapsUrl: "https://maps.app.goo.gl/KPh4xqxv9QwB19Mb9",
    lat: -6.7089953,
    lng: 108.5264373,
  },
  {
    name: "Stasiun Kejaksan",
    address: "Stasiun Cirebon (Kejaksan), Jl. Inspeksi, Kesenden, Kec. Kejaksan, Kota Cirebon 45121",
    mapsUrl: "https://maps.app.goo.gl/hBYr6rKFMMQw7eSJA",
    lat: -6.7053697,
    lng: 108.5554445,
  },
].map((b) => ({ ...b, whatsapp: BOLU_WHATSAPP }));

/** Footer — sosial media, format "Nama | url". */
export const BOLU_SOCIAL = [
  "Instagram | https://www.instagram.com/bolu_sunyaragi",
  "TikTok | https://www.tiktok.com/@bolu.sunyaragi",
  "Threads | https://www.threads.com/@bolu_sunyaragi",
];

/** Jam buka per outlet (nama = BOLU_BRANCHES.name). Dikonfirmasi Fran 29 Sep 2026 (AUDIT-F0.1.md): tanpa hari libur. */
export const BOLU_HOURS: Record<string, DayHours[]> = {
  "Stasiun Kejaksan": weeklyHours("06:00", "21:00"),
  Kartini: weeklyHours("08:00", "21:00"),
  Kedawung: weeklyHours("08:00", "21:00"),
};

/** Akun resmi untuk `sameAs` JSON-LD; sama dengan BOLU_SOCIAL yang tampil di footer live (dicek 29 Sep 2026). */
export const BOLU_INSTAGRAM = "https://www.instagram.com/bolu_sunyaragi";
export const BOLU_TIKTOK = "https://www.tiktok.com/@bolu.sunyaragi";

/** Upsert BOLU_HOURS ke cabang Bolu yang namanya cocok. Hari yang sudah ada ditimpa dengan jam resmi. */
async function upsertBoluHours(prisma: PrismaClient, brandId: string) {
  const branches = await prisma.branch.findMany({ where: { brandId }, select: { id: true, name: true } });
  let rows = 0;
  for (const branch of branches) {
    for (const h of BOLU_HOURS[branch.name] ?? []) {
      const { dayOfWeek, ...data } = h;
      await prisma.branchHours.upsert({
        where: { branchId_dayOfWeek: { branchId: branch.id, dayOfWeek } },
        update: data,
        create: { branchId: branch.id, ...h },
      });
      rows++;
    }
  }
  const missing = Object.keys(BOLU_HOURS).filter((name) => !branches.some((b) => b.name === name));
  if (missing.length) console.warn(`Cabang tidak ditemukan (jam tidak diisi): ${missing.join(", ")}`);
  return rows;
}

/** Jam buka terstruktur + URL Instagram/TikTok Bolu Sunyaragi (untuk JSON-LD). Idempoten. */
async function writeBoluJsonLd() {
  const prisma = new PrismaClient();
  try {
    const brand = await prisma.brand.update({
      where: { slug: "bolu-sunyaragi" },
      data: { instagramUrl: BOLU_INSTAGRAM, tiktokUrl: BOLU_TIKTOK },
    });
    const rows = await upsertBoluHours(prisma, brand.id);
    console.log(`JSON-LD Bolu Sunyaragi: ${rows} baris jam buka, Instagram & TikTok diisi.`);
  } finally {
    await prisma.$disconnect();
  }
}

/** Ganti semua cabang Bolu Sunyaragi dengan BOLU_BRANCHES dan tulis ulang link sosial media. */
async function replaceBoluBranches() {
  const prisma = new PrismaClient();
  try {
    const brand = await prisma.brand.findUniqueOrThrow({ where: { slug: "bolu-sunyaragi" } });
    await prisma.$transaction([
      prisma.branch.deleteMany({ where: { brandId: brand.id } }),
      prisma.branch.createMany({ data: BOLU_BRANCHES.map((b, i) => ({ ...b, brandId: brand.id, order: i })) }),
      prisma.pageContent.upsert({
        where: { brandId_pageKey_sectionKey: { brandId: brand.id, pageKey: "site", sectionKey: "social" } },
        update: { data: { items: BOLU_SOCIAL } },
        create: { brandId: brand.id, pageKey: "site", sectionKey: "social", data: { items: BOLU_SOCIAL } },
      }),
    ]);
    await upsertBoluHours(prisma, brand.id); // cabang baru dibuat ulang, jadi jam buka ikut diisi lagi
    console.log(`Cabang Bolu Sunyaragi diganti: ${BOLU_BRANCHES.length} outlet, ${BOLU_SOCIAL.length} link sosial media.`);
  } finally {
    await prisma.$disconnect();
  }
}

/** Galeri: foto asli toko, warna diseragamkan. */
export const BOLU_GALLERY = {
  album: "Toko kami",
  photos: [
    { imageUrl: "/brand/galeri/toko-depan.jpg", caption: "Tampak depan toko" },
    { imageUrl: "/brand/galeri/toko-dalam.jpg", caption: "Di dalam toko" },
    { imageUrl: "/brand/galeri/toko-etalase.jpg", caption: "Etalase dan kasir" },
  ],
};

/** Ganti semua album galeri Bolu Sunyaragi dengan BOLU_GALLERY (tanpa video/foto utama). */
async function replaceBoluGallery() {
  const prisma = new PrismaClient();
  try {
    const brand = await prisma.brand.findUniqueOrThrow({ where: { slug: "bolu-sunyaragi" } });
    await prisma.$transaction([
      prisma.galleryAlbum.deleteMany({ where: { brandId: brand.id } }), // foto ikut terhapus (cascade)
      prisma.galleryAlbum.create({
        data: { brandId: brand.id, title: BOLU_GALLERY.album, photos: { create: BOLU_GALLERY.photos.map((p, i) => ({ ...p, order: i })) } },
      }),
      prisma.pageContent.deleteMany({ where: { brandId: brand.id, pageKey: "gallery", sectionKey: "feature" } }),
    ]);
    console.log(`Galeri Bolu Sunyaragi diganti: ${BOLU_GALLERY.photos.length} foto.`);
  } finally {
    await prisma.$disconnect();
  }
}

export const BOLU_LOGO = "/brand/bolu-sunyaragi-logo.webp";

/** Pasang logo transparan (tanpa latar putih) yang disimpan di public/brand. */
async function setBoluLogo() {
  const prisma = new PrismaClient();
  try {
    await prisma.brand.update({ where: { slug: "bolu-sunyaragi" }, data: { logoUrl: BOLU_LOGO } });
    console.log(`Logo Bolu Sunyaragi: ${BOLU_LOGO}`);
  } finally {
    await prisma.$disconnect();
  }
}

/** Tulis ulang alamat cabang dari BOLU_BRANCHES (dicocokkan dari nama). Cabang lain & data lain tidak disentuh. */
async function writeBoluAddresses() {
  const prisma = new PrismaClient();
  try {
    const brand = await prisma.brand.findUniqueOrThrow({ where: { slug: "bolu-sunyaragi" } });
    for (const b of BOLU_BRANCHES) {
      const { count } = await prisma.branch.updateMany({ where: { brandId: brand.id, name: b.name }, data: { address: b.address } });
      console.log(count ? `Alamat ${b.name}: ${b.address}` : `Cabang ${b.name} tidak ditemukan, alamat tidak diubah.`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

export const BOLU_FAVICON = "/brands/bolu-sunyaragi/favicon.png";

/** Pasang favicon kecil (256px, ±8 KB) dari public/brands; upload lama 1920px ±257 KB terlalu berat untuk ikon tab. */
async function setBoluFavicon() {
  const prisma = new PrismaClient();
  try {
    await prisma.brand.update({ where: { slug: "bolu-sunyaragi" }, data: { faviconUrl: BOLU_FAVICON } });
    console.log(`Favicon Bolu Sunyaragi: ${BOLU_FAVICON}`);
  } finally {
    await prisma.$disconnect();
  }
}

/** Tulis ulang tagline dan semua section cerita Bolu Sunyaragi (menimpa isian admin). */
async function writeBoluStory() {
  const prisma = new PrismaClient();
  try {
    const brand = await prisma.brand.update({ where: { slug: "bolu-sunyaragi" }, data: { tagline: BOLU_TAGLINE } });
    const home = await prisma.pageContent.findUnique({
      where: { brandId_pageKey_sectionKey: { brandId: brand.id, pageKey: "home", sectionKey: "hero" } },
    });
    // Hero: pertahankan foto/video yang di-upload admin (/uploads/...); path bawaan repo boleh diganti.
    const heroMedia = Object.fromEntries(
      Object.entries((home?.data ?? {}) as Record<string, unknown>).filter(([, v]) => typeof v === "string" && v.startsWith("/uploads/")),
    );
    const sections: { pageKey: string; sectionKey: string; data: Prisma.InputJsonValue }[] = [
      { pageKey: "home", sectionKey: "hero", data: { ...BOLU_STORY.hero, ...pick(heroMedia, ["imageUrl", "videoUrl"]) } },
      { pageKey: "home", sectionKey: "intro", data: { body: BOLU_STORY.intro } },
      { pageKey: "home", sectionKey: "chapters", data: { items: BOLU_STORY.chapters } },
      { pageKey: "home", sectionKey: "process", data: BOLU_STORY.process },
      { pageKey: "story", sectionKey: "profile", data: BOLU_STORY.profile },
      { pageKey: "story", sectionKey: "history", data: BOLU_STORY.history },
      { pageKey: "story", sectionKey: "values", data: BOLU_STORY.values },
      { pageKey: "story", sectionKey: "atmosphere", data: BOLU_STORY.atmosphere },
    ];
    for (const [i, sec] of sections.entries()) {
      const where = { brandId_pageKey_sectionKey: { brandId: brand.id, pageKey: sec.pageKey, sectionKey: sec.sectionKey } };
      const old = await prisma.pageContent.findUnique({ where });
      // Foto upload admin tetap dipakai, kecuali section ini punya foto bawaan di BOLU_STORY.
      const image = pick((old?.data ?? {}) as Record<string, unknown>, ["imageUrl"]);
      const data = sec.sectionKey === "hero" ? sec.data : { ...image, ...(sec.data as object) };
      await prisma.pageContent.upsert({ where, update: { data }, create: { brandId: brand.id, pageKey: sec.pageKey, sectionKey: sec.sectionKey, data, order: i } });
    }
    console.log(`Cerita Bolu Sunyaragi ditulis ulang: ${sections.length} section.`);
  } finally {
    await prisma.$disconnect();
  }
}

function pick(obj: Record<string, unknown>, keys: string[]): Record<string, string> {
  return Object.fromEntries(keys.filter((k) => typeof obj[k] === "string" && obj[k]).map((k) => [k, obj[k] as string]));
}

async function main() {
  if (process.argv.includes("--replace")) await replaceBoluMenu();
  if (process.argv.includes("--story")) await writeBoluStory();
  if (process.argv.includes("--branches")) await replaceBoluBranches();
  if (process.argv.includes("--gallery")) await replaceBoluGallery();
  if (process.argv.includes("--logo")) await setBoluLogo();
  if (process.argv.includes("--jsonld")) await writeBoluJsonLd();
  if (process.argv.includes("--address")) await writeBoluAddresses();
  if (process.argv.includes("--favicon")) await setBoluFavicon();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
