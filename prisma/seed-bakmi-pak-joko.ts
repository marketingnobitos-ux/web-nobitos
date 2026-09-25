// Seed terpisah: HANYA brand Bakmi Jowo Anglo Pak Joko (bakmi-pak-joko).
// Brand, 3 kategori, 21 item menu, domain bakmijowopakjoko.web.id, isPublished=true.
// Upsert per baris, aman dijalankan berkali-kali, tidak menyentuh brand lain.
//   npm run bakmi-pak-joko:seed
import { PrismaClient } from "@prisma/client";
import { seedBakmiPakJoko } from "./bakmi-pak-joko";

const prisma = new PrismaClient();

seedBakmiPakJoko(prisma, { publish: true })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
