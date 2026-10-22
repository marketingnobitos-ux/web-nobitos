// Seed terpisah: HANYA brand Pecel Lele Sambel Dadak Aminoto (aminoto). Menimpa data contoh brand ini, tidak menyentuh brand lain.
// DB lokal langsung jalan; di VPS (deploy F4.3) tambah --izinkan-vps.
//   npm run aminoto:seed
import { PrismaClient } from "@prisma/client";
import { seedAminoto } from "./aminoto";

const prisma = new PrismaClient();

seedAminoto(prisma, { allowRemote: process.argv.includes("--izinkan-vps") })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
