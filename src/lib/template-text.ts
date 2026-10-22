// Teks halaman template ANGLO, DADAK & GERABAH yang bisa diubah dari Admin > Isi Halaman (F6.13 / F6.8b).
// Nilai bawaan tetap di src/data/brands/*.ts. Yang diubah di Admin disimpan sebagai "timpaan" di tabel PageContent
// (pageKey "teks", sectionKey = nama template, data = { "<jalur>": "teks baru" }), lalu ditimpakan ke objek bawaan saat render.
// Field yang dikosongkan di Admin kembali ke teks bawaan. Tambah field baru cukup di TEMPLATE_TEXT_FIELDS.
import { cache } from "react";
import type { BrandTemplate, Prisma } from "@prisma/client";
import { AMINOTO } from "@/data/brands/aminoto";
import { GR } from "@/data/brands/apw-gerabah";
import { BAKMI_PAK_JOKO } from "@/data/brands/bakmi-pak-joko";
import { getActiveBrand } from "@/lib/active-brand";
import { prisma } from "@/lib/prisma";

export const TEXT_PAGE_KEY = "teks";

/** text = satu baris, long = paragraf, lines = beberapa baris (judul yang dipatah per baris), satu baris per item. */
export type TextField = { path: string; label: string; kind?: "text" | "long" | "lines" };
export type TextGroup = { title: string; fields: TextField[] };

const n = (count: number, fn: (i: number) => TextField[]) => Array.from({ length: count }, (_, i) => fn(i)).flat();

export const TEMPLATE_TEXT_FIELDS: Partial<Record<BrandTemplate, TextGroup[]>> = {
  ANGLO: [
    {
      title: "Beranda — Hero",
      fields: [
        { path: "hero.label", label: "Label kecil di atas judul" },
        { path: "hero.title", label: "Judul" },
        { path: "hero.subtitle", label: "Subjudul", kind: "long" },
        { path: "hero.hours", label: "Baris jam buka" },
      ],
    },
    {
      title: "Beranda — Kenapa anglo",
      fields: [
        { path: "whyAnglo.title", label: "Judul" },
        ...n(3, (i) => [
          { path: `whyAnglo.cards.${i}.title`, label: `Kartu ${i + 1} — judul` },
          { path: `whyAnglo.cards.${i}.body`, label: `Kartu ${i + 1} — isi`, kind: "long" as const },
        ]),
        { path: "featured.title", label: "Judul menu andalan" },
      ],
    },
    {
      title: "Cerita",
      fields: [
        { path: "story.title", label: "Judul" },
        ...n(4, (i) => [{ path: `story.paragraphs.${i}`, label: `Paragraf ${i + 1}`, kind: "long" as const }]),
      ],
    },
    {
      title: "Info Dapur Bu Joko",
      fields: [
        { path: "buJoko.title", label: "Judul" },
        { path: "buJoko.body", label: "Isi", kind: "long" },
      ],
    },
  ],
  DADAK: [
    {
      title: "Beranda",
      fields: [
        { path: "hero.title", label: "Hero — judul" },
        { path: "hero.sub", label: "Hero — subjudul" },
        { path: "intro.title", label: "Pembuka — judul" },
        { path: "intro.body", label: "Pembuka — isi", kind: "long" },
        { path: "featured.title", label: "Menu andalan — judul" },
        { path: "bakar.title", label: "Bisa dibakar — judul" },
        { path: "bakar.price", label: "Bisa dibakar — harga tambahan" },
        { path: "bakar.body", label: "Bisa dibakar — isi", kind: "long" },
        { path: "branches.title", label: "Cabang — judul" },
        { path: "branches.lead", label: "Cabang — isi", kind: "long" },
      ],
    },
    {
      title: "Catering",
      fields: [
        { path: "catering.title", label: "Judul" },
        { path: "catering.body", label: "Isi", kind: "long" },
        { path: "catering.whatsapp", label: "Nomor WhatsApp admin catering" },
      ],
    },
    {
      title: "Halaman Menu",
      fields: [
        { path: "menu.sub", label: "Subjudul" },
        ...n(3, (i) => [{ path: `menu.notes.${i}`, label: `Catatan ${i + 1}` }]),
      ],
    },
    {
      title: "Cerita",
      fields: [
        { path: "story.title", label: "Judul" },
        ...n(3, (i) => [{ path: `story.paragraphs.${i}`, label: `Paragraf ${i + 1}`, kind: "long" as const }]),
        ...n(4, (i) => [
          { path: `story.values.${i}.title`, label: `Nilai ${i + 1} — judul` },
          { path: `story.values.${i}.body`, label: `Nilai ${i + 1} — isi` },
        ]),
      ],
    },
    { title: "Footer", fields: [{ path: "footer.note", label: "Catatan footer" }] },
  ],
  GERABAH: [
    {
      title: "Info singkat",
      fields: [
        { path: "hoursShort", label: "Jam buka singkat" },
        { path: "closedDay", label: "Hari libur" },
        { path: "landmark", label: "Patokan lokasi" },
      ],
    },
    {
      title: "Beranda — Proses",
      fields: [
        { path: "home.proses.title", label: "Judul (satu baris per baris tampilan)", kind: "lines" },
        { path: "home.proses.lead", label: "Isi", kind: "long" },
        ...n(3, (i) => [
          { path: `home.proses.steps.${i}.title`, label: `Langkah ${i + 1} — judul` },
          { path: `home.proses.steps.${i}.body`, label: `Langkah ${i + 1} — isi`, kind: "long" as const },
        ]),
      ],
    },
    {
      title: "Beranda — Menu & suasana",
      fields: [
        { path: "home.menu.title", label: "Judul menu" },
        { path: "home.suasana.title", label: "Suasana — judul" },
        { path: "home.suasana.body", label: "Suasana — isi", kind: "long" },
      ],
    },
    {
      title: "Halaman Menu",
      fields: [
        { path: "menu.lead", label: "Pembuka" },
        { path: "menu.note", label: "Catatan" },
      ],
    },
    {
      title: "Cerita",
      fields: [
        { path: "story.title", label: "Judul (satu baris per baris tampilan)", kind: "lines" },
        { path: "story.lead", label: "Pembuka", kind: "long" },
        ...n(3, (i) => [
          { path: `story.chapters.${i}.title`, label: `Bab ${i + 1} — judul` },
          { path: `story.chapters.${i}.body`, label: `Bab ${i + 1} — isi`, kind: "long" as const },
        ]),
        ...n(3, (i) => [
          { path: `story.extras.${i}.title`, label: `Info ${i + 1} — judul` },
          { path: `story.extras.${i}.body`, label: `Info ${i + 1} — isi`, kind: "long" as const },
        ]),
      ],
    },
    {
      title: "Cabang & footer",
      fields: [
        { path: "branches.lead", label: "Cabang — pembuka", kind: "long" },
        { path: "footer.note", label: "Catatan footer" },
      ],
    },
  ],
};

