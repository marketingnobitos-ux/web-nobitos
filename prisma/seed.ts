// Seed data awal brand & cabang Nobitos (PRD Bagian 7) + konten awal situs publik.
// Idempoten & tidak menimpa data yang sudah diubah lewat admin:
// - brand dibuat kalau belum ada (tagline hanya diisi kalau masih kosong),
// - cabang & konten awal hanya dibuat untuk brand yang belum punya datanya,
// - teks contoh dari seed lama ("(Teks contoh ...)", "Promo Contoh", foto SVG) diganti
//   copy baru HANYA kalau isinya masih persis sama dengan versi seed lama.
import { PrismaClient, type Prisma } from "@prisma/client";
import { BOLU_BRANCHES, BOLU_MENU, BOLU_STORY, BOLU_TAGLINE } from "./bolu-sunyaragi";

const prisma = new PrismaClient();

type SeedBranch = {
  name: string;
  address: string;
  openHours?: string;
  mapsUrl?: string;
  lat?: number;
  lng?: number;
  whatsapp?: string;
};
type SeedMenuItem = {
  name: string;
  price: number;
  portion?: string;
  description?: string;
  featured?: boolean;
};
type SeedCategory = { name: string; items: SeedMenuItem[] };
type SeedStory = {
  profile: string;
  history: string;
  values: string[];
  atmosphere: string;
  /** Baris yang berganti saat scroll di Beranda. */
  process: string[];
  processBody: string;
};
type SeedPromo = { title: string; description: string };
/** Konten tambahan untuk template Editorial. */
type SeedEditorial = { intro: string; chapters: string[] };
type SeedBrand = {
  slug: string;
  name: string;
  tagline: string;
  colorPrimary: string;
  colorSecondary: string;
  colorAccent?: string;
  template?: "BOLD" | "EDITORIAL";
  editorial?: SeedEditorial;
  branches: SeedBranch[];
  menu: SeedCategory[];
  story: SeedStory;
  promo: SeedPromo;
  gallery: { imageUrl: string; caption: string }[];
};

// Foto contoh di public/placeholder/ (dipakai sampai admin upload foto asli).
const P = (name: string) => `/placeholder/${name}.jpg`;

