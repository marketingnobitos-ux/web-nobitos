import { Logo } from "@/components/admin/MobileDrawer";
import { prisma } from "@/lib/prisma";
import LoginForm from "./LoginForm";

export const metadata = { title: "Masuk" };

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const { callbackUrl } = await searchParams;
  const brands = await prisma.brand.findMany({
    where: { isPublished: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, colorPrimary: true },
  });

  return (
    <div className="flex min-h-screen flex-wrap gap-6 p-3 sm:p-5">
      <section className="adm-dark flex min-h-[300px] min-w-0 flex-[1_1_420px] flex-col justify-between gap-10 rounded-[32px] p-7 sm:p-12 lg:min-h-[calc(100vh-40px)]">
        <div className="flex items-center gap-3">
          <Logo size={48} />
          <span className="text-xl font-extrabold tracking-tight">Nobitos Admin</span>
        </div>
        <div>
          <h1 className="text-[44px] font-bold leading-none tracking-[-0.035em] sm:text-[64px]">Satu panel untuk semua brand.</h1>
          <p className="mt-5 max-w-[460px] text-[17px] leading-relaxed text-[#c9ccc2]">
            Kelola menu, lokasi, jam buka, dan pantau pengunjung situs setiap brand Nobitos dari satu tempat.
          </p>
        </div>
        {brands.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="Brand Nobitos">
            {brands.map((b) => (
              <li key={b.id} className="flex items-center gap-2 rounded-full border border-[#3a3a3a] px-3.5 py-2 text-sm">
                <span className="h-2.5 w-2.5 rounded-full ring-1 ring-white/50" style={{ background: b.colorPrimary }} aria-hidden />
                {b.name}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex min-w-0 flex-[1_1_420px] items-center justify-center py-6 sm:p-6">
        <div className="adm-light w-full max-w-[440px] rounded-[32px] bg-[#eef0e2] p-7 sm:p-10">
          <h2 className="text-[34px] font-bold tracking-[-0.03em]">Masuk</h2>
          <p className="mb-5 mt-1.5 text-[15px] text-[#5b6157]">Untuk admin dan staf Nobitos. Menu yang tampil mengikuti hak akses akun Anda.</p>
          <LoginForm callbackUrl={callbackUrl ?? "/admin"} />
          <p role="note" className="mt-[18px] rounded-2xl bg-[#e3e6d4] px-3.5 py-3 text-[13px] leading-normal text-[#3a3f36]">
            Lupa kata sandi? Hubungi administrator untuk mengatur ulang akses akun Anda.
          </p>
        </div>
      </section>
    </div>
  );
}
