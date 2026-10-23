import Link from "next/link";
import ActionForm from "@/components/admin/ActionForm";
import ImageField from "@/components/admin/ImageField";
import VideoField from "@/components/admin/VideoField";
import { Card, Checkbox, Notice, TextArea, TextField } from "@/components/admin/fields";
import { getBrandForAdmin } from "@/lib/admin";
import { PAGE_SECTIONS, type SectionData } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { TEMPLATE_FEATURES, TEMPLATE_LABEL } from "@/lib/template-features";
import { TEMPLATE_TEXT_FIELDS, defaultText, hasTemplateText, readTextOverrides } from "@/lib/template-text";
import { SEO_PAGES, getSeoOverrides } from "@/lib/seo";
import { saveSection, saveSeo, saveTemplateText } from "./actions";

export const metadata = { title: "Isi Halaman" };

// Urutan kunci = urutan tampil.
const PAGE_TITLE: Record<string, string> = { home: "Beranda", story: "Cerita", gallery: "Galeri", site: "Semua halaman (footer)" };

/** Judul & deskripsi yang tampil di hasil Google, per halaman. Kosong = dibuat otomatis dari data brand. */
async function SeoCard({ brandId }: { brandId: string }) {
  const seo = await getSeoOverrides(brandId);
  return (
    <Card title="Judul & deskripsi di Google">
      <p className="mb-4 text-sm text-gray-600">
        Kosongkan untuk memakai teks otomatis (nama brand, jenis makanan, kota, cabang). Judul ideal 50–60 karakter, deskripsi 120–155 karakter.
      </p>
      <ActionForm action={saveSeo.bind(null, brandId)} submitLabel="Simpan SEO">
        <div className="grid gap-4 lg:grid-cols-2">
          {SEO_PAGES.map(({ path, label }) => (
            <fieldset key={path} className="space-y-3 rounded-[20px] bg-white p-4">
              <legend className="sr-only">{label}</legend>
              <p aria-hidden className="text-sm font-bold">
                {label} <span className="font-normal text-gray-500">{path}</span>
              </p>
              <TextField label="Judul" name={`title:${path}`} id={`seo-title-${path}`} defaultValue={seo[path]?.title} maxLength={70} placeholder="Otomatis" />
              <TextArea label="Deskripsi" name={`description:${path}`} defaultValue={seo[path]?.description} rows={3} hint="Maksimal 200 karakter; Google memotong di ±155." />
            </fieldset>
          ))}
        </div>
      </ActionForm>
    </Card>
  );
}

