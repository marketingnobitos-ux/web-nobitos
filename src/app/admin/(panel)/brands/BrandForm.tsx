import type { Brand } from "@prisma/client";
import ActionForm from "@/components/admin/ActionForm";
import ImageField from "@/components/admin/ImageField";
import { Checkbox, ColorField, Select, TextField } from "@/components/admin/fields";
import type { ActionState } from "@/lib/validation";

type Props = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  brand?: Brand;
  submitLabel?: string;
};

export default function BrandForm({ action, brand, submitLabel }: Props) {
  return (
    <ActionForm action={action} submitLabel={submitLabel}>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Nama brand" name="name" required defaultValue={brand?.name} />
        <TextField
          label="Slug"
          name="slug"
          required
          defaultValue={brand?.slug}
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          hint="Huruf kecil & tanda minus, mis. bolu-sunyaragi. Dipakai untuk preview & folder upload."
        />
      </div>
      <TextField label="Tagline" name="tagline" defaultValue={brand?.tagline} />

      {brand ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <ImageField
            name="logoUrl"
            label="Logo"
            brandId={brand.id}
            defaultValue={brand.logoUrl}
            logo
            hint="Latar polos (putih/krem) otomatis dibuat transparan dan ruang kosong di sekeliling logo dipotong."
          />
          <ImageField name="faviconUrl" label="Favicon" brandId={brand.id} defaultValue={brand.faviconUrl} hint="Gambar persegi." />
        </div>
      ) : (
        <p className="text-sm text-gray-500">Logo & favicon bisa diunggah setelah brand dibuat.</p>
      )}

      <Select
        label="Template tampilan"
        name="template"
        defaultValue={brand?.template ?? "BOLD"}
        options={[
          { value: "BOLD", label: "Bold — tipografi tebal, foto besar, animasi ramai" },
          { value: "EDITORIAL", label: "Editorial — sinematik, lega, daftar harga tanpa foto" },
          { value: "ANGLO", label: "Anglo — khusus Bakmi Jowo Anglo Pak Joko (teks halaman dari kode)" },
        ]}
        hint="Data & admin sama; hanya tampilan situs publik yang berbeda. Editorial memakai warna secondary sebagai latar terang."
      />

      <div className="flex flex-wrap gap-6">
        <ColorField label="Warna primary" name="colorPrimary" defaultValue={brand?.colorPrimary ?? "#000000"} />
        <ColorField label="Warna secondary" name="colorSecondary" defaultValue={brand?.colorSecondary ?? "#ffffff"} />
        <ColorField label="Warna accent" name="colorAccent" defaultValue={brand?.colorAccent ?? brand?.colorPrimary ?? "#000000"} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Font judul" name="fontHeading" defaultValue={brand?.fontHeading} placeholder="mis. Poppins" />
        <TextField label="Font isi" name="fontBody" defaultValue={brand?.fontBody} placeholder="mis. Inter" />
      </div>

      <Checkbox
        label="Tayangkan (publish) di domain brand"
        name="isPublished"
        defaultChecked={brand?.isPublished}
        hint="Kalau belum dicentang, brand hanya bisa dilihat lewat mode preview."
      />
    </ActionForm>
  );
}
