"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Ikon garis 20px (stroke = currentColor) untuk menu utama.
const ICONS: Record<string, React.ReactNode> = {
  dashboard: <path d="M3 13h7V3H3zm11 8h7V11h-7zM3 21h7v-5H3zm11-13h7V3h-7z" />,
  brand: <path d="M4 7h16M4 7l1.5 12h13L20 7M4 7l2-4h12l2 4M9 11v4m6-4v4" />,
  seo: <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm9 17-4-4M8 11l2 2 4-4" />,
  domain: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9z" />
    </>
  ),
  account: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7 7 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z" />
    </>
  ),
};

const ITEMS = [
  { href: "/admin", label: "Ringkasan", icon: "dashboard", exact: true },
  { href: "/admin/brands", label: "Brand & Outlet", icon: "brand" },
  { href: "/admin/seo", label: "Performa SEO", icon: "seo" },
  { href: "/admin/domains", label: "Domain & SSL", icon: "domain" },
  { href: "/admin/settings", label: "Akun & Akses", icon: "account" },
];

/** Bagian per brand. Kunci dipakai juga oleh `mutedBrandTabs` (lib/template-features). */
const BRAND_SECTIONS = [
  { key: "info", path: "", label: "Profil Brand" },
  { key: "pages", path: "/pages", label: "Isi Halaman" },
  { key: "menu", path: "/menu", label: "Daftar Menu" },
  { key: "gallery", path: "/gallery", label: "Galeri Foto" },
  { key: "promos", path: "/promos", label: "Promo & Event" },
  { key: "branches", path: "/branches", label: "Lokasi & Jam Buka" },
];

const BRAND_RE = /^\/admin\/brands\/([^/]+)/;

/** Judul bagian brand yang sedang dibuka (dipakai header brand). */
export function brandSectionLabel(pathname: string, brandId: string): string {
  const base = `/admin/brands/${brandId}`;
  const hit = [...BRAND_SECTIONS].reverse().find((s) => (s.path ? pathname.startsWith(base + s.path) : pathname === base));
  return hit?.label ?? "Profil Brand";
}

function isActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Menu utama di panel hitam (sidebar desktop & drawer HP). `muted` = bagian brand yang tidak dipakai template, per id brand.
 * `canDomains` = peran boleh membuka Domain & SSL (Super Admin).
 */
export default function AdminNav({ muted = {}, canDomains = true }: { muted?: Record<string, string[]>; canDomains?: boolean }) {
  const pathname = usePathname();
  const m = pathname.match(BRAND_RE);
  const brandId = m && m[1] !== "new" ? m[1] : null;

  return (
    <nav aria-label="Menu admin" className="flex flex-col gap-1.5">
      {ITEMS.filter((item) => canDomains || item.icon !== "domain").map((item) => {
        const active = isActive(pathname, item.href, item.exact);
        return (
          <div key={item.href}>
            <Link
              href={item.href}
              aria-current={active && !(brandId && item.icon === "brand") ? "page" : active ? "true" : undefined}
              className={`flex items-center gap-3 rounded-full px-3.5 py-3 text-[15px] transition-colors ${
                active ? "bg-[#a6d27a] font-bold text-[#141414]" : "font-semibold text-[#c9ccc2] hover:bg-white/5 hover:text-white"
              }`}
            >
              <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                {ICONS[item.icon]}
              </svg>
              {item.label}
            </Link>
            {item.icon === "brand" && brandId && (
              <div className="mt-1 flex flex-col gap-0.5 pl-[46px]">
                {BRAND_SECTIONS.map((s) => {
                  const href = `/admin/brands/${brandId}${s.path}`;
                  const on = s.path ? pathname.startsWith(href) : pathname === href;
                  const off = muted[brandId]?.includes(s.key);
                  return (
                    <Link
                      key={s.key}
                      href={href}
                      aria-current={on ? "page" : undefined}
                      title={off ? "Tidak dipakai template brand ini" : undefined}
                      className={`rounded-full px-3 py-[7px] text-sm transition-colors ${
                        on ? "bg-[#2a2a2a] font-bold text-[#f4f3ea]" : off ? "text-[#7d8079] hover:text-[#c9ccc2]" : "text-[#c9ccc2] hover:text-white"
                      }`}
                    >
                      {s.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

/** Tab pil per brand untuk layar < 1024px (di desktop bagian brand ada di sidebar). */
export function BrandTabs({ brandId, muted = [] }: { brandId: string; muted?: string[] }) {
  const pathname = usePathname();
  const base = `/admin/brands/${brandId}`;
  return (
    <nav aria-label="Bagian brand" className="adm-scroll-x -mx-3 flex gap-1.5 overflow-x-auto px-3 sm:-mx-4 sm:px-4 lg:hidden">
      {BRAND_SECTIONS.map((s) => {
        const href = base + s.path;
        const active = s.path ? pathname.startsWith(href) : pathname === href;
        const off = muted.includes(s.key);
        return (
          <Link
            key={s.key}
            href={href}
            aria-current={active ? "page" : undefined}
            title={off ? "Tidak dipakai template brand ini" : undefined}
            className={`shrink-0 rounded-full border px-3.5 py-2 text-sm ${
              active ? "border-[#141414] bg-[#141414] font-bold" : off ? "border-white/20 text-[#d4dcc8]/70" : "border-[rgba(244,243,234,0.45)]"
            }`}
          >
            {s.label}
          </Link>
        );
      })}
    </nav>
  );
}
