// Samakan jam buka cabang Pecel Lele Sambel Dadak Aminoto di DB dengan kode (src/data/brands/aminoto.ts),
// tanpa seed ulang (seed menghapus menu, halaman, promo & album hasil edit Admin).
// Yang diubah:
//   - tiap cabang: teks jam (openHours) + jam per hari (BranchHours). Alamat, WhatsApp & Maps tidak diubah.
//   - teks template yang pernah diisi di Admin > Teks halaman: "11.00" jam buka lama diganti "10.00".
// Dipakai 25 Nov 2026: semua cabang buka 10.00–22.00, Jumat 12.45–22.00.
//   npm run aminoto:cabang                      (DB lokal)
//   npm run aminoto:cabang -- --izinkan-vps     (VPS, setelah backup DB)
import { Prisma, PrismaClient } from "@prisma/client";
import { AMINOTO_BRANCHES, AMINOTO_HOURS, AMINOTO_OPEN_HOURS } from "../src/data/brands/aminoto";

const prisma = new PrismaClient();
const SLUG = "aminoto";
const TEXT_PAGE_KEY = "teks"; // sama dengan TEXT_PAGE_KEY di src/lib/template-text.ts
const OLD_HOUR = /\b11\.00\b/g;

async function main() {
  const url = process.env.DATABASE_URL ?? "";
  const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
  if (!local && !process.argv.includes("--izinkan-vps")) {
    throw new Error("DATABASE_URL bukan lokal. Jalankan dengan --izinkan-vps setelah backup DB.");
  }

  const brand = await prisma.brand.findUnique({ where: { slug: SLUG }, select: { id: true } });
  if (!brand) throw new Error(`Brand ${SLUG} tidak ada.`);

  const rows = await prisma.branch.findMany({ where: { brandId: brand.id }, select: { id: true, name: true } });
  for (const b of AMINOTO_BRANCHES) {
    const row = rows.find((r) => r.name.toLowerCase().includes(b.name.toLowerCase()));
    if (!row) {
      console.log(`- Cabang ${b.name} tidak ada di DB, dilewati.`);
      continue;
    }
    await prisma.$transaction([
      prisma.branch.update({ where: { id: row.id }, data: { openHours: AMINOTO_OPEN_HOURS } }),
      prisma.branchHours.deleteMany({ where: { branchId: row.id } }),
      prisma.branchHours.createMany({ data: AMINOTO_HOURS.map((h) => ({ branchId: row.id, ...h })) }),
    ]);
    console.log(`✔ Jam ${row.name}: ${AMINOTO_OPEN_HOURS}`);
  }

  const text = await prisma.pageContent.findUnique({
    where: { brandId_pageKey_sectionKey: { brandId: brand.id, pageKey: TEXT_PAGE_KEY, sectionKey: "DADAK" } },
    select: { id: true, data: true },
  });
  const data = text?.data;
  if (!text || !data || typeof data !== "object" || Array.isArray(data)) {
    console.log("- Tidak ada teks Admin untuk Aminoto, teks dari kode yang tampil.");
    return;
  }
  const next: Prisma.JsonObject = { ...data };
  let changed = 0;
  for (const [path, v] of Object.entries(data)) {
    if (typeof v !== "string" || !v.match(OLD_HOUR)) continue;
    next[path] = v.replace(OLD_HOUR, "10.00");
    changed++;
    console.log(`✔ Teks Admin ${path}:\n    lama: ${v}\n    baru: ${next[path]}`);
  }
  if (changed) await prisma.pageContent.update({ where: { id: text.id }, data: { data: next } });
  else console.log("- Teks Admin Aminoto tidak memuat jam 11.00.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
