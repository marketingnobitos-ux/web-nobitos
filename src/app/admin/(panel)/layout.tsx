import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import BrandSwitcher from "@/components/admin/BrandSwitcher";
import { ROLE_LABEL, listAccessibleBrands, requireAdmin } from "@/lib/admin";
import { logoutAction } from "./actions";

function LogoutButton({ className }: { className: string }) {
  return (
    <form action={logoutAction}>
      <button type="submit" className={className}>
        Keluar
      </button>
    </form>
  );
}

// Layout panel admin. Desktop (≥ 1024px): sidebar kiri. HP/tablet: bar atas ringkas (menu bisa digeser, "Keluar" di kanan).
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const brands = await listAccessibleBrands(admin);
  const who = admin.name ?? admin.email;

  return (
    <div className="min-h-screen lg:flex">
      <aside className="hidden bg-gray-900 p-4 text-gray-100 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-60 lg:shrink-0 lg:flex-col lg:gap-6">
        <Link href="/admin" className="px-3 pt-1 text-lg font-bold tracking-tight">
          Nobitos Admin
        </Link>
        <AdminNav />
        <div className="mt-auto border-t border-white/10 pt-4">
          <p className="truncate px-3 text-sm font-medium text-white" title={admin.email}>
            {who}
          </p>
          <p className="px-3 text-xs text-gray-400">{ROLE_LABEL[admin.role]}</p>
          <LogoutButton className="mt-2 w-full rounded-md px-3 py-2 text-left text-sm text-gray-300 hover:bg-white/10 hover:text-white" />
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="sticky top-0 z-30 bg-gray-900 text-gray-100 shadow-sm lg:hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-2">
            <Link href="/admin" className="font-bold tracking-tight">
              Nobitos Admin
            </Link>
            <LogoutButton className="rounded-md px-2 py-1 text-sm text-gray-300 hover:bg-white/10 hover:text-white" />
          </div>
          <AdminNav bar />
        </div>

        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-2.5 lg:px-8 lg:py-3">
          <BrandSwitcher brands={brands} />
          <span className="hidden truncate text-sm text-gray-600 sm:inline" title={admin.email}>
            {who}
          </span>
        </header>
        <main className="mx-auto max-w-6xl p-4 pb-16 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
