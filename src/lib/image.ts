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
