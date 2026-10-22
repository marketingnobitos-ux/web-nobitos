import Link from "next/link";
import type { AdminRole } from "@prisma/client";
import ActionForm from "@/components/admin/ActionForm";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import { Card, PageHeader, TextField } from "@/components/admin/fields";
import { ROLE_LABEL, can, initials, requireAdmin, whenLabel } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { changePassword, createStaff, deleteStaff, updateProfile, updateStaff } from "./actions";

export const metadata = { title: "Akun & Akses" };

const ROLES: AdminRole[] = ["SUPER_ADMIN", "BRAND_ADMIN", "EDITOR", "VIEWER"];
const ROLE_BG: Record<AdminRole, string> = { SUPER_ADMIN: "#a6d27a", BRAND_ADMIN: "#f5d58a", EDITOR: "#c7d9f2", VIEWER: "#e4e5dd" };
const ROLE_HINT: Record<AdminRole, string> = {
  SUPER_ADMIN: "Semua brand, domain, akun & akses.",
  BRAND_ADMIN: "Brand yang dicentang: menu, promo, galeri, isi halaman, profil brand & lokasi.",
  EDITOR: "Brand yang dicentang: menu, stok, promo, galeri, isi halaman.",
  VIEWER: "Brand yang dicentang: hanya melihat data.",
};

/** Baris tabel hak akses (mockup Akun & Akses). Urutan kolom = Super, Admin, Editor, Pantau. */
const MATRIX: [string, boolean[]][] = [
  ["Lihat ringkasan & data", [true, true, true, true]],
  ["Ubah menu, stok, promo, galeri, isi halaman", [true, true, true, false]],
  ["Ubah profil brand & lokasi", [true, true, false, false]],
  ["Domain, akun & akses", [true, false, false, false]],
];

