// Nama event klik (data-track) seragam lintas template (ROADMAP F0.6).
// Format: `<jenis>_click[:<detail>]`. Detail untuk WA/Maps/telepon = slug cabang (bukan ID database).
// Posisi tombol (header/footer/kartu) tidak masuk nama; halaman asal sudah tercatat di kolom `path`.
import { slugify } from "@/lib/format";

export type TrackKind =
  | "wa"
  | "maps"
  | "tel"
  | "ig"
  | "tiktok"
  | "threads"
  | "sosmed"
  | "ig_bujoko"
  | "menu"
  | "cabang"
  | "galeri"
  | "cerita"
  | "beranda"
  | "menu_item"
  | "promo"
  | "picker"
  | "picker_result";

/** trackName("wa", "kartini") -> "wa_click:kartini"; trackName("menu") -> "menu_click". */
export function trackName(kind: TrackKind, detail?: string | number): string {
  return detail === undefined || detail === "" ? `${kind}_click` : `${kind}_click:${detail}`;
}

/** Slug cabang untuk detail event: "AMG - Ciledug" -> "amg-ciledug". */
export function branchKey(name: string): string {
  return slugify(name);
}

/** Tautan sosial dari label: Instagram -> ig_click, TikTok -> tiktok_click, Threads -> threads_click, lain -> sosmed_click:<label>. */
export function socialTrack(label: string): string {
  const key = slugify(label);
  if (key === "instagram") return trackName("ig");
  if (key === "tiktok") return trackName("tiktok");
  if (key === "threads") return trackName("threads");
  return trackName("sosmed", key);
}

// ---------- Nama lama -> nama baru (untuk data yang sudah ada di DB) ----------

const NEW_FORMAT = /^[a-z_]+_click(:.+)?$/;

const EXACT: Record<string, string> = {
  "cta-lihat-menu": trackName("menu"),
  "cta-semua-menu": trackName("menu"),
  "cta-andalan-lihat-menu": trackName("menu"),
  "ed-semua-menu": trackName("menu"),
  "ed-hero-primary": trackName("menu"),
  "404-menu": trackName("menu"),
  "cta-cari-cabang": trackName("cabang"),
  "cta-cari-lokasi": trackName("cabang"),
  "cta-lihat-cabang": trackName("cabang"),
  "header-cabang": trackName("cabang"),
  "ed-cerita-cabang": trackName("cabang"),
  "cta-cabang-dari-menu": trackName("cabang"),
  "cta-lihat-galeri": trackName("galeri"),
  "teaser-galeri": trackName("galeri"),
  "cta-cerita": trackName("cerita"),
  "cta-lihat-cerita": trackName("cerita"),
  "404-beranda": trackName("beranda"),
  // Hanya Bolu (EDITORIAL) yang memakai dua nama ini, dan Bolu selalu punya nomor WA -> tombolnya WhatsApp.
  "ed-hero-secondary": trackName("wa"),
  "ed-cta-penutup": trackName("wa"),
  "picker-hasil": trackName("picker_result"),
  "footer-instagram": trackName("ig"),
  "footer-tiktok": trackName("tiktok"),
  "ig-bujoko-beranda": trackName("ig_bujoko"),
};

const PATTERNS: [RegExp, (m: RegExpMatchArray) => [TrackKind, string]][] = [
  // ANGLO LocationCard & footer Editorial: cabang-maps-kartini, footer-wa-kartini
  [/^(?:cabang|footer)-(maps|wa)-(.+)$/, (m) => [m[1] as TrackKind, m[2]]],
  // BranchCard & versi lama: maps-cabang-<c>, wa-beranda-<c>, wa-home-<id>, telp-cabang-<id>
  [/^(maps|wa|telp)-(?:cabang|beranda|home)-(.+)$/, (m) => [m[1] === "telp" ? "tel" : (m[1] as TrackKind), m[2]]],
  // Beranda Editorial: ed-maps-<cuid>
  [/^ed-maps-(.+)$/, (m) => ["maps", m[1]]],
  // Beranda BOLD: maps-<c>, wa-<c>
  [/^(maps|wa)-(.+)$/, (m) => [m[1] as TrackKind, m[2]]],
  [/^ig-bujoko-cabang-(.+)$/, (m) => ["ig_bujoko", m[1]]],
  [/^cabang-(.+)$/, (m) => ["cabang", m[1]]],
  [/^menu-andalan-(.+)$/, (m) => ["menu_item", m[1]]],
  [/^promo-(.+)$/, (m) => ["promo", m[1]]],
  [/^picker-(.+)$/, (m) => ["picker", m[1]]],
];

/**
 * Terjemahkan nama event lama ke konvensi F0.6 supaya angka lama tetap terbaca di Dashboard.
 * `branchSlugById`: ID cabang (cuid) -> slug cabang, untuk nama lama yang memakai ID database.
 * Nama yang sudah baru atau tidak dikenal dikembalikan apa adanya.
 */
export function normalizeTarget(target: string, branchSlugById?: Map<string, string>): string {
  if (NEW_FORMAT.test(target)) return target;
  if (EXACT[target]) return EXACT[target];
  const social = target.match(/^footer-sosmed-(.+)$/);
  if (social) return socialTrack(social[1]);
  for (const [re, to] of PATTERNS) {
    const m = target.match(re);
    if (m) {
      const [kind, detail] = to(m);
      return trackName(kind, branchSlugById?.get(detail) ?? detail);
    }
  }
  return target;
}
