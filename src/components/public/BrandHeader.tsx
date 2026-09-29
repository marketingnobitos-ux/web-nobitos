"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { NAV_ITEMS } from "@/components/public/nav";
import { trackName } from "@/lib/track";

type Props = { brandName: string; logoUrl: string | null };

/**
 * Header: di Beranda transparan di atas foto hero, jadi gelap setelah scroll.
 * Halaman lain selalu gelap. Sembunyi saat scroll turun, muncul lagi saat naik.
 */
export default function BrandHeader({ brandName, logoUrl }: Props) {
  const pathname = usePathname().replace(/^\/preview\/[^/]+/, "") || "/";
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 200 && y > lastY);
      setScrolled(y > 40);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const solid = !isHome || scrolled;

  return (
    <>
      <header
        className={`${isHome ? "fixed" : "sticky"} inset-x-0 top-0 z-40 text-paper transition-[transform,background-color] duration-500 ${
          solid ? "bg-ink" : "bg-transparent"
        } ${hidden && !open ? "-translate-y-full" : ""}`}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-4 sm:px-6 md:h-20">
          <Link href="/" className="display shrink-0 text-xl leading-none md:text-2xl" aria-label={`${brandName} — Beranda`}>
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt={brandName} className="h-10 w-auto" />
            ) : (
              brandName
            )}
          </Link>

          <nav aria-label="Navigasi utama" className="hidden md:block">
            <ul className="flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`relative block py-2 text-[0.95rem] font-medium transition-opacity ${
                      isActive(item.href) ? "opacity-100" : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    {item.label}
                    {isActive(item.href) && (
                      <m.span layoutId="nav-underline" className="absolute inset-x-0 -bottom-0.5 h-[3px] rounded-full bg-accent" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/cabang"
              data-track={trackName("cabang")}
              className="hidden whitespace-nowrap rounded-full bg-paper px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-paper/85 sm:inline-flex"
            >
              Cari cabang
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Buka menu"
              aria-expanded={open}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-paper/30 transition hover:bg-paper/10 md:hidden"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M4 8h16M4 16h16" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <m.div
            key="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-50 flex flex-col bg-ink text-paper"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.7, 0, 0.2, 1] }}
          >
            <div className="flex h-16 items-center justify-between px-4">
              <span className="display text-2xl">{brandName}</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Tutup menu"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-paper/30"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <ul className="flex flex-1 flex-col justify-center px-5">
              {NAV_ITEMS.map((item, i) => (
                <li key={item.href} className="overflow-hidden border-b border-paper/10">
                  <m.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.25 + i * 0.06, duration: 0.6, ease: [0.2, 0.75, 0.15, 1] }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`display flex items-baseline justify-between py-4 text-[2.6rem] ${isActive(item.href) ? "" : "text-paper/60"}`}
                    >
                      {item.label}
                      <span className="font-sans text-sm tracking-normal opacity-50">0{i + 1}</span>
                    </Link>
                  </m.div>
                </li>
              ))}
            </ul>
            <div className="px-5 pb-8">
              <Link href="/cabang" onClick={() => setOpen(false)} className="flex h-14 items-center justify-center rounded-full bg-paper font-semibold text-ink">
                Cari cabang terdekat
              </Link>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
