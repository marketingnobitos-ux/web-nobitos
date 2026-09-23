import type { Promo } from "@prisma/client";
import ActionForm from "@/components/admin/ActionForm";
import ImageField from "@/components/admin/ImageField";
import { Checkbox, TextArea, TextField } from "@/components/admin/fields";
import { toDateInput } from "@/lib/format";
import type { ActionState } from "@/lib/validation";

type Props = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  brandId: string;
  promo?: Promo;
  submitLabel?: string;
};

export default function PromoForm({ action, brandId, promo, submitLabel }: Props) {
  return (
    <ActionForm action={action} submitLabel={submitLabel}>
      <TextField label="Judul promo" name="title" required defaultValue={promo?.title} />
      <TextArea label="Deskripsi" name="description" defaultValue={promo?.description} rows={3} />
      <ImageField name="imageUrl" label="Banner promo" brandId={brandId} defaultValue={promo?.imageUrl} hint="Disarankan rasio 16:9." />
      <div className="grid gap-4 sm:grid-cols-3">
        <TextField label="Mulai" name="startsAt" type="date" defaultValue={toDateInput(promo?.startsAt)} hint="Kosong = langsung aktif." />
        <TextField label="Selesai" name="endsAt" type="date" defaultValue={toDateInput(promo?.endsAt)} hint="Kosong = tanpa batas." />
        <TextField label="Urutan" name="order" type="number" min={0} defaultValue={promo?.order ?? 0} />
      </div>
      <Checkbox label="Aktif" name="isActive" defaultChecked={promo?.isActive ?? true} />
    </ActionForm>
  );
}
