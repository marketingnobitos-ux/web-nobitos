// Buat akun Super Admin atau reset password-nya.
// Pakai: npm run admin:set-password -- email@contoh.com
// Password diminta interaktif, atau lewat env ADMIN_PASSWORD.
import readline from "node:readline/promises";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    console.error("Pakai: npm run admin:set-password -- email@contoh.com");
    process.exit(1);
  }

  let password = process.env.ADMIN_PASSWORD;
  if (!password) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    password = await rl.question("Password baru (min. 8 karakter): ");
    rl.close();
  }
  if (password.length < 8) {
    console.error("Password minimal 8 karakter.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await prisma.adminUser.findUnique({ where: { email } });
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, resetToken: null, resetExpires: null },
    create: { email, passwordHash, name: "Super Admin", role: "SUPER_ADMIN" },
  });

  console.log(existing ? `✔ Password ${email} diperbarui.` : `✔ Super Admin ${email} dibuat.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
