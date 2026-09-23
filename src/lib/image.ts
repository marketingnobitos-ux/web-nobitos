// Helper URL gambar (aman dipakai di client & server).

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
 * srcSet responsif: gambar upload (400/1000/1920 WebP) atau foto bawaan repo di /placeholder
 * dan /brand/galeri (versi -800.jpg + 1600px). Undefined untuk URL lain.
 */
export function imageSrcSet(url: string): string | undefined {
  if (/^\/(placeholder|brand\/galeri)\//.test(url) && url.endsWith(".jpg")) {
    return `${url.replace(/\.jpg$/, "-800.jpg")} 800w, ${url} 1600w`;
  }
  if (!url.startsWith("/uploads/")) return undefined;
  return IMAGE_WIDTHS.map((w) => `${imageVariant(url, w)} ${w}w`).join(", ");
}
