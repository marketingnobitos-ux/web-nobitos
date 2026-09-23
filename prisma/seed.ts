// Seed data awal brand & cabang Nobitos (PRD Bagian 7).
// Idempoten: aman dijalankan berulang (brand di-upsert per slug, cabang diganti ulang).
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SeedBranch = { name: string; address: string };
type SeedBrand = {
  slug: string;
  name: string;
  colorPrimary: string;
  colorSecondary: string;
  branches: SeedBranch[];
};

// Warna = placeholder, bisa diubah nanti lewat admin.
// Alamat = placeholder, lengkapi nanti lewat admin.
const brands: SeedBrand[] = [
  {
    slug: "aminoto",
    name: "Pecel Lele Aminoto",
    colorPrimary: "#15803d",
    colorSecondary: "#fef9c3",
    branches: [
      { name: "AMG - Ciledug", address: "Ciledug, Cirebon" },
      { name: "AMC - Cipto", address: "Jl. Cipto Mangunkusumo, Cirebon" },
      { name: "AMS - Sumber", address: "Sumber, Kabupaten Cirebon" },
    ],
  },
  {
    slug: "bolu-sunyaragi",
    name: "Bolu Sunyaragi",
    colorPrimary: "#b45309",
    colorSecondary: "#fff7ed",
    branches: [
      { name: "Kartini", address: "Jl. Kartini, Cirebon" },
      { name: "Pabrik", address: "Sunyaragi, Cirebon" },
    ],
  },
  {
    slug: "bakmi-jowo",
    name: "Bakmi Jowo Anglo Mas Joko",
    colorPrimary: "#b91c1c",
    colorSecondary: "#fef2f2",
    branches: [
      { name: "Kartini", address: "Jl. Kartini, Cirebon" },
      { name: "Ciperna", address: "Ciperna, Kabupaten Cirebon" },
    ],
  },
  {
    slug: "apw",
    name: "Ayam Panggang Wicaksono (APW)",
    colorPrimary: "#c2410c",
    colorSecondary: "#1c1917",
    branches: [
      { name: "Cipto", address: "Jl. Cipto Mangunkusumo, Cirebon" },
      { name: "Kesambi", address: "Kesambi, Cirebon" },
    ],
  },
  {
    slug: "bu-joko",
    name: "Warung Bu Joko",
    colorPrimary: "#1d4ed8",
    colorSecondary: "#eff6ff",
    branches: [{ name: "Jl. Kartini", address: "Jl. Kartini, Cirebon" }],
  },
];

async function main() {
  for (const { branches, ...brandData } of brands) {
    const brand = await prisma.brand.upsert({
      where: { slug: brandData.slug },
      update: brandData,
      create: brandData,
    });

    await prisma.branch.deleteMany({ where: { brandId: brand.id } });
    await prisma.branch.createMany({
      data: branches.map((b, i) => ({ ...b, brandId: brand.id, order: i })),
    });

    console.log(`✔ ${brand.name} — ${branches.length} cabang`);
  }

  const [brandCount, branchCount] = await Promise.all([
    prisma.brand.count(),
    prisma.branch.count(),
  ]);
  console.log(`Selesai: ${brandCount} brand, ${branchCount} cabang.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
