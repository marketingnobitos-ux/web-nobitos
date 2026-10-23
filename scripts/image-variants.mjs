// Membuat salinan kecil (lebar 400 px) foto brand di public/brands/... untuk srcSet, lalu menulis daftar lebar asli
// ke src/data/image-variants.json (dibaca imageSrcSet di src/lib/image.ts). Hanya foto yang tercantum di daftar itu
// yang diberi srcSet, jadi tidak ada link ke file yang belum dibuat.
// Jalankan ulang setiap kali foto di folder ini diganti/ditambah: npm run images:variants
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIRS = ["public/brands/aminoto/foto", "public/brands/apw/foto", "public/brands/apw/tiktok"];
const SMALL = 400;
// Foto yang lebarnya tidak jauh di atas 400 px tidak perlu salinan kecil.
const MIN_WIDTH = 480;
const VARIANT_RE = new RegExp(`-${SMALL}\\.webp$`);

const manifest = {};
for (const dir of DIRS) {
  for (const file of (await readdir(path.join(ROOT, dir))).sort()) {
    if (!file.endsWith(".webp") || VARIANT_RE.test(file)) continue;
    const src = path.join(ROOT, dir, file);
    const { width } = await sharp(src).metadata();
    if (!width || width <= MIN_WIDTH) continue;
    const out = src.replace(/\.webp$/, `-${SMALL}.webp`);
    await sharp(src).resize({ width: SMALL }).webp({ quality: 75, alphaQuality: 90 }).toFile(out);
    manifest[`/${dir.replace(/^public\//, "")}/${file}`] = width;
  }
}

await writeFile(path.join(ROOT, "src/data/image-variants.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`${Object.keys(manifest).length} foto diberi salinan ${SMALL} px.`);
