// Seed terpisah: HANYA brand Ayam Panggang Wicaksono (apw). Menimpa data contoh brand ini, tidak menyentuh brand lain.
// Sekarang hanya untuk DB lokal (ditolak kalau DATABASE_URL bukan localhost). Di VPS (F2.6): tambah --izinkan-vps.
//   npm run apw:seed
import { PrismaClient } from "@prisma/client";
import { seedApw } from "./apw";

const prisma = new PrismaClient();

seedApw(prisma, { allowRemote: process.argv.includes("--izinkan-vps") })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
