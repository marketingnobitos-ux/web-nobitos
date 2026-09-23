import ActionForm from "@/components/admin/ActionForm";
import ImageField from "@/components/admin/ImageField";
import VideoField from "@/components/admin/VideoField";
import { Card, Checkbox, TextArea, TextField } from "@/components/admin/fields";
import { getBrandForAdmin } from "@/lib/admin";
import { PAGE_SECTIONS, type SectionData } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { saveSection } from "./actions";

export const metadata = { title: "Konten Halaman" };

export default async function BrandPagesAdmin({ params }: { params: Promise<{ id: string }> }) {
  const brand = await getBrandForAdmin((await params).id);
  const rows = await prisma.pageContent.findMany({ where: { brandId: brand.id } });
  const byKey = new Map(rows.map((r) => [`${r.pageKey}/${r.sectionKey}`, r]));

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        Teks & foto tiap section di halaman Beranda, Cerita, dan footer. Kosongkan field yang tidak dipakai; bagian tanpa foto memakai foto contoh bawaan.
      </p>
      {PAGE_SECTIONS.map((def) => {
        const row = byKey.get(`${def.pageKey}/${def.sectionKey}`);
        const data = (row?.data ?? {}) as SectionData;
        const has = (f: string) => def.fields.includes(f as never);
        return (
          <Card key={`${def.pageKey}/${def.sectionKey}`} title={def.label}>
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
                  label="Video hero (MP4, opsional — dipakai template Editorial)"
                  brandId={brand.id}
                  defaultValue={data.videoUrl}
                  hint="Diputar otomatis tanpa suara. Kompres dulu: 1080p, < 15 MB. Foto hero tetap dipakai sebagai gambar awal."
                />
              )}
              <Checkbox label="Tampilkan section ini" name="isVisible" defaultChecked={row?.isVisible ?? true} />
            </ActionForm>
          </Card>
        );
      })}
    </div>
  );
}
