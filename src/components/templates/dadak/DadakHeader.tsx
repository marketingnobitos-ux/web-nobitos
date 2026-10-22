"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DADAK_NAV, WRAP, Wordmark } from "@/components/templates/dadak/shared";
import { AMINOTO } from "@/data/brands/aminoto";
import { trackName } from "@/lib/track";

/** Header kaca melayang: nama brand, navigasi, tombol "Cari cabang". Di HP navigasi jadi panel buka-tutup. */
export default function DadakHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 pt-3 md:pt-4">
      <div className={WRAP}>
        <div className="dk-glass flex items-center justify-between gap-4 !rounded-full py-2 pl-5 pr-2 text-ink">
          <Link href="/" aria-label={`${AMINOTO.shortName} — Beranda`}>
            <Wordmark name={AMINOTO.shortName} kicker={AMINOTO.kicker} />
          </Link>

          <nav aria-label="Navigasi utama" className="hidden items-center gap-1 md:flex">
            {DADAK_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${
                  isActive(item.href) ? "bg-ink text-white" : "hover:bg-white/80"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/cabang" data-track={trackName("cabang")} className="dk-btn dk-btn-lime hidden !py-2.5 !pr-5 sm:inline-flex">
              Cari cabang
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="dk-menu"
              aria-label={open ? "Tutup menu" : "Buka menu"}
              className="grid h-11 w-11 place-items-center rounded-full bg-ink text-white md:hidden"
            >
              <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <nav id="dk-menu" aria-label="Navigasi utama" className="dk-glass mt-2 grid gap-1 p-3 text-ink md:hidden">
            {DADAK_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`rounded-2xl px-4 py-3 text-lg font-medium ${isActive(item.href) ? "bg-ink text-white" : "hover:bg-white/80"}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
