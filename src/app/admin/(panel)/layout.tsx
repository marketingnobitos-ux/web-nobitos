import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import BrandSwitcher from "@/components/admin/BrandSwitcher";
import MobileDrawer, { Logo } from "@/components/admin/MobileDrawer";
import { ROLE_LABEL, listAccessibleBrands, requireAdmin, type AdminIdentity } from "@/lib/admin";
import { mutedBrandTabs } from "@/lib/template-features";
import { logoutAction } from "./actions";

function initials(name: string) {
  const parts = name.replace(/@.*/, "").split(/[\s._-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "A";
}

/** Profil akun + tombol Keluar di bawah panel hitam. */
function ProfileCard({ admin }: { admin: AdminIdentity }) {
  const who = admin.name ?? ROLE_LABEL[admin.role];
  return (
    <div className="mt-auto flex items-center gap-3 rounded-[22px] bg-[#232323] p-3.5">
      <Link href="/admin/settings" className="flex min-w-0 flex-1 items-center gap-3" title="Akun & Akses">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef0e2] font-extrabold text-[#141414]">{initials(admin.name ?? admin.email)}</span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold">{who}</span>
          <span className="block truncate text-xs text-[#b5b8ae]" title={admin.email}>
            {admin.name ? ROLE_LABEL[admin.role] : admin.email}
          </span>
        </span>
      </Link>
      <form action={logoutAction}>
        <button
          type="submit"
          aria-label="Keluar"
          title="Keluar"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#3a3a3a] hover:border-[#f4f3ea]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10" />
          </svg>
        </button>
      </form>
    </div>
  );
}

// Layout panel admin. Desktop (≥ 1024px): panel hitam di kiri. HP/tablet: bar atas + menu samping (drawer).
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const brands = await listAccessibleBrands(admin);
  const muted = Object.fromEntries(brands.map((b) => [b.id, mutedBrandTabs(b.template)]));
  const panel = (
    <>
      <AdminNav muted={muted} />
      <ProfileCard admin={admin} />
    </>
  );

  return (
    <div className="flex min-h-screen gap-6 p-3 sm:p-4 lg:p-5">
      <aside className="adm-dark sticky top-5 hidden h-[calc(100vh-40px)] w-[248px] shrink-0 flex-col gap-7 overflow-y-auto rounded-[28px] px-4 py-6 lg:flex">
        <Link href="/admin" className="flex items-center gap-3 px-2">
          <Logo size={40} />
          <span className="text-lg font-extrabold tracking-tight">Nobitos Admin</span>
        </Link>
        {panel}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-5 lg:gap-6 lg:px-2 lg:py-3">
        <MobileDrawer>{panel}</MobileDrawer>
        <BrandSwitcher brands={brands.map(({ id, name }) => ({ id, name }))} />
        <main className="min-w-0 pb-16">{children}</main>
      </div>
    </div>
  );
}
