// Bagian data yang benar-benar dibaca tiap template situs publik (dipakai Admin: tab, catatan, kelengkapan).
// Sumber: src/app/(public)/* dan src/components/templates/*. Ubah di sini bila template mulai/berhenti memakai sesuatu.
import type { BrandTemplate } from "@prisma/client";

export type TemplateFeatures = {
  /** Section Konten Halaman ("pageKey/sectionKey") yang dibaca template. */
  sections: string[];
  /** Album Galeri tampil di situs. */
  gallery: boolean;
  /** Promo aktif tampil di situs. */
  promos: boolean;
  /** Cabang di situs dibaca dari tabel Cabang (bukan dari kode). */
  dbBranches: boolean;
  /** Foto menu andalan tampil di Beranda (Editorial & Anglo sengaja tanpa foto). */
  menuPhotos: boolean;
  /** Logo dari Info Brand tampil di header/footer (Anglo & Dadak memakai logo bawaan template). */
  logo: boolean;
  /** File teks halaman yang dikunci di kode (hero, cerita, dll); null = teks dari Konten Halaman. */
  codeFile: string | null;
  /** Template masih dipakai brand aktif. */
  inUse: boolean;
};

const STORY = ["story/profile", "story/history", "story/values", "story/atmosphere"];

export const TEMPLATE_FEATURES: Record<BrandTemplate, TemplateFeatures> = {
  BOLD: {
    sections: ["home/hero", "home/process", "site/social", ...STORY],
    gallery: true,
    promos: true,
    dbBranches: true,
    menuPhotos: true,
    logo: true,
    codeFile: null,
    inUse: false,
  },
  EDITORIAL: {
    sections: ["home/hero", "home/intro", "home/chapters", "site/social", "gallery/feature", ...STORY],
    gallery: true,
    promos: false,
    dbBranches: true,
    menuPhotos: false,
    logo: true,
    codeFile: null,
    inUse: true,
  },
  ANGLO: {
    sections: [],
    gallery: false,
    promos: false,
    dbBranches: false,
    menuPhotos: false,
    logo: false,
    codeFile: "src/data/brands/bakmi-pak-joko.ts",
    inUse: true,
  },
  DADAK: { sections: [], gallery: false, promos: false, dbBranches: true, menuPhotos: true, logo: false, codeFile: "src/data/brands/aminoto.ts", inUse: true },
  GERABAH: { sections: [], gallery: false, promos: false, dbBranches: true, menuPhotos: true, logo: true, codeFile: "src/data/brands/apw-gerabah.ts", inUse: true },
  TUNGKU: { sections: [], gallery: false, promos: false, dbBranches: true, menuPhotos: true, logo: true, codeFile: "src/data/brands/apw.ts", inUse: false },
};

export const TEMPLATE_LABEL: Record<BrandTemplate, string> = {
  BOLD: "Bold",
  EDITORIAL: "Editorial",
  ANGLO: "Anglo",
  DADAK: "Dadak",
  GERABAH: "Gerabah",
  TUNGKU: "Tungku",
};

/** Kunci tab brand di Admin yang isinya tidak tampil di situs untuk template ini. */
export function mutedBrandTabs(template: BrandTemplate): string[] {
  const f = TEMPLATE_FEATURES[template];
  return [
    ...(f.sections.length ? [] : ["pages"]),
    ...(f.gallery ? [] : ["gallery"]),
    ...(f.promos ? [] : ["promos"]),
  ];
}
