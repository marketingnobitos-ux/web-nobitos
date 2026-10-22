"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowIcon, DADAK_NAV } from "@/components/templates/dadak/shared";
import { AMINOTO } from "@/data/brands/aminoto";
import { trackName } from "@/lib/track";

/**
 * Bar navigasi gelap yang melayang di atas foto hero (semua halaman Dadak dibuka dengan hero foto):
 * logo, tautan, tombol stabilo "Lihat menu". Di HP tautan pindah ke panel buka-tutup.
 */
export default function DadakHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="absolute inset-x-0 top-0 z-40 px-4 pt-4 text-[var(--dk-cream)] sm:px-6">
      <div className="mx-auto w-full max-w-[1000px] border border-white/15 bg-[rgb(10_34_25/0.72)] backdrop-blur-md">
        <div className="flex items-center justify-between gap-4 py-2 pl-4 pr-2">
          <Link href="/" aria-label={`${AMINOTO.shortName} — Beranda`} className="dk-display text-[26px] leading-none tracking-wide">
            {AMINOTO.shortName}
          </Link>

          <nav aria-label="Navigasi utama" className="hidden items-center gap-7 md:flex">
            {DADAK_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`dk-caps text-[13px] font-medium transition-colors ${isActive(item.href) ? "text-accent" : "text-white/80 hover:text-white"}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/menu" data-track={trackName("menu")} className="dk-btn dk-btn-lime !px-4 !py-2.5 !text-xs">
              Lihat menu <ArrowIcon className="hidden h-3 w-4 sm:block" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="dk-menu"
              aria-label={open ? "Tutup navigasi" : "Buka navigasi"}
              className="grid h-10 w-10 place-items-center border border-white/25 md:hidden"
            >
              <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <nav id="dk-menu" aria-label="Navigasi utama" className="grid border-t border-white/15 md:hidden">
            {[...DADAK_NAV, { href: "/menu", label: "Menu" }].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`dk-display border-b border-white/10 px-4 py-4 text-3xl last:border-0 ${isActive(item.href) ? "text-accent" : ""}`}
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