// Warna, alamat & harga = contoh awal. Ganti lewat admin.
const brands: SeedBrand[] = [
  {
    slug: "aminoto",
    name: "Pecel Lele Aminoto",
    tagline: "Lele garing, sambel diulek dadakan. Asli Cirebon.",
    colorPrimary: "#15803d",
    colorSecondary: "#fef9c3",
    branches: [
      { name: "AMG - Ciledug", address: "Ciledug, Cirebon", openHours: "16.00 - 23.00 setiap hari" },
      { name: "AMC - Cipto", address: "Jl. Cipto Mangunkusumo, Cirebon", openHours: "16.00 - 23.00 setiap hari" },
      { name: "AMS - Sumber", address: "Sumber, Kabupaten Cirebon", openHours: "16.00 - 23.00 setiap hari" },
    ],
    menu: [
      {
        name: "Pecel",
        items: [
          {
            name: "Pecel Lele",
            price: 15000,
            portion: "1 porsi",
            description: "Lele digoreng garing sampai tulangnya kriuk. Sambel ulek, lalapan seger, nasi anget.",
            featured: true,
          },
          {
            name: "Pecel Ayam",
            price: 18000,
            portion: "1 porsi",
            description: "Ayam bumbu kuning, digoreng pas, kremesnya dibanjur di atas. Sambelnya jangan ditinggal.",
            featured: true,
          },
          {
            name: "Pecel Bebek",
            price: 25000,
            portion: "1 porsi",
            description: "Bebek empuk, bumbunya meresep. Paling mantep dicocol sambel korek.",
            featured: true,
          },
          { name: "Lele Jumbo", price: 20000, portion: "1 porsi", description: "Buat yang laper pisan. Lele gede, sambel dobel." },
          { name: "Tahu Tempe Goreng", price: 5000, portion: "2 tahu + 2 tempe", description: "Temen setia nasi anget sama sambel." },
        ],
      },
      {
        name: "Minuman",
        items: [
          { name: "Es Teh Manis", price: 4000, portion: "1 gelas", description: "Seger, manisnya pas, esnya banyak." },
          { name: "Es Jeruk", price: 6000, portion: "1 gelas", description: "Jeruk peras, bukan sirup." },
        ],
      },
    ],
    story: {
      profile:
        "Tiap sore tenda digelar, wajan dipanasin, cobek disiapin. Sambelnya diulek dadakan, lelenya digoreng pas dipesen. Gitu terus, tiap hari.",
      history:
        "Awalnya cuma satu gerobak di pinggir jalan Ciledug. Pelanggan balik lagi gara-gara sambelnya, terus ngajak temen. Sekarang udah ada beberapa cabang di Cirebon, resepnya tetep sama.",
      values: ["Sambel diulek tiap hari, bukan stok kemarin", "Lele segar dari kolam langganan", "Harga ramah kantong", "Porsi nggak pelit"],
      atmosphere: "Tenda sederhana, kursi plastik, obrolan panjang. Rame pas malam, apalagi malam minggu.",
      process: ["Diulek.", "Digoreng.", "Disajikan hangat."],
      processBody: "Nggak ada sambel botolan di sini. Cabai, tomat, terasi diulek tiap sore, lelenya baru masuk wajan pas kamu pesen.",
    },
    promo: {
      title: "Makan berdua, es teh gratis",
      description: "Pesen 2 porsi pecel apa aja, dapet 2 es teh manis gratis. Tiap Senin sampai Kamis.",
    },
    gallery: [
      { imageUrl: P("dapur-malam"), caption: "Dapur mulai ngebul tiap sore" },
      { imageUrl: P("lele-wajan"), caption: "Wajan nggak pernah dingin" },
      { imageUrl: P("cobek-cabai"), caption: "Cabai, tomat, terasi — siap diulek" },
      { imageUrl: P("warung-tenda-malam"), caption: "Tenda digelar, rame pas malam" },
      { imageUrl: P("tahu-tempe"), caption: "Tahu tempe, temen setia" },
      { imageUrl: P("warung-kursi-merah"), caption: "Kursi plastik, obrolan panjang" },
    ],
  },
  {
    slug: "bolu-sunyaragi",
    name: "Bolu Sunyaragi",
    tagline: BOLU_TAGLINE,
    // Template Editorial: maroon + cream, aksen emas redup.
    colorPrimary: "#6b1e2a",
    colorSecondary: "#f3e9dc",
    colorAccent: "#b38b59",
    template: "EDITORIAL",
    editorial: { intro: BOLU_STORY.intro, chapters: BOLU_STORY.chapters },
    branches: BOLU_BRANCHES,
    menu: BOLU_MENU,
    story: {
      profile: BOLU_STORY.profile.body,
      history: BOLU_STORY.history.body,
      values: BOLU_STORY.values.items,
      atmosphere: BOLU_STORY.atmosphere.body,
      process: BOLU_STORY.process.items,
      processBody: BOLU_STORY.process.body,
    },
    promo: { title: "Beli 3 loyang, lebih hemat", description: "Borong 3 loyang bolu varian apa aja, potongan Rp10.000." },
    gallery: [],
  },
  {
    slug: "bakmi-jowo",
    name: "Bakmi Jowo Anglo Mas Joko",
    tagline: "Bakmi Jawa dimasak satu-satu di atas anglo arang.",
    colorPrimary: "#b91c1c",
    colorSecondary: "#fef2f2",
    branches: [
      { name: "Kartini", address: "Jl. Kartini, Cirebon", openHours: "17.00 - 23.00 setiap hari" },
      { name: "Ciperna", address: "Ciperna, Kabupaten Cirebon", openHours: "17.00 - 23.00 setiap hari" },
    ],
    menu: [
      {
        name: "Bakmi & Nasi",
        items: [
          { name: "Bakmi Godog", price: 22000, portion: "1 porsi", description: "Kuahnya kentel, telur bebeknya diorak-arik.", featured: true },
          { name: "Bakmi Goreng", price: 22000, portion: "1 porsi", description: "Digoreng di atas anglo, aroma arangnya nempel.", featured: true },
          { name: "Nasi Goreng Jawa", price: 20000, portion: "1 porsi", description: "Manis gurih, sedikit gosong di pinggir. Pas.", featured: true },
        ],
      },
      {
        name: "Minuman",
        items: [
          { name: "Wedang Jahe", price: 7000, portion: "1 gelas", description: "Anget sampai ke perut." },
          { name: "Es Teh Manis", price: 4000, portion: "1 gelas", description: "Seger, manisnya pas." },
        ],
      },
    ],
    story: {
      profile: "Satu wajan, satu porsi. Dimasak di atas anglo arang, sabar nunggu itu bagian dari nikmatnya.",
      history: "Mas Joko mulai jualan pakai satu anglo di teras rumah. Antrenya panjang, jadi anglonya nambah.",
      values: ["Dimasak satu per satu", "Pakai arang, bukan kompor", "Telur bebek asli", "Bumbu racikan sendiri"],
      atmosphere: "Asap arang, bau bawang goreng, suara wajan. Duduk santai sambil nunggu giliran.",
      process: ["Dikipas.", "Dimasak.", "Disajikan ngebul."],
      processBody: "Arang dikipas sampai merah, bakmi masuk wajan satu porsi satu porsi. Makanya sabar, ya.",
    },
    promo: { title: "Malam Jumat, wedang jahe gratis", description: "Tiap Kamis malam, pesen bakmi apa aja dapet wedang jahe anget." },
    gallery: [],
  },
  {
    slug: "apw",
    name: "Ayam Panggang Wicaksono (APW)",
    tagline: "Ayam panggang, bumbunya meresep sampai tulang.",
    colorPrimary: "#c2410c",
    colorSecondary: "#1c1917",
    branches: [
      { name: "Cipto", address: "Jl. Cipto Mangunkusumo, Cirebon", openHours: "10.00 - 22.00 setiap hari" },
      { name: "Kesambi", address: "Kesambi, Cirebon", openHours: "10.00 - 22.00 setiap hari" },
    ],
    menu: [
      {
        name: "Ayam Panggang",
        items: [
          { name: "Ayam Panggang 1/4", price: 22000, portion: "1/4 ekor", description: "Dipanggang pelan-pelan, manis gurihnya dapet.", featured: true },
          { name: "Ayam Panggang Utuh", price: 80000, portion: "1 ekor", description: "Buat rame-rame sekeluarga.", featured: true },
        ],
      },
      {
        name: "Paket",
        items: [
          {
            name: "Paket Nasi Ayam Panggang",
            price: 27000,
            portion: "1 porsi",
            description: "Nasi, ayam 1/4, lalapan, sambel & es teh. Tinggal makan.",
            featured: true,
          },
        ],
      },
      {
        name: "Minuman",
        items: [{ name: "Es Teh Manis", price: 5000, portion: "1 gelas", description: "Seger, manisnya pas." }],
      },
    ],
    story: {
      profile: "Ayam dibumbuin dari semalem, dipanggang di atas bara sampai kulitnya mengkilap.",
      history: "Resep bumbu turun-temurun keluarga Wicaksono, sekarang bisa dinikmati di dua cabang.",
      values: ["Dibumbuin semalaman", "Dipanggang di atas bara", "Ayam kampung pilihan", "Sambel bikin nagih"],
      atmosphere: "Asap panggangan ke mana-mana, wanginya bikin mampir.",
      process: ["Dibumbuin.", "Dipanggang.", "Disajikan hangat."],
      processBody: "Bumbu meresep semalaman, pagi-pagi masuk panggangan. Sabar, hasilnya nggak bohong.",
    },
    promo: { title: "Paket keluarga lebih hemat", description: "Ayam panggang utuh + 4 nasi + 4 es teh, harga spesial." },
    gallery: [],
  },
  {
    slug: "bu-joko",
    name: "Warung Bu Joko",
    tagline: "Masakan rumahan, rasanya kayak masakan ibu.",
    colorPrimary: "#1d4ed8",
    colorSecondary: "#eff6ff",
    branches: [{ name: "Jl. Kartini", address: "Jl. Kartini, Cirebon", openHours: "07.00 - 20.00 setiap hari" }],
    menu: [
      {
        name: "Makanan",
        items: [
          { name: "Nasi Rames", price: 15000, portion: "1 porsi", description: "Pilih lauk sendiri dari etalase, sayurnya ganti tiap hari.", featured: true },
          { name: "Sayur Lodeh", price: 8000, portion: "1 mangkuk", description: "Santennya gurih, labu siamnya lembut.", featured: true },
          { name: "Tempe Mendoan", price: 2000, portion: "1 pcs", description: "Tipis, lebar, digoreng setengah mateng. Wajib cocol kecap.", featured: true },
        ],
      },
      {
        name: "Minuman",
        items: [{ name: "Es Teh Manis", price: 4000, portion: "1 gelas", description: "Seger, manisnya pas." }],
      },
    ],
    story: {
      profile: "Masak dari subuh, buka dari pagi. Menunya ganti-ganti, rasanya tetep kayak di rumah.",
      history: "Bu Joko masak buat tetangga, lama-lama tetangganya ngajak orang sekampung.",
      values: ["Masak tiap subuh", "Bumbu rumahan", "Harga tetangga", "Lauk ganti tiap hari"],
      atmosphere: "Etalase kaca penuh lauk, meja panjang, ngobrol sama siapa aja.",
      process: ["Dimasak subuh.", "Ditata di etalase.", "Tinggal pilih."],
      processBody: "Semua lauk dimasak pagi itu juga. Datang agak pagi biar kebagian yang lengkap.",
    },
    promo: { title: "Sarapan hemat", description: "Nasi rames + teh anget sebelum jam 9 pagi, harga lebih murah." },
    gallery: [],
  },
];

