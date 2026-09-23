import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import BrandSwitcher from "@/components/admin/BrandSwitcher";
import { listAccessibleBrands, requireAdmin } from "@/lib/admin";
import { logoutAction } from "./actions";

// Layout panel admin: sidebar + header dengan dropdown brand aktif.
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const brands = await listAccessibleBrands(admin);

  return (
    <div className="min-h-screen lg:flex">
      <aside className="flex flex-col gap-4 bg-gray-900 p-4 text-gray-100 lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:shrink-0">
        <Link href="/admin" className="text-lg font-bold">
          Nobitos Admin
        </Link>
        <AdminNav />
        <form action={logoutAction} className="lg:mt-auto">
          <button type="submit" className="w-full rounded-md px-3 py-2 text-left text-sm text-gray-300 hover:bg-white/10">
            Keluar
          </button>
        </form>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3 lg:px-8">
          <BrandSwitcher brands={brands} />
          <span className="truncate text-sm text-gray-600">{admin.name ?? admin.email}</span>
        </header>
        <main className="mx-auto max-w-6xl p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
