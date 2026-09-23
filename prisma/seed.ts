// Seed data awal brand & cabang Nobitos (PRD Bagian 7) + konten contoh situs publik.
// Idempoten & tidak menimpa data yang sudah ada:
// - brand dibuat kalau belum ada (tagline hanya diisi kalau masih kosong),
// - cabang & konten contoh hanya dibuat untuk brand yang belum punya datanya.
import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

type SeedBranch = { name: string; address: string; openHours?: string };
type SeedMenuItem = {
  name: string;
  price: number;
  portion?: string;
  description?: string;
  featured?: boolean;
};
type SeedCategory = { name: string; items: SeedMenuItem[] };
type SeedBrand = {
  slug: string;
  name: string;
  tagline: string;
  colorPrimary: string;
  colorSecondary: string;
  branches: SeedBranch[];
  menu: SeedCategory[];
};

// Warna, alamat, harga & teks = CONTOH. Ganti lewat admin (Milestone 4).
const brands: SeedBrand[] = [
  {
    slug: "aminoto",
    name: "Pecel Lele Aminoto",
    tagline: "Pecel lele gurih, sambal nendang khas Cirebon",
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
          { name: "Pecel Lele", price: 15000, portion: "1 porsi", description: "Lele goreng renyah, sambal, lalapan & nasi.", featured: true },
          { name: "Pecel Ayam", price: 18000, portion: "1 porsi", description: "Ayam goreng bumbu kuning dengan sambal khas.", featured: true },
          { name: "Pecel Bebek", price: 25000, portion: "1 porsi", description: "Bebek goreng empuk, sambal korek.", featured: true },
        ],
      },
      {
        name: "Minuman",
        items: [
          { name: "Es Teh Manis", price: 4000, portion: "1 gelas" },
          { name: "Es Jeruk", price: 6000, portion: "1 gelas" },
        ],
      },
    ],
  },
  {
    slug: "bolu-sunyaragi",
    name: "Bolu Sunyaragi",
    tagline: "Bolu lembut oleh-oleh khas Cirebon",
    colorPrimary: "#b45309",
    colorSecondary: "#fff7ed",
    branches: [
      { name: "Kartini", address: "Jl. Kartini, Cirebon", openHours: "08.00 - 21.00 setiap hari" },
      { name: "Pabrik", address: "Sunyaragi, Cirebon", openHours: "08.00 - 17.00 Senin - Sabtu" },
    ],
    menu: [
      {
        name: "Bolu",
        items: [
          { name: "Bolu Pandan", price: 45000, portion: "1 loyang", description: "Bolu pandan lembut dan harum.", featured: true },
          { name: "Bolu Cokelat", price: 45000, portion: "1 loyang", description: "Cokelat pekat, tekstur moist.", featured: true },
          { name: "Bolu Keju", price: 55000, portion: "1 loyang", description: "Taburan keju melimpah.", featured: true },
        ],
      },
      {
        name: "Kue Lainnya",
        items: [{ name: "Lapis Legit", price: 40000, portion: "1/2 loyang" }],
      },
    ],
  },
  {
    slug: "bakmi-jowo",
    name: "Bakmi Jowo Anglo Mas Joko",
    tagline: "Bakmi Jawa dimasak di atas anglo arang",
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
          { name: "Bakmi Godog", price: 22000, portion: "1 porsi", description: "Bakmi kuah kental, telur bebek.", featured: true },
          { name: "Bakmi Goreng", price: 22000, portion: "1 porsi", description: "Digoreng di atas anglo, aroma arang.", featured: true },
          { name: "Nasi Goreng Jawa", price: 20000, portion: "1 porsi", featured: true },
        ],
      },
      {
        name: "Minuman",
        items: [
          { name: "Wedang Jahe", price: 7000, portion: "1 gelas" },
          { name: "Es Teh Manis", price: 4000, portion: "1 gelas" },
        ],
      },
    ],
  },
  {
    slug: "apw",
    name: "Ayam Panggang Wicaksono (APW)",
    tagline: "Ayam panggang bumbu meresap sampai ke tulang",
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
          { name: "Ayam Panggang 1/4", price: 22000, portion: "1/4 ekor", description: "Dipanggang perlahan, bumbu manis gurih.", featured: true },
          { name: "Ayam Panggang Utuh", price: 80000, portion: "1 ekor", featured: true },
        ],
      },
      {
        name: "Paket",
        items: [{ name: "Paket Nasi Ayam Panggang", price: 27000, portion: "1 porsi", description: "Nasi, ayam 1/4, lalapan, sambal & es teh.", featured: true }],
      },
      {
        name: "Minuman",
        items: [{ name: "Es Teh Manis", price: 5000, portion: "1 gelas" }],
      },
    ],
  },
  {
    slug: "bu-joko",
    name: "Warung Bu Joko",
    tagline: "Masakan rumahan, rasa seperti di rumah sendiri",
    colorPrimary: "#1d4ed8",
    colorSecondary: "#eff6ff",
    branches: [{ name: "Jl. Kartini", address: "Jl. Kartini, Cirebon", openHours: "07.00 - 20.00 setiap hari" }],
    menu: [
      {
        name: "Makanan",
        items: [
          { name: "Nasi Rames", price: 15000, portion: "1 porsi", description: "Nasi dengan pilihan lauk harian.", featured: true },
          { name: "Sayur Lodeh", price: 8000, portion: "1 mangkuk", featured: true },
          { name: "Tempe Mendoan", price: 2000, portion: "1 pcs", featured: true },
        ],
      },
      {
        name: "Minuman",
        items: [{ name: "Es Teh Manis", price: 4000, portion: "1 gelas" }],
      },
    ],
  },
];