const DAY_MS = 86_400_000;

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ peran?: string }> }) {
  const admin = await requireAdmin();
  const isSuper = can(admin.role, "super");
  const { peran } = await searchParams;
  const roleFilter = ROLES.find((r) => r === peran);
  const now = new Date();
  const since7 = new Date(now.getTime() - 7 * DAY_MS);

  const [staff, brands, log, changes7, myBrands] = await Promise.all([
    isSuper
      ? prisma.adminUser.findMany({
          orderBy: [{ role: "asc" }, { name: "asc" }, { email: "asc" }],
          select: { id: true, name: true, email: true, role: true, lastSeenAt: true, brands: { select: { brandId: true, brand: { select: { name: true } } } } },
        })
      : Promise.resolve([]),
    isSuper ? prisma.brand.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }) : Promise.resolve([]),
    prisma.adminActivity.findMany({
      where: { createdAt: { gte: since7 }, ...(isSuper ? {} : { adminId: admin.id }) },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    isSuper ? prisma.adminActivity.count({ where: { createdAt: { gte: since7 } } }) : Promise.resolve(0),
    isSuper ? Promise.resolve([]) : prisma.adminBrand.findMany({ where: { adminId: admin.id }, select: { brand: { select: { name: true } } } }),
  ]);

  const todayKey = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(now);
  const activeToday = staff.filter((s) => s.lastSeenAt && new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(s.lastSeenAt) === todayKey).length;
  const shown = roleFilter ? staff.filter((s) => s.role === roleFilter) : staff;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <PageHeader
          title="Akun & Akses"
          description={isSuper ? "Atur siapa yang boleh masuk, brand mana yang boleh dikelola, dan pantau perubahan yang dibuat staf." : "Profil, kata sandi, dan riwayat perubahan akun Anda."}
        />
        {isSuper && (
          <dl className="flex gap-8 sm:gap-11">
            <Kpi label="Akun" value={staff.length} />
            <Kpi label="Aktif hari ini" value={activeToday} />
            <Kpi label="Perubahan 7 hari" value={changes7} />
          </dl>
        )}
      </div>

      {isSuper && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <div className="adm-scroll-x -mx-3 flex w-[calc(100%+24px)] gap-2 overflow-x-auto px-3 sm:mx-0 sm:w-auto sm:flex-wrap sm:px-0" aria-label="Saring peran">
              <Link href="/admin/settings" aria-current={roleFilter ? undefined : "true"} className="adm-chip">
                Semua
              </Link>
              {ROLES.map((r) => (
                <Link key={r} href={`/admin/settings?peran=${r}`} aria-current={roleFilter === r ? "true" : undefined} className="adm-chip">
                  {ROLE_LABEL[r]}
                </Link>
              ))}
            </div>
            <span className="hidden flex-1 lg:block" />
            <a href="#tambah-staf" className="adm-btn !h-[52px] w-full !px-6 !text-base sm:w-auto">
              + Tambah staf
            </a>
          </div>

          <div className="flex flex-wrap items-start gap-5">
            <section className="adm-dark flex min-w-0 flex-[999_1_520px] flex-col gap-2.5 rounded-[28px] p-3.5 sm:rounded-[32px] sm:p-6">
              <h2 className="px-1.5 pb-1.5 text-lg font-bold">Daftar akun</h2>
              {shown.length === 0 && <p className="px-1.5 text-sm text-[#a9aca3]">Belum ada akun dengan peran ini.</p>}
              {shown.map((s) => {
                const brandNames = s.role === "SUPER_ADMIN" ? "Semua brand" : s.brands.map((b) => b.brand.name).join(", ") || "Belum ada brand";
                const seen = s.lastSeenAt ? whenLabel(s.lastSeenAt, now) : "Belum pernah masuk";
                return (
                  <details key={s.id} className="group rounded-[22px] bg-[#232323]">
                    <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-3.5 gap-y-2 px-4 py-3.5 md:flex-nowrap [&::-webkit-details-marker]:hidden">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eef0e2] font-extrabold text-[#141414]">{initials(s.name ?? s.email)}</span>
                      <span className="min-w-0 flex-[1_1_200px]">
                        <span className="block truncate font-bold">
                          {s.name ?? s.email}
                          {s.id === admin.id && <span className="font-normal text-[#a9aca3]"> (Anda)</span>}
                        </span>
                        <span className="block truncate text-[13px] text-[#a9aca3]">{s.email}</span>
                      </span>
                      <span className="shrink-0 rounded-full px-3 py-1 text-xs font-bold text-[#141414]" style={{ background: ROLE_BG[s.role] }}>
                        {ROLE_LABEL[s.role]}
                      </span>
                      <span className="min-w-0 flex-[1_1_120px] truncate text-[13px] text-[#c9ccc2]" title={brandNames}>
                        {brandNames}
                      </span>
                      <span className="shrink-0 whitespace-nowrap text-[13px] text-[#a9aca3]">{seen}</span>
                      <span aria-hidden className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#3a3a3a] group-open:bg-[#3a3a3a]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4" />
                        </svg>
                      </span>
                      <span className="sr-only">Ubah akses akun</span>
                    </summary>
                    <div className="adm-light m-2 mt-0 rounded-[18px] bg-[#eef0e2] p-4">
                      <StaffForm
                        action={updateStaff.bind(null, s.id)}
                        brands={brands}
                        submitLabel="Simpan akun"
                        defaults={{ name: s.name ?? "", email: s.email, role: s.role, brandIds: s.brands.map((b) => b.brandId) }}
                        lockRole={s.id === admin.id}
                      />
                      {s.id !== admin.id && (
                        <form action={deleteStaff.bind(null, s.id)} className="mt-3 border-t border-gray-200 pt-3">
                          <ConfirmSubmit message={`Hapus akun ${s.email}? Staf ini tidak bisa masuk lagi. Log aktivitasnya tetap tersimpan.`}>Hapus akun</ConfirmSubmit>
                        </form>
                      )}
                    </div>
                  </details>
                );
              })}
            </section>

            <section className="adm-light adm-card flex min-w-0 flex-[1_1_320px] flex-col gap-3">
              <h2 className="text-[17px] font-bold">Hak akses per peran</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#5b6157]">
                    <th className="py-1.5 pr-2 font-semibold">Bisa</th>
                    {["Super", "Admin", "Editor", "Pantau"].map((h) => (
                      <th key={h} className="px-1 py-1.5 text-center font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MATRIX.map(([label, cells]) => (
                    <tr key={label} className="border-t border-gray-200">
                      <td className="py-2.5 pr-2 font-semibold">{label}</td>
                      {cells.map((ok, i) => (
                        <td key={i} className="px-1 text-center">
                          {ok ? <span aria-label="boleh">✓</span> : <span className="text-[#8e9386]" aria-label="tidak">—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[13px] text-[#5b6157]">Admin Brand, Editor, dan Pemantau hanya melihat brand yang dicentang di akunnya.</p>
            </section>
          </div>
        </>
      )}

      <section className="adm-card adm-card-green flex flex-col gap-1.5">
        <div className="mb-1 flex items-center justify-between gap-3">
          <h2 className="text-[17px] font-bold">{isSuper ? "Aktivitas staf" : "Aktivitas Anda"}</h2>
          <span className="text-[13px] text-[#d4dcc8]">7 hari terakhir</span>
        </div>
        {log.length === 0 ? (
          <p className="text-sm text-[#d4dcc8]">Belum ada perubahan.</p>
        ) : (
          log.map((l) => (
            <div key={l.id} className="flex flex-wrap items-center gap-x-3 gap-y-0.5 border-b border-[rgba(244,243,234,0.14)] py-2.5 text-[15px] last:border-0">
              <span className="w-[120px] shrink-0 text-[13px] text-[#d4dcc8]">{whenLabel(l.createdAt, now)}</span>
              <span className="min-w-0 flex-[1_1_260px]">
                <strong className="font-bold">{l.adminName}</strong> {l.action}
              </span>
              <span className="text-[13px] text-[#d4dcc8]">{l.brandName ?? "Akun"}</span>
            </div>
          ))
        )}
      </section>

      {isSuper && (
        <div id="tambah-staf" className="scroll-mt-6">
          <Card title="Tambah staf">
            <p className="mb-4 text-sm text-gray-600">Buat akun, lalu berikan email & kata sandi awal ke staf. Staf bisa mengganti kata sandinya sendiri setelah masuk.</p>
            <StaffForm action={createStaff} brands={brands} submitLabel="Buat akun" isNew />
          </Card>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Profil Anda">
          <p className="mb-4 text-sm text-gray-600">
            Email: <strong>{admin.email}</strong> · Peran: {ROLE_LABEL[admin.role]}
            {!isSuper && myBrands.length > 0 && <> · Brand: {myBrands.map((b) => b.brand.name).join(", ")}</>}
          </p>
          <ActionForm action={updateProfile}>
            <TextField label="Nama" name="name" defaultValue={admin.name} />
          </ActionForm>
        </Card>

        <Card title="Ganti kata sandi">
          <ActionForm action={changePassword} submitLabel="Ganti kata sandi" resetOnSuccess>
            <TextField label="Kata sandi lama" name="currentPassword" type="password" required autoComplete="current-password" />
            <TextField label="Kata sandi baru" name="newPassword" type="password" required minLength={8} autoComplete="new-password" hint="Minimal 8 karakter." />
            <TextField label="Ulangi kata sandi baru" name="confirmPassword" type="password" required autoComplete="new-password" />
          </ActionForm>
        </Card>
      </div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-xs text-[#d4dcc8] sm:text-sm">{label}</dt>
      <dd className="mt-1 text-4xl font-semibold tabular-nums tracking-tight sm:text-[52px] sm:leading-none">{value}</dd>
    </div>
  );
}

type StaffDefaults = { name: string; email: string; role: AdminRole; brandIds: string[] };

/** Form akun staf (tambah & ubah). Super Admin otomatis semua brand, jadi centang brand diabaikan untuk peran itu. */
function StaffForm({
  action,
  brands,
  submitLabel,
  defaults,
  isNew,
  lockRole,
}: {
  action: Parameters<typeof ActionForm>[0]["action"];
  brands: { id: string; name: string }[];
  submitLabel: string;
  defaults?: StaffDefaults;
  isNew?: boolean;
  lockRole?: boolean;
}) {
  const key = defaults?.email ?? "baru";
  return (
    <ActionForm action={action} submitLabel={submitLabel} resetOnSuccess={isNew}>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Nama" name="name" required defaultValue={defaults?.name} id={`nama-${key}`} />
        <TextField label="Email" name="email" type="email" required defaultValue={defaults?.email} autoComplete="off" id={`email-${key}`} />
      </div>
      <fieldset>
        <legend className="mb-1.5 text-sm font-semibold text-gray-800">Peran</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {ROLES.map((r) => (
            <label key={r} className={`flex gap-2.5 rounded-2xl bg-white p-3 text-sm ${lockRole && r !== defaults?.role ? "opacity-50" : ""}`}>
              <input type="radio" name="role" value={r} defaultChecked={(defaults?.role ?? "EDITOR") === r} disabled={lockRole && r !== defaults?.role} className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-[#45593c]" />
              <span>
                <span className="block font-bold">{ROLE_LABEL[r]}</span>
                <span className="block text-xs text-gray-600">{ROLE_HINT[r]}</span>
              </span>
            </label>
          ))}
        </div>
        {lockRole && <p className="mt-1 text-xs text-gray-600">Peran akun sendiri tidak bisa diubah di sini.</p>}
      </fieldset>
      <fieldset>
        <legend className="mb-1.5 text-sm font-semibold text-gray-800">Brand yang boleh dikelola</legend>
        <div className="flex flex-wrap gap-2">
          {brands.map((b) => (
            <label key={b.id} className="flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm">
              <input type="checkbox" name="brandIds" value={b.id} defaultChecked={defaults?.brandIds.includes(b.id)} className="h-[18px] w-[18px] accent-[#45593c]" />
              {b.name}
            </label>
          ))}
        </div>
        <p className="mt-1 text-xs text-gray-600">Diabaikan untuk Super Admin (otomatis semua brand).</p>
      </fieldset>
      <TextField
        label={isNew ? "Kata sandi awal" : "Atur ulang kata sandi"}
        name="password"
        type="password"
        required={isNew}
        minLength={8}
        autoComplete="new-password"
        id={`sandi-${key}`}
        hint={isNew ? "Minimal 8 karakter." : "Kosongkan bila tidak diganti. Minimal 8 karakter."}
      />
    </ActionForm>
  );
}
