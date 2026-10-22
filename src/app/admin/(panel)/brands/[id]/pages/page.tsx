import Link from "next/link";
import ActionForm from "@/components/admin/ActionForm";
import ImageField from "@/components/admin/ImageField";
import VideoField from "@/components/admin/VideoField";
import { Card, Checkbox, Notice, TextArea, TextField } from "@/components/admin/fields";
import { getBrandForAdmin } from "@/lib/admin";
import { PAGE_SECTIONS, type SectionData } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { TEMPLATE_FEATURES, TEMPLATE_LABEL } from "@/lib/template-features";
import { saveSection } from "./actions";

export const metadata = { title: "Isi Halaman" };

// Urutan kunci = urutan tampil.
const PAGE_TITLE: Record<string, string> = { home: "Beranda", story: "Cerita", gallery: "Galeri", site: "Semua halaman (footer)" };

export default async function BrandPagesAdmin({ params }: { params: Promise<{ id: string }> }) {
  const brand = await getBrandForAdmin((await params).id);
  const features = TEMPLATE_FEATURES[brand.template];
  const base = `/admin/brands/${brand.id}`;

  if (features.codeFile) {
    return (
      <div className="space-y-4">
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
