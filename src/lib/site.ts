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
