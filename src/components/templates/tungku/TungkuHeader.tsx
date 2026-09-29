"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";
import { InstagramIcon, TUNGKU_NAV, TikTokIcon, WRAP, Wordmark } from "@/components/templates/tungku/shared";
import { trackName } from "@/lib/track";

type Props = {
  brandName: string;
  instagramUrl: string | null;
  tiktokUrl: string | null;
};

/**
 * Header menempel, marun solid: ikon Instagram di kiri, logo di tengah, hamburger di kanan.
 * Hamburger membuka menu layar penuh (Beranda, Cerita, Menu, Cabang). Escape / tombol tutup / pindah halaman menutupnya.
 */
export default function TungkuHeader({ brandName, instagramUrl, tiktokUrl }: Props) {
  const pathname = usePathname().replace(/^\/preview\/[^/]+/, "") || "/";
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  // Menu terbuka: kunci scroll halaman (termasuk Lenis), fokus ke link pertama, Escape menutup.
  useEffect(() => {
    if (!open) return;
    const lenis = (window as { __lenis?: Lenis }).__lenis;
    const root = document.documentElement;
    const toggle = toggleRef.current;
    root.style.overflow = "hidden";
    lenis?.stop();
    firstLinkRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      lenis?.start();
      window.removeEventListener("keydown", onKey);
      toggle?.focus();
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 bg-brand text-paper">
      <div className={`${WRAP} grid h-16 grid-cols-[48px_1fr_48px] items-center`}>
        {instagramUrl ? (
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            data-track={trackName("ig")}
            className="-ml-3 flex h-12 w-12 items-center justify-center transition-opacity hover:opacity-70"
          >
            <InstagramIcon />
          </a>
        ) : (
          <span />
        )}
        <Link href="/" aria-label={`${brandName}, ke Beranda`} className="justify-self-center">
          <Wordmark />
        </Link>
        <button
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls="tk-menu"
          aria-label="Buka menu navigasi"
          onClick={() => setOpen(true)}
          className="-mr-3 flex h-12 w-12 flex-col items-center justify-center gap-[6px] justify-self-end transition-opacity hover:opacity-70"
        >
          <span aria-hidden className="block h-px w-6 bg-current" />
          <span aria-hidden className="block h-px w-6 bg-current" />
          <span aria-hidden className="block h-px w-6 bg-current" />
        </button>
      </div>

      {open && (
        <div id="tk-menu" role="dialog" aria-modal="true" aria-label="Menu navigasi" data-lenis-prevent className="tk-menu fixed inset-0 z-50 flex flex-col bg-paper text-ink">
          <div className="bg-brand text-paper">
            <div className={`${WRAP} grid h-16 grid-cols-[48px_1fr_48px] items-center`}>
              <span />
              <Wordmark className="justify-self-center" />
              <button
                type="button"
                aria-label="Tutup menu navigasi"
                onClick={() => setOpen(false)}
                className="relative -mr-3 h-12 w-12 justify-self-end transition-opacity hover:opacity-70"
              >
                <span aria-hidden className="absolute left-3 top-1/2 block h-px w-6 rotate-45 bg-current" />
                <span aria-hidden className="absolute left-3 top-1/2 block h-px w-6 -rotate-45 bg-current" />
              </button>
            </div>
          </div>

          <nav aria-label="Navigasi utama" className="flex flex-1 items-center justify-center overflow-y-auto py-10">
            <ul className="flex flex-col items-center gap-7 md:gap-9">
              {TUNGKU_NAV.map((item, i) => (
                <li key={item.href} className="tk-menu-item" style={{ "--i": i } as React.CSSProperties}>
                  <Link
                    ref={i === 0 ? firstLinkRef : undefined}
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={`tk-caps text-[clamp(26px,5vw,44px)] transition-colors hover:text-brand ${isActive(item.href) ? "text-brand" : ""}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {(instagramUrl || tiktokUrl) && (
            <div className="flex justify-center gap-8 pb-10 text-sm">
              {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" data-track={trackName("ig")} className="flex items-center gap-2 hover:text-brand">
                  <InstagramIcon /> Instagram
                </a>
              )}
              {tiktokUrl && (
                <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" data-track={trackName("tiktok")} className="flex items-center gap-2 hover:text-brand">
                  <TikTokIcon /> TikTok
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
