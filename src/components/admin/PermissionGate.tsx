"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const CONTROLS = "form input, form select, form textarea, form button, input[type=file]";

/**
 * Kunci form di halaman brand bila peran akun tidak boleh mengubah bagian itu.
 * Profil Brand & Lokasi butuh izin "brand"; bagian lain butuh izin "content".
 * Hanya kontrol di dalam <form> yang dimatikan (filter & cari tetap jalan); server action tetap menolak sendiri.
 */
export default function PermissionGate({
  brandId,
  canContent,
  canBrand,
  children,
}: {
  brandId: string;
  canContent: boolean;
  canBrand: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const box = useRef<HTMLDivElement>(null);
  const base = `/admin/brands/${brandId}`;
  const needsBrand = pathname === base || pathname.startsWith(`${base}/branches`);
  const locked = !(needsBrand ? canBrand : canContent);

  useEffect(() => {
    const root = box.current;
    if (!locked || !root) return;
    const lock = () => root.querySelectorAll<HTMLInputElement>(CONTROLS).forEach((el) => (el.disabled = true));
    lock();
    const obs = new MutationObserver(lock);
    obs.observe(root, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, [locked, pathname]);

  return (
    <div ref={box} className="space-y-4" data-locked={locked || undefined}>
      {locked && (
        <p role="note" className="rounded-[20px] border border-[#c9ccbc] bg-[#e3e6d4] px-4 py-3 text-sm text-[#26291f]">
          <strong>Hanya lihat.</strong> Peran akun Anda tidak boleh mengubah bagian ini. Hubungi Super Admin bila perlu akses.
        </p>
      )}
      {children}
    </div>
  );
}