function pageSections(b: SeedBrand): { pageKey: string; sectionKey: string; data: Prisma.InputJsonValue }[] {
  return [
    { pageKey: "home", sectionKey: "hero", data: { title: b.name, subtitle: b.tagline } },
    {
      pageKey: "story",
      sectionKey: "profile",
      data: {
        title: `Tentang ${b.name}`,
        body: `${b.name} adalah bagian dari keluarga kuliner Nobitos di Cirebon. (Teks contoh — ubah lewat admin.)`,
      },
    },
    {
      pageKey: "story",
      sectionKey: "history",
      data: {
        title: "Sejarah Kami",
        body: "Berawal dari dapur kecil dan resep keluarga, kini hadir di beberapa cabang di Cirebon. (Teks contoh.)",
      },
    },
    {
      pageKey: "story",
      sectionKey: "values",
      data: {
        title: "Nilai Kami",
        items: ["Bahan segar setiap hari", "Resep asli yang dijaga", "Harga bersahabat", "Pelayanan ramah"],
      },
    },
    {
      pageKey: "story",
      sectionKey: "atmosphere",
      data: {
        title: "Suasana Outlet",
        body: "Tempat santai untuk makan bersama keluarga dan teman. (Teks contoh.)",
        imageUrl: "/placeholders/photo-2.svg",
      },
    },
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

  for (const [i, s] of pageSections(b).entries()) {
    await prisma.pageContent.upsert({
      where: { brandId_pageKey_sectionKey: { brandId, pageKey: s.pageKey, sectionKey: s.sectionKey } },
      update: {},
      create: { brandId, ...s, order: i },
    });
  }

  await prisma.promo.create({
    data: {
      brandId,
      title: "Promo Contoh",
      description: `Promo spesial ${b.name}. Ganti atau nonaktifkan lewat admin.`,
    },
  });

  await prisma.galleryAlbum.create({
    data: {
      brandId,
      title: "Suasana Outlet",
      photos: {
        create: [1, 2, 3].map((n, i) => ({
          imageUrl: `/placeholders/photo-${n}.svg`,
          caption: `Foto contoh ${n}`,
          order: i,
        })),
      },
    },
  });
}

async function main() {
  for (const b of brands) {
    const { slug, name, tagline, colorPrimary, colorSecondary } = b;
    let brand = await prisma.brand.upsert({
      where: { slug },
      update: {},
      create: { slug, name, tagline, colorPrimary, colorSecondary },
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
      console.log(`✔ ${brand.name} — konten contoh dibuat`);
    } else {
      console.log(`• ${brand.name} — konten sudah ada, dilewati`);
    }
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
