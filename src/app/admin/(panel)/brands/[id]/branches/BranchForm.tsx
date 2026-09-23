import type { Branch } from "@prisma/client";
import ActionForm from "@/components/admin/ActionForm";
import { TextArea, TextField } from "@/components/admin/fields";
import type { ActionState } from "@/lib/validation";

type Props = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  branch?: Branch;
  submitLabel?: string;
};

export default function BranchForm({ action, branch, submitLabel }: Props) {
  return (
    <ActionForm action={action} submitLabel={submitLabel}>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Nama cabang" name="name" required defaultValue={branch?.name} placeholder="AMG - Ciledug" />
        <TextField label="Jam buka" name="openHours" defaultValue={branch?.openHours} placeholder="10.00 - 22.00 setiap hari" />
      </div>
      <TextArea label="Alamat" name="address" required defaultValue={branch?.address} rows={2} />
      <TextField
        label="Link Google Maps"
        name="mapsUrl"
        type="url"
        defaultValue={branch?.mapsUrl}
        hint="Salin dari tombol Bagikan di Google Maps. Kosong = cari otomatis dari alamat."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Latitude" name="lat" defaultValue={branch?.lat} placeholder="-6.7320" hint="Opsional, untuk peta lebih akurat." />
        <TextField label="Longitude" name="lng" defaultValue={branch?.lng} placeholder="108.5523" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <TextField label="WhatsApp" name="whatsapp" type="tel" defaultValue={branch?.whatsapp} placeholder="0812xxxxxxx" />
        <TextField label="Telepon" name="phone" type="tel" defaultValue={branch?.phone} placeholder="0231xxxxxx" />
        <TextField label="Urutan" name="order" type="number" min={0} defaultValue={branch?.order ?? 0} />
      </div>
    </ActionForm>
  );
}