export default async function BrandPagesAdmin({ params }: { params: Promise<{ id: string }> }) {
  const brand = await getBrandForAdmin((await params).id);
  const features = TEMPLATE_FEATURES[brand.template];
  const base = `/admin/brands/${brand.id}`;

  const template = brand.template;
  if (hasTemplateText(template)) {
    const overrides = await readTextOverrides(brand.id, template);
    const groups = TEMPLATE_TEXT_FIELDS[template] ?? [];
    return (
      <div className="space-y-6">
        <SeoCard brandId={brand.id} />
        <p className="text-[15px] text-[#d4dcc8]">
          Teks halaman template {TEMPLATE_LABEL[template]}. Ubah lalu klik Simpan; perubahan langsung tampil di situs. Kosongkan field untuk kembali
          ke teks bawaan. Foto, tata letak, dan teks kecil lainnya tetap diatur di kode.
        </p>
        {groups.map((group, gi) => (
          <Card key={group.title} title={group.title}>
            <ActionForm action={saveTemplateText.bind(null, brand.id, gi)} submitLabel="Simpan teks">
              {group.fields.map((field) => {
                const def = defaultText(template, field);
                const value = overrides[field.path] ?? def;
                const changed = field.path in overrides;
                const hint = changed ? `Sudah diubah. Teks bawaan: "${def.replaceAll("\n", " / ")}"` : undefined;
                return field.kind === "long" || field.kind === "lines" ? (
                  <TextArea key={field.path} label={field.label} name={field.path} defaultValue={value} rows={field.kind === "lines" ? 3 : 4} hint={hint} />
                ) : (
                  <TextField key={field.path} label={field.label} name={field.path} defaultValue={value} hint={hint} maxLength={2000} />
                );
              })}
            </ActionForm>
          </Card>
        ))}
      </div>
    );
  }

  if (features.codeFile) {
    return (
      <div className="space-y-4">
        <SeoCard brandId={brand.id} />
        <Notice tone="warn" title="Teks halaman ini diatur di kode">
          <p>
            Template {TEMPLATE_LABEL[brand.template]} mengambil teks hero, cerita, dan bagian halaman lain dari{" "}
            <code className="rounded bg-white/70 px-1">{features.codeFile}</code>, jadi form konten tidak ditampilkan di sini. Untuk mengubah teks itu,
            minta developer mengubah file tersebut.
          </p>
        </Notice>
        <Card title="Yang tetap bisa diubah dari Admin">
          <ul className="space-y-2 text-sm">
            <li>
              <Link href={base} className="font-medium hover:underline">
                Profil Brand
              </Link>{" "}
              <span className="text-gray-600">— nama, tagline, logo, favicon, link Instagram & TikTok, jenis masakan.</span>
            </li>
            <li>
              <Link href={`${base}/menu`} className="font-medium hover:underline">
                Menu
              </Link>{" "}
              <span className="text-gray-600">— nama, harga, foto, status habis, menu andalan.</span>
            </li>
            {features.dbBranches && (
              <li>
                <Link href={`${base}/branches`} className="font-medium hover:underline">
                  Cabang
                </Link>{" "}
                <span className="text-gray-600">— alamat, jam buka 7 hari, WhatsApp, Maps.</span>
              </li>
            )}
          </ul>
        </Card>
      </div>
    );
  }

  const rows = await prisma.pageContent.findMany({ where: { brandId: brand.id } });
  const byKey = new Map(rows.map((r) => [`${r.pageKey}/${r.sectionKey}`, r]));
  const defs = PAGE_SECTIONS.filter((d) => features.sections.includes(`${d.pageKey}/${d.sectionKey}`));
  const PAGE_ORDER = Object.keys(PAGE_TITLE);
  const pages = [...new Set(defs.map((d) => d.pageKey))].sort((a, b) => PAGE_ORDER.indexOf(a) - PAGE_ORDER.indexOf(b));

  return (
    <div className="space-y-8">
      <SeoCard brandId={brand.id} />
      <p className="text-sm text-gray-600">
        Hanya bagian yang dipakai template {TEMPLATE_LABEL[brand.template]} yang ditampilkan. Kosongkan field yang tidak dipakai; bagian tanpa foto
        memakai foto contoh bawaan.
      </p>
      {pages.map((pageKey) => (
        <section key={pageKey} className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{PAGE_TITLE[pageKey] ?? pageKey}</h2>
          {defs
            .filter((d) => d.pageKey === pageKey)
            .map((def) => {
              const row = byKey.get(`${def.pageKey}/${def.sectionKey}`);
              const data = (row?.data ?? {}) as SectionData;
              const has = (f: string) => def.fields.includes(f as never);
              const hidden = row ? !row.isVisible : false;
              return (
                <Card
                  key={`${def.pageKey}/${def.sectionKey}`}
                  title={def.label.replace(/^[^—]+—\s*/, "").replace(/\s*\(template Editorial\)/, "")}
                  actions={hidden && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">Disembunyikan</span>}
                >
                  <ActionForm action={saveSection.bind(null, brand.id, def.pageKey, def.sectionKey)}>
                    {has("title") && <TextField label="Judul" name="title" defaultValue={data.title} />}
                    {has("subtitle") && <TextField label="Subjudul" name="subtitle" defaultValue={data.subtitle} />}
                    {has("body") && <TextArea label="Isi" name="body" defaultValue={data.body} rows={5} />}
                    {has("items") && (
                      <TextArea
                        label="Poin-poin"
                        name="items"
                        defaultValue={data.items?.join("\n")}
                        rows={5}
                        hint={def.itemsHint ?? "Satu poin per baris."}
                      />
                    )}
                    {has("imageUrl") && <ImageField name="imageUrl" label={def.imageLabel ?? "Gambar"} brandId={brand.id} defaultValue={data.imageUrl} />}
                    {has("videoUrl") && (
                      <VideoField
                        name="videoUrl"
                        label="Video (MP4, opsional)"
                        brandId={brand.id}
                        defaultValue={data.videoUrl}
                        hint="Diputar otomatis tanpa suara. Kompres dulu: 1080p, < 15 MB. Foto tetap dipakai sebagai gambar awal."
                      />
                    )}
                    <Checkbox label="Tampilkan section ini" name="isVisible" defaultChecked={row?.isVisible ?? true} />
                  </ActionForm>
                </Card>
              );
            })}
        </section>
      ))}
    </div>
  );
}
