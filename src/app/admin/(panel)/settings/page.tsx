import ActionForm from "@/components/admin/ActionForm";
import { Card, PageHeader, TextField } from "@/components/admin/fields";
import { ROLE_LABEL, requireAdmin } from "@/lib/admin";
import { changePassword, updateProfile } from "./actions";

export const metadata = { title: "Pengaturan" };

export default async function SettingsPage() {
  const admin = await requireAdmin();

  return (
    <div className="space-y-6">
      <PageHeader title="Pengaturan" description="Profil & password akun admin Anda." />

      <Card title="Profil">
        <p className="mb-4 text-sm text-gray-600">
          Email: <strong>{admin.email}</strong> · Peran: {ROLE_LABEL[admin.role]}
        </p>
        <ActionForm action={updateProfile}>
          <TextField label="Nama" name="name" defaultValue={admin.name} />
        </ActionForm>
      </Card>

      <Card title="Ganti password">
        <ActionForm action={changePassword} submitLabel="Ganti password" resetOnSuccess>
          <TextField label="Password lama" name="currentPassword" type="password" required autoComplete="current-password" />
          <TextField label="Password baru" name="newPassword" type="password" required minLength={8} autoComplete="new-password" hint="Minimal 8 karakter." />
          <TextField label="Ulangi password baru" name="confirmPassword" type="password" required autoComplete="new-password" />
        </ActionForm>
      </Card>
    </div>
  );
}