function pageSections(b: SeedBrand): { pageKey: string; sectionKey: string; data: Prisma.InputJsonValue }[] {
  return [
    { pageKey: "home", sectionKey: "hero", data: { title: b.name, subtitle: b.tagline } },
    { pageKey: "home", sectionKey: "process", data: { items: b.story.process, body: b.story.processBody } },
    ...(b.editorial
      ? [
          { pageKey: "home", sectionKey: "intro", data: { body: b.editorial.intro } },
          { pageKey: "home", sectionKey: "chapters", data: { items: b.editorial.chapters } },
        ]
      : []),
    { pageKey: "story", sectionKey: "profile", data: { title: `Tentang ${b.name}`, body: b.story.profile } },
    { pageKey: "story", sectionKey: "history", data: { title: "Awal mulanya", body: b.story.history } },
    { pageKey: "story", sectionKey: "values", data: { title: "Yang kita jaga", items: b.story.values } },
    { pageKey: "story", sectionKey: "atmosphere", data: { title: "Suasana warung", body: b.story.atmosphere } },
  ];
}

async function seedContent(brandId: string, b: SeedBrand) {
  for (const [ci, cat] of b.menu.entries()) {
    const category = await prisma.menuCategory.create({ data: { brandId, name: cat.name, order: ci } });
    await prisma.menuItem.createMany({
      data: cat.items.map((item, ii) => ({
        brandId,
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

  await prisma.promo.create({ data: { brandId, ...b.promo } });

  if (b.gallery.length) {
    await prisma.galleryAlbum.create({
      data: {
        brandId,
        title: "Suasana Warung",
        photos: { create: b.gallery.map((p, i) => ({ ...p, order: i })) },
      },
    });
  }
}

/** Section halaman: buat yang belum ada (tidak menimpa yang sudah diisi admin). */
async function ensureSections(brandId: string, b: SeedBrand) {
  for (const [i, s] of pageSections(b).entries()) {
    await prisma.pageContent.upsert({
      where: { brandId_pageKey_sectionKey: { brandId, pageKey: s.pageKey, sectionKey: s.sectionKey } },
      update: {},
      create: { brandId, ...s, order: i },
    });
  }
}

// ---------- Ganti teks contoh dari seed versi lama (hanya kalau belum diubah admin) ----------

const OLD_DESCRIPTIONS: Record<string, string> = {
  "Pecel Lele": "Lele goreng renyah, sambal, lalapan & nasi.",
  "Pecel Ayam": "Ayam goreng bumbu kuning dengan sambal khas.",
  "Pecel Bebek": "Bebek goreng empuk, sambal korek.",
  "Bolu Pandan": "Bolu pandan lembut dan harum.",
  "Bolu Cokelat": "Cokelat pekat, tekstur moist.",
  "Bolu Keju": "Taburan keju melimpah.",
  "Bakmi Godog": "Bakmi kuah kental, telur bebek.",
  "Bakmi Goreng": "Digoreng di atas anglo, aroma arang.",
  "Ayam Panggang 1/4": "Dipanggang perlahan, bumbu manis gurih.",
  "Paket Nasi Ayam Panggang": "Nasi, ayam 1/4, lalapan, sambal & es teh.",
  "Nasi Rames": "Nasi dengan pilihan lauk harian.",
};

const OLD_SECTION_TITLES: Record<string, string> = {
  history: "Sejarah Kami",
  values: "Nilai Kami",
  atmosphere: "Suasana Outlet",
};

async function refreshOldCopy(brandId: string, b: SeedBrand) {
  let changed = 0;

  // Deskripsi menu: ganti hanya kalau masih sama persis dengan teks seed lama (atau kosong).
  for (const item of b.menu.flatMap((c) => c.items)) {
    if (!item.description) continue;
    const old = OLD_DESCRIPTIONS[item.name];
    const r = await prisma.menuItem.updateMany({
      where: {
        brandId,
        name: item.name,
        OR: [{ description: null }, { description: "" }, ...(old ? [{ description: old }] : [])],
      },
      data: { description: item.description },
    });
    changed += r.count;
  }

  // Section cerita yang masih berisi penanda "(Teks contoh" / judul lama.
  const fresh = new Map(pageSections(b).map((s) => [`${s.pageKey}/${s.sectionKey}`, s.data]));
  const rows = await prisma.pageContent.findMany({ where: { brandId, pageKey: "story" } });
  for (const row of rows) {
    const data = (row.data ?? {}) as Record<string, unknown>;
    const isOld =
      (typeof data.body === "string" && data.body.includes("(Teks contoh")) ||
      data.title === OLD_SECTION_TITLES[row.sectionKey] ||
      data.imageUrl === "/placeholders/photo-2.svg";
    const next = fresh.get(`${row.pageKey}/${row.sectionKey}`);
    if (isOld && next) {
      await prisma.pageContent.update({ where: { id: row.id }, data: { data: next } });
      changed++;
    }
  }

  // Promo contoh lama.
  const promo = await prisma.promo.updateMany({
    where: { brandId, title: "Promo Contoh" },
    data: { title: b.promo.title, description: b.promo.description },
  });
  changed += promo.count;

  // Foto galeri SVG lama: ganti foto contoh (brand pilot) atau hapus (brand lain).
  const oldPhotos = await prisma.galleryPhoto.findMany({
    where: { album: { brandId }, imageUrl: { startsWith: "/placeholders/" } },
    orderBy: { order: "asc" },
  });
  for (const [i, photo] of oldPhotos.entries()) {
    const next = b.gallery[i];
    if (next) await prisma.galleryPhoto.update({ where: { id: photo.id }, data: next });
    else await prisma.galleryPhoto.delete({ where: { id: photo.id } });
    changed++;
  }
  // Brand pilot: lengkapi album contoh sampai 6 foto.
  if (oldPhotos.length && b.gallery.length > oldPhotos.length) {
    const albumId = oldPhotos[0].albumId;
    await prisma.galleryPhoto.createMany({
      data: b.gallery.slice(oldPhotos.length).map((p, i) => ({ ...p, albumId, order: oldPhotos.length + i })),
    });
    await prisma.galleryAlbum.update({ where: { id: albumId }, data: { title: "Suasana Warung" } });
  }

  return changed;
}

async function main() {
  for (const b of brands) {
    const { slug, name, tagline, colorPrimary, colorSecondary, colorAccent, template } = b;
    let brand = await prisma.brand.upsert({
      where: { slug },
      update: {},
      create: { slug, name, tagline, colorPrimary, colorSecondary, colorAccent, template },
    });
    if (!brand.tagline) {
      brand = await prisma.brand.update({ where: { id: brand.id }, data: { tagline } });
    }

    if ((await prisma.branch.count({ where: { brandId: brand.id } })) === 0) {
      await prisma.branch.createMany({
        data: b.branches.map((br, i) => ({ ...br, brandId: brand.id, order: i })),
      });
    } else {
      // Lengkapi jam buka contoh untuk cabang hasil seed lama yang masih kosong.
      for (const br of b.branches) {
        await prisma.branch.updateMany({
          where: { brandId: brand.id, name: br.name, openHours: null },
          data: { openHours: br.openHours },
        });
      }
    }

    if ((await prisma.menuCategory.count({ where: { brandId: brand.id } })) === 0) {
      await seedContent(brand.id, b);
      console.log(`✔ ${brand.name} — konten awal dibuat`);
    } else {
      const changed = await refreshOldCopy(brand.id, b);
      console.log(`• ${brand.name} — konten sudah ada${changed ? `, ${changed} teks/foto contoh lama diperbarui` : ""}`);
    }
    await ensureSections(brand.id, b);
  }

  const [brandCount, branchCount, itemCount] = await Promise.all([
    prisma.brand.count(),
    prisma.branch.count(),
    prisma.menuItem.count(),
  ]);
  console.log(`Selesai: ${brandCount} brand, ${branchCount} cabang, ${itemCount} menu.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
