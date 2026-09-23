// Foto placeholder (public/placeholder/) untuk brand yang belum upload foto lewat admin.
// Begitu admin mengisi foto, foto admin yang dipakai; placeholder hanya cadangan.

const DIR = "/placeholder";

export const PLACEHOLDER = {
  hero: `${DIR}/hero-pecel-lele.jpg`,
  lele: `${DIR}/lele-goreng.jpg`,
  ayam: `${DIR}/ayam-goreng-kremes.jpg`,
  bebek: `${DIR}/bebek-goreng.jpg`,
  tahuTempe: `${DIR}/tahu-tempe.jpg`,
  esTeh: `${DIR}/es-teh.jpg`,
  ulekSambal: `${DIR}/ulek-sambal.jpg`,
  cobek: `${DIR}/cobek-cabai.jpg`,
  warungMalam: `${DIR}/warung-tenda-malam.jpg`,
  kursiMerah: `${DIR}/warung-kursi-merah.jpg`,
  dapurMalam: `${DIR}/dapur-malam.jpg`,
  leleWajan: `${DIR}/lele-wajan.jpg`,
} as const;

/** Foto galeri cadangan kalau brand belum punya satu pun foto galeri. */
export const GALLERY_PLACEHOLDERS: { imageUrl: string; caption: string }[] = [
  { imageUrl: PLACEHOLDER.dapurMalam, caption: "Dapur mulai ngebul tiap sore" },
  { imageUrl: PLACEHOLDER.leleWajan, caption: "Wajan nggak pernah dingin" },
  { imageUrl: PLACEHOLDER.cobek, caption: "Cabai, tomat, terasi — siap diulek" },
  { imageUrl: PLACEHOLDER.warungMalam, caption: "Warung tenda, rame pas malam" },
  { imageUrl: PLACEHOLDER.tahuTempe, caption: "Tahu tempe, teman setia" },
  { imageUrl: PLACEHOLDER.kursiMerah, caption: "Kursi plastik, obrolan panjang" },
];

/** URL placeholder SVG lama (seed awal) dianggap belum ada foto. */
export function realPhoto(url: string | null | undefined): string | null {
  if (!url || url.startsWith("/placeholders/")) return null;
  return url;
}

/** Pilih placeholder menu dari nama/kategori ("Pecel Lele" -> foto lele). */
export function menuPlaceholder(name: string, category = ""): string {
  const text = `${name} ${category}`.toLowerCase();
  if (/lele|ikan|nila|gurame/.test(text)) return PLACEHOLDER.lele;
  if (/bebek|itik/.test(text)) return PLACEHOLDER.bebek;
  if (/ayam|kremes|geprek/.test(text)) return PLACEHOLDER.ayam;
  if (/tahu|tempe|mendoan/.test(text)) return PLACEHOLDER.tahuTempe;
  if (/\bes\b|teh|jeruk|minum|kopi|jus|wedang/.test(text)) return PLACEHOLDER.esTeh;
  return PLACEHOLDER.hero;
}

/** Foto menu dari DB, atau placeholder yang cocok kalau belum ada. */
export function menuPhoto(item: { name: string; imageUrl?: string | null }, category?: string): string {
  return realPhoto(item.imageUrl) ?? menuPlaceholder(item.name, category);
}
