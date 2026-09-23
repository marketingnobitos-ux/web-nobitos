"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { NAV_ITEMS } from "@/components/public/nav";

type Props = { brandName: string; logoUrl: string | null };

/** Header: bar gelap dengan logo di tengah + baris navigasi; sembunyi saat scroll turun. */
export default function BrandHeader({ brandName, logoUrl }: Props) {
  const pathname = usePathname().replace(/^\/preview\/[^/]+/, "") || "/";
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 160 && y > lastY);
      lastY = y;
    };
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

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-transform duration-300 ${hidden && !open ? "-translate-y-full" : ""}`}
      >
        <div className="bg-deep text-white">
          <div className="mx-auto grid h-16 max-w-6xl grid-cols-[3rem_1fr_3rem] items-center px-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Buka menu"
              aria-expanded={open}
              className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10 md:invisible"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            </button>
            <Link href="/" className="mx-auto flex items-center justify-center font-display text-lg font-extrabold tracking-tight">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt={brandName} className="h-9 w-auto" />
              ) : (
                <span className="truncate">{brandName}</span>
              )}
            </Link>
            <Link
              href="/cabang"
              aria-label="Cabang terdekat"
              data-track="header-cabang"
              className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M12 21s-7-6.2-7-11.5a7 7 0 1114 0C19 14.8 12 21 12 21z" strokeLinejoin="round" />
                <circle cx="12" cy="9.5" r="2.5" />
              </svg>
            </Link>
          </div>
        </div>
        <nav aria-label="Navigasi utama" className="hidden border-b border-ink/10 bg-paper/95 backdrop-blur md:block">
          <ul className="mx-auto flex max-w-6xl justify-center gap-10 px-5">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`relative block py-3.5 text-sm font-semibold transition ${isActive(item.href) ? "text-primary" : "text-ink/75 hover:text-ink"}`}
                >
                  {item.label}
                  {isActive(item.href) && <m.span layoutId="nav-underline" className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-primary" />}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <m.div
            key="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-50 flex flex-col bg-deep text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex h-16 items-center justify-between px-3">
              <span className="px-2 font-display font-extrabold">{brandName}</span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Tutup menu" className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <ul className="flex flex-1 flex-col justify-center gap-2 px-8">
              {NAV_ITEMS.map((item, i) => (
                <m.li
                  key={item.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.06, duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`block py-2 font-display text-4xl font-extrabold tracking-tight ${isActive(item.href) ? "text-white" : "text-white/60"}`}
                  >
                    {item.label}
                  </Link>
                </m.li>
              ))}
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