const DEFAULTS = { ANGLO: BAKMI_PAK_JOKO, DADAK: AMINOTO, GERABAH: GR } as const;
type TextTemplate = keyof typeof DEFAULTS;

export function hasTemplateText(template: BrandTemplate): template is TextTemplate {
  return template in DEFAULTS;
}

export function templateTextFields(template: BrandTemplate): TextField[] {
  return (TEMPLATE_TEXT_FIELDS[template] ?? []).flatMap((g) => g.fields);
}

/** Nilai di objek bersarang lewat jalur "a.b.0.c". */
function getPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((o, k) => (o == null ? undefined : (o as Record<string, unknown>)[k]), obj);
}

function setPath(obj: unknown, path: string, value: unknown): void {
  const keys = path.split(".");
  const last = keys.pop()!;
  const parent = keys.reduce<unknown>((o, k) => (o == null ? undefined : (o as Record<string, unknown>)[k]), obj);
  if (parent != null && typeof parent === "object") (parent as Record<string, unknown>)[last] = value;
}

/** Teks bawaan satu field sebagai string (field "lines" digabung per baris). */
export function defaultText(template: TextTemplate, field: TextField): string {
  const v = getPath(DEFAULTS[template], field.path);
  return Array.isArray(v) ? v.join("\n") : typeof v === "string" ? v : "";
}

/** String dari form -> nilai yang disimpan ke objek template. */
export function toValue(field: TextField, text: string): string | string[] {
  return field.kind === "lines" ? text.split("\n").map((l) => l.trim()).filter(Boolean) : text;
}

export type TextOverrides = Record<string, string>;

/** Objek teks template = bawaan + timpaan dari Admin. Hanya jalur yang terdaftar di TEMPLATE_TEXT_FIELDS yang dipakai. */
export function applyTextOverrides<T>(template: TextTemplate, overrides: TextOverrides | null | undefined): T {
  const copy = structuredClone(DEFAULTS[template]) as T;
  if (!overrides) return copy;
  for (const field of templateTextFields(template)) {
    const text = overrides[field.path];
    if (typeof text === "string" && text.trim()) setPath(copy, field.path, toValue(field, text.trim()));
  }
  return copy;
}

export async function readTextOverrides(brandId: string, template: BrandTemplate): Promise<TextOverrides> {
  const row = await prisma.pageContent.findUnique({
    where: { brandId_pageKey_sectionKey: { brandId, pageKey: TEXT_PAGE_KEY, sectionKey: template } },
    select: { data: true },
  });
  const data = row?.data as Prisma.JsonObject | null | undefined;
  return data && typeof data === "object" && !Array.isArray(data) ? (Object.fromEntries(Object.entries(data).filter(([, v]) => typeof v === "string")) as TextOverrides) : {};
}

/** Teks template untuk brand aktif (per request). */
const activeText = cache(async (template: TextTemplate) => {
  const brand = await getActiveBrand();
  const overrides = brand && brand.template === template ? await readTextOverrides(brand.id, template) : null;
  return applyTextOverrides(template, overrides);
});

export const angloText = () => activeText("ANGLO") as Promise<typeof BAKMI_PAK_JOKO>;
export const dadakText = () => activeText("DADAK") as Promise<typeof AMINOTO>;
export const gerabahText = () => activeText("GERABAH") as Promise<typeof GR>;
