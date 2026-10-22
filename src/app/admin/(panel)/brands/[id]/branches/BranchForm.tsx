import type { Branch, BranchHours } from "@prisma/client";
import ActionForm from "@/components/admin/ActionForm";
import HoursEditor from "@/components/admin/HoursEditor";
import { Section, TextArea, TextField } from "@/components/admin/fields";
import type { ActionState } from "@/lib/validation";

type Props = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  branch?: Branch & { hours: BranchHours[] };
  submitLabel?: string;
};

export default function BranchForm({ action, branch, submitLabel }: Props) {
  return (
    <ActionForm action={action} submitLabel={submitLabel} className="space-y-8">
      <Section title="Lokasi">
        <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
          <TextField label="Nama cabang" name="name" required defaultValue={branch?.name} placeholder="AMG - Ciledug" />
          <TextField label="Urutan" name="order" type="number" min={0} defaultValue={branch?.order ?? 0} hint="Kecil tampil lebih dulu." />
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
          <TextField label="Latitude" name="lat" defaultValue={branch?.lat} placeholder="-6.7320" hint="Opsional, untuk peta & data Google lebih akurat." />
          <TextField label="Longitude" name="lng" defaultValue={branch?.lng} placeholder="108.5523" />
        </div>
      </Section>

      <Section title="Kontak">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="WhatsApp" name="whatsapp" type="tel" defaultValue={branch?.whatsapp} placeholder="0812xxxxxxx" />
          <TextField label="Telepon" name="phone" type="tel" defaultValue={branch?.phone} placeholder="0231xxxxxx" />
        </div>
      </Section>

      <Section title="Jam buka">
        <HoursEditor defaultValue={branch?.hours} />
        <TextField
          label="Keterangan jam (teks tampilan)"
          name="openHours"
          defaultValue={branch?.openHours}
          placeholder="10.00 - 22.00 setiap hari"
          hint="Kosong = dibuat otomatis dari jam 7 hari kalau jamnya sama setiap hari."
        />
      </Section>
    </ActionForm>
  );
}
