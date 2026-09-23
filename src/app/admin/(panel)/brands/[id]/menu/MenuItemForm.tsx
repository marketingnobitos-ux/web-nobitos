import type { MenuItem } from "@prisma/client";
import ActionForm from "@/components/admin/ActionForm";
import ImageField from "@/components/admin/ImageField";
import { Checkbox, Select, TextArea, TextField } from "@/components/admin/fields";
import type { ActionState } from "@/lib/validation";

type Props = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  brandId: string;
  categories: { id: string; name: string }[];
  item?: MenuItem;
  defaultCategoryId?: string;
  submitLabel?: string;
};

export default function MenuItemForm({ action, brandId, categories, item, defaultCategoryId, submitLabel }: Props) {
  return (
    <ActionForm action={action} submitLabel={submitLabel}>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Nama menu" name="name" required defaultValue={item?.name} />
        <Select
          label="Kategori"
          name="categoryId"
          required
          defaultValue={item?.categoryId ?? defaultCategoryId}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
        />
      </div>
      <TextArea label="Deskripsi" name="description" defaultValue={item?.description} rows={3} />
      <div className="grid gap-4 sm:grid-cols-3">
        <TextField label="Harga (Rp)" name="price" type="number" min={0} step={500} required defaultValue={item?.price} hint="Angka saja, mis. 25000" />
        <TextField label="Porsi" name="portion" defaultValue={item?.portion} placeholder="1 porsi / 500 gr" />
        <TextField label="Urutan" name="order" type="number" min={0} defaultValue={item?.order ?? 0} hint="Kecil tampil lebih dulu." />
      </div>
      <ImageField name="imageUrl" label="Foto menu" brandId={brandId} defaultValue={item?.imageUrl} />
      <div className="flex flex-wrap gap-6">
        <Checkbox label="Menu andalan (tampil di Beranda)" name="isFeatured" defaultChecked={item?.isFeatured} />
        <Checkbox label="Tersedia" name="isAvailable" defaultChecked={item?.isAvailable ?? true} />
      </div>
    </ActionForm>
  );
}
