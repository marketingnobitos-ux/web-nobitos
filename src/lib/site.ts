// Helper tampilan bersama untuk header/footer/daftar cabang semua template.

export type Social = { label: string; url: string };

/** Baris "Instagram | https://..." dari admin -> link; hanya URL http(s) yang dipakai. */
export function parseSocial(items: string[] | undefined): Social[] {
  return (items ?? []).flatMap((line) => {
    const [a, b] = line.split("|").map((s) => s.trim());
    const url = b ?? a;
    if (!/^https?:\/\//i.test(url)) return [];
    try {
      const label = b ? a : new URL(url).hostname.replace(/^www\./, "");
      return [{ label, url }];
    } catch {
      return [];
    }
  });
}

/**
 * Instagram & TikTok dari kolom Brand (kosong = tidak dirender), lalu link lain dari konten Admin (mis. Threads).
 * Baris Instagram/TikTok di konten Admin diabaikan supaya sumbernya satu.
 */
export function brandSocial(
  brand: { instagramUrl: string | null; tiktokUrl: string | null },
  items: string[] | undefined,
): Social[] {
  const own: Social[] = [
    ...(brand.instagramUrl ? [{ label: "Instagram", url: brand.instagramUrl }] : []),
    ...(brand.tiktokUrl ? [{ label: "TikTok", url: brand.tiktokUrl }] : []),
  ];
  const others = parseSocial(items).filter((s) => !/(^|\.)(instagram|tiktok)\.com$/i.test(new URL(s.url).hostname));
  return [...own, ...others];
}

/** "https://www.instagram.com/bakmi.pakjoko" -> "@bakmi.pakjoko"; TikTok sudah memakai "@". */
export function socialHandle(url: string): string {
  const last = new URL(url).pathname.split("/").filter(Boolean).at(-1) ?? "";
  return last.startsWith("@") ? last : `@${last}`;
}

/** Pesan awal WhatsApp bawaan (etalase, bukan pemesanan). Tanpa cabang = tombol level brand. */
export function waMessage(brandName: string, branchName?: string): string {
  return branchName ? `Halo ${brandName} cabang ${branchName}, mau tanya dong.` : `Halo ${brandName}, mau tanya dong.`;
}

const FILE_NAME = /\.(jpe?g|png|webp|gif|avif|svg|heic)$/i;

/** Alt gambar: pakai `text` kalau berisi dan bukan nama/path file, selain itu `fallback`. Tidak pernah kosong. */
export function altText(text: string | null | undefined, fallback: string): string {
  const t = text?.trim();
  return t && !FILE_NAME.test(t) && !t.includes("/") ? t : fallback;
}

/** "16.00 - 23.00 setiap hari" -> "16.00–23.00" (jam saja untuk baris ringkas). */
export function shortHours(openHours: string | null): string | null {
  const m = openHours?.match(/(\d{1,2}[.:]\d{2})\s*[-–]\s*(\d{1,2}[.:]\d{2})/);
  return m ? `${m[1]}–${m[2]}` : openHours;
}

/** "AMG - Ciledug" -> "AMG — Ciledug". */
export function branchLabel(name: string): string {
  return name.replace(/\s+-\s+/, " — ");
}

/** "Judul | isi" per baris -> { title, body }. Baris tanpa "|" jadi judul saja. */
export function parseChapters(items: string[] | undefined): { title: string; body: string }[] {
  return (items ?? []).map((line) => {
    const [title, ...rest] = line.split("|");
    return { title: title.trim(), body: rest.join("|").trim() };
  });
}
