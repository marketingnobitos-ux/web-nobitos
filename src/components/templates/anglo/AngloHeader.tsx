"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ANGLO_NAV, WRAP } from "@/components/templates/anglo/shared";

/** Nav tipis abu gelap (brief 6.3): nama brand spidol, link mesin ketik kapital MENU · CERITA · CABANG. */
export default function AngloHeader({ brandName }: { brandName: string }) {
  const pathname = usePathname().replace(/^\/preview\/[^/]+/, "") || "/";

  return (
    <header className="sticky top-0 z-40 bg-nav text-sheet">
      <div className={`${WRAP} flex h-14 items-center justify-between gap-4 md:h-16`}>
        <Link href="/" className="ag-marker whitespace-nowrap text-[1.05rem] sm:text-2xl">
          {brandName}
        </Link>
        <nav aria-label="Navigasi utama">
          <ul className="flex items-center font-mono text-[0.66rem] font-bold uppercase tracking-wide sm:text-xs sm:tracking-wider md:text-[0.8rem]">
            {ANGLO_NAV.map((item, i) => {
              const active = pathname.startsWith(item.href);
              return (
                <li key={item.href} className="flex items-center">
                  {i > 0 && (
                    <span aria-hidden className="px-1 text-sheet/40 sm:px-3">
                      ·
                    </span>
                  )}
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`transition-colors hover:text-accent ${active ? "text-accent" : ""}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
