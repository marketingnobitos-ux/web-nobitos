"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { NAV_ITEMS } from "@/components/public/nav";

type Props = { brandName: string; logoUrl: string | null };

/**
 * Header Editorial: tipis & tenang. Transparan di atas hero Beranda, maroon setelah scroll.
 * Di HP: tombol teks "Menu" membuka layar penuh dengan daftar link besar.
 */
export default function EditorialHeader({ brandName, logoUrl }: Props) {
  const pathname = usePathname().replace(/^\/preview\/[^/]+/, "") || "/";
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 240 && y > lastY);
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
        className={`${isHome ? "fixed" : "sticky"} inset-x-0 top-0 z-40 text-paper transition-[transform,background-color] duration-700 ${
          solid ? "bg-ink" : "bg-transparent"
        } ${hidden && !open ? "-translate-y-full" : ""}`}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8 md:h-20 md:px-12">
          <Link href="/" className="text-lg font-medium tracking-tight" aria-label={`${brandName} — Beranda`}>
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt={brandName} className="h-9 w-auto" />
            ) : (
              brandName
            )}
          </Link>

          <nav aria-label="Navigasi utama" className="hidden md:block">
            <ul className="flex items-center gap-9 text-[0.95rem]">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`ed-link ${isActive(item.href) ? "opacity-100" : "opacity-75 hover:opacity-100"}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            className="ed-link text-[0.95rem] md:hidden"
          >
            Menu
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <m.div
            key="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-50 flex flex-col bg-ink px-5 text-paper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 0.8, 0.2, 1] }}
          >
            <div className="flex h-16 items-center justify-between">
              <span className="text-lg font-medium tracking-tight">{brandName}</span>
              <button type="button" onClick={() => setOpen(false)} className="ed-link text-[0.95rem]">
                Tutup
              </button>
            </div>
            <ul className="flex flex-1 flex-col justify-center gap-1">
              {NAV_ITEMS.map((item, i) => (
                <m.li
                  key={item.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.07, duration: 0.8, ease: [0.16, 0.8, 0.2, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`ed-title block py-2 text-[2.6rem] ${isActive(item.href) ? "" : "text-paper/55"}`}
                  >
                    {isActive(item.href) ? <em>{item.label}</em> : item.label}
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
