// Helper URL gambar (aman dipakai di client & server).
import BRAND_PHOTO_WIDTHS from "@/data/image-variants.json";

export const IMAGE_WIDTHS = [400, 1000, 1920] as const;
export const LARGEST_WIDTH = 1920;

/**
 * URL varian lebar tertentu untuk gambar hasil upload ("/uploads/.../id-1920.webp").
 * URL lain (placeholder, link luar) dikembalikan apa adanya.
 */
export function imageVariant(url: string, width: (typeof IMAGE_WIDTHS)[number]): string {
  if (!url.startsWith("/uploads/")) return url;
  return url.replace(new RegExp(`-${LARGEST_WIDTH}\\.webp$`), `-${width}.webp`);
}

/**
 * Foto bawaan repo (/placeholder, /brand) punya salinan WebP di sebelah JPG-nya. URL di DB & seed tetap .jpg,
 * yang dikirim ke browser versi WebP (lebih ringan). URL lain dikembalikan apa adanya.
 */
export function repoWebp(url: string): string {
  return /^\/(placeholder|brand)\/.+\.jpg$/.test(url) ? url.replace(/\.jpg$/, ".webp") : url;
}

/**
 * srcSet responsif: gambar upload (400/1000/1920 WebP), foto bawaan repo di /placeholder
 * dan /brand/galeri (WebP 800px + 1600px), atau foto brand di /brands yang punya salinan 400px
 * (daftar di data/image-variants.json, dibuat `npm run images:variants`). Undefined untuk URL lain.
 */
export function imageSrcSet(url: string): string | undefined {
  if (/^\/(placeholder|brand\/galeri)\//.test(url) && url.endsWith(".jpg")) {
    return `${repoWebp(url.replace(/\.jpg$/, "-800.jpg"))} 800w, ${repoWebp(url)} 1600w`;
  }
  const width = (BRAND_PHOTO_WIDTHS as Record<string, number>)[url];
  if (width) return `${url.replace(/\.webp$/, "-400.webp")} 400w, ${url} ${width}w`;
  if (!url.startsWith("/uploads/")) return undefined;
  return IMAGE_WIDTHS.map((w) => `${imageVariant(url, w)} ${w}w`).join(", ");
}

/** Video bawaan repo yang punya salinan 720px untuk layar HP (lebih ringan ±1 MB). */
const SMALL_VIDEOS: Record<string, string> = {
  "/video/bolu-sunyaragi-proses.mp4": "/video/bolu-sunyaragi-proses-720.mp4",
};

/** URL video yang diputar: salinan 720px di layar < 768px bila ada. Hanya dipanggil di browser. */
export function videoForScreen(url: string): string {
  return (window.matchMedia("(max-width: 767px)").matches && SMALL_VIDEOS[url]) || url;
}

/** Pengunjung menyalakan mode hemat data (Chrome Android "Lite"/Data Saver). Hanya dipanggil di browser. */
export function saveData(): boolean {
  return (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
}
