// Helper format tampilan (harga, link kontak & peta).

const rupiahFormatter = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });

/** 25000 -> "Rp 25.000" */
export function formatRupiah(value: number): string {
  return `Rp ${rupiahFormatter.format(value)}`;
}

/** "0812-3456-789" / "+62 812..." -> "628123456789" (format internasional untuk wa.me). */
export function toIntlPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("8")) return `62${digits}`;
  return digits;
}

export function whatsappUrl(number: string, message?: string): string {
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${toIntlPhone(number)}${text}`;
}

export function telUrl(number: string): string {
  return `tel:+${toIntlPhone(number)}`;
}

type MapTarget = { mapsUrl?: string | null; lat?: number | null; lng?: number | null; address: string };

function mapQuery({ lat, lng, address }: MapTarget): string {
  return lat != null && lng != null ? `${lat},${lng}` : address;
}

/** Link "Buka di Google Maps": pakai mapsUrl dari admin kalau ada. */
export function mapsLink(target: MapTarget): string {
  if (target.mapsUrl) return target.mapsUrl;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery(target))}`;
}

/** URL iframe embed Google Maps (tanpa API key). */
export function mapsEmbedUrl(target: MapTarget): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(mapQuery(target))}&output=embed`;
}

// Semua tanggal ditampilkan dalam zona WIB, tidak tergantung zona waktu server.
const TIME_ZONE = "Asia/Jakarta";
const dateFormatter = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: TIME_ZONE });

/** Date -> "23 September 2026" (WIB) */
export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}

/** Date -> "2026-09-23" (WIB) untuk <input type="date">. */
export function toDateInput(date: Date | null | undefined): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(date);
}

/** "AMG - Ciledug" -> "amg-ciledug" (untuk label data-track). */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
