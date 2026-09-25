// Slot foto asli Bakmi Jowo Anglo Pak Joko (brief 6.2 & 6.5).
// File diletakkan di public/brands/bakmi-pak-joko/foto/<slot>.<webp|png|jpg>.
// Kalau file slot ada, halaman memakai foto (potongan bertepi putih ala stiker); kalau tidak, ilustrasi SVG.
// Hanya untuk server component (memakai fs).
import fs from "node:fs";
import path from "node:path";

const DIR = "brands/bakmi-pak-joko/foto";
const EXTENSIONS = ["webp", "png", "jpg"];

/** Nama slot = nama file tanpa ekstensi. Keterangan ini juga ditulis di README folder foto. */
export const ANGLO_PHOTO_SLOTS = {
  wajan: "Wajan di atas anglo, api/bara terlihat (hero, kartu 02, Cerita)",
  anglo: "Tungku anglo dengan arang membara (hero, kartu 01, Cerita)",
  "bakmi-nyemek": "Bakmi Nyemek di mangkok (hero, kartu 03, poster Nyemek)",
  "bakmi-goreng": "Bakmi Goreng di piring (poster Goreng)",
  "es-teh": "Es teh / minuman (hero)",
} as const;

export type AngloPhotoSlot = keyof typeof ANGLO_PHOTO_SLOTS;

// Di produksi cukup dicek sekali per proses (folder public hanya berubah saat deploy).
const cache = new Map<AngloPhotoSlot, string | null>();
const CACHE = process.env.NODE_ENV === "production";

/** URL foto slot kalau filenya ada, selain itu null (pakai ilustrasi). */
export function angloPhoto(slot: AngloPhotoSlot): string | null {
  if (CACHE && cache.has(slot)) return cache.get(slot) ?? null;
  const file = EXTENSIONS.map((ext) => `${slot}.${ext}`).find((name) =>
    fs.existsSync(path.join(process.cwd(), "public", DIR, name)),
  );
  const url = file ? `/${DIR}/${file}` : null;
  cache.set(slot, url);
  return url;
}

/** Slot foto untuk item menu andalan, dari namanya. */
export function menuPhotoSlot(name: string): AngloPhotoSlot | null {
  const n = name.toLowerCase();
  if (n.includes("nyemek")) return "bakmi-nyemek";
  if (n.includes("bakmi goreng")) return "bakmi-goreng";
  return null;
}
