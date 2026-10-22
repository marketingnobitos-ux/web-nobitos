"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/** Bar atas HP (< 1024px) + tombol yang membuka menu samping (drawer). `children` = isi panel hitam. */
export default function MobileDrawer({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <div className="adm-dark sticky top-3 z-30 flex items-center gap-2.5 rounded-3xl py-2 pl-3.5 pr-2">
        <Link href="/admin" className="flex flex-1 items-center gap-2.5">
          <Logo size={34} />
          <span className="text-base font-extrabold">Nobitos Admin</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Buka menu samping"
          aria-expanded={open}
          aria-controls="adm-drawer"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2a2a2a]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden>
            <path d="M4 7h16M4 12h16M4 17h10" />
          </svg>
        </button>
      </div>

      <div id="adm-drawer" className="adm-drawer fixed inset-0 z-50" data-open={open} aria-hidden={!open} inert={!open}>
        <div className="adm-drawer-scrim absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu admin"
          className="adm-drawer-panel adm-dark absolute inset-y-2 left-2 flex w-[min(300px,calc(100vw-48px))] flex-col gap-6 overflow-y-auto rounded-[28px] px-4 py-5"
        >
          <div className="flex items-center justify-between gap-2 px-2">
            <span className="flex items-center gap-3">
              <Logo size={40} />
              <span className="text-lg font-extrabold tracking-tight">Nobitos Admin</span>
            </span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Tutup menu" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#3a3a3a]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

/** Logo bulat "nb" hijau muda. */
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-full bg-[#a6d27a] font-extrabold text-[#141414]"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
    >
      nb
    </span>
  );
}
