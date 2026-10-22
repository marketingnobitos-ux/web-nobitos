"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Ikon garis 20px (stroke = currentColor) untuk menu utama.
const ICONS: Record<string, React.ReactNode> = {
  dashboard: <path d="M3 13h7V3H3zm11 8h7V11h-7zM3 21h7v-5H3zm11-13h7V3h-7z" />,
  brand: <path d="M4 7h16M4 7l1.5 12h13L20 7M4 7l2-4h12l2 4M9 11v4m6-4v4" />,
  seo: <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm9 17-4-4M8 11l2 2 4-4" />,
  domain: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9z" />,
  settings: <path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm8 3-2 1 .5 2.2-2 1.2-1.7-1.5-1.8.9-.5 2.2h-2.3l-.5-2.2-1.8-.9-1.7 1.5-2-1.2L6 13l-2-1 2-1-.5-2.2 2-1.2 1.7 1.5 1.8-.9.5-2.2h2.3l.5 2.2 1.8.9 1.7-1.5 2 1.2L18 11z" />,
};

const ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "dashboard", exact: true },
  { href: "/admin/brands", label: "Brand", icon: "brand" },
  { href: "/admin/seo", label: "Kesehatan SEO", icon: "seo" },
  { href: "/admin/domains", label: "Domain", icon: "domain" },
  { href: "/admin/settings", label: "Pengaturan", icon: "settings" },
];

/** Menu utama. `bar` = baris geser di bar atas HP; tanpa itu = daftar di sidebar desktop. */
export default function AdminNav({ bar = false }: { bar?: boolean }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Menu admin" className={bar ? "flex gap-1 overflow-x-auto px-3 pb-2 [scrollbar-width:none]" : "flex flex-col gap-1"}>
      {ITEMS.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex shrink-0 items-center gap-2 rounded-md text-sm transition-colors ${bar ? "px-3 py-1.5" : "px-3 py-2"} ${
              active ? "bg-white/15 font-semibold text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <svg viewBox="0 0 24 24" aria-hidden className={`shrink-0 ${bar ? "h-4 w-4" : "h-5 w-5"}`} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
              {ICONS[item.icon]}
            </svg>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Tab navigasi per brand (Info, Konten, Menu, ...). `muted` = tab yang tidak dipakai template brand ini. */
export function BrandTabs({ brandId, muted = [] }: { brandId: string; muted?: string[] }) {
  const pathname = usePathname();
  const base = `/admin/brands/${brandId}`;
  const tabs = [
    { key: "info", href: base, label: "Info Brand", exact: true },
    { key: "pages", href: `${base}/pages`, label: "Konten Halaman" },
    { key: "menu", href: `${base}/menu`, label: "Menu" },
    { key: "gallery", href: `${base}/gallery`, label: "Galeri" },
    { key: "promos", href: `${base}/promos`, label: "Promo" },
    { key: "branches", href: `${base}/branches`, label: "Cabang" },
  ];
  return (
    <nav aria-label="Bagian brand" className="-mx-4 flex gap-1 overflow-x-auto border-b border-gray-200 px-4 [scrollbar-width:none] lg:mx-0 lg:px-0">
      {tabs.map((t) => {
        const active = t.exact ? pathname === t.href : pathname.startsWith(t.href);
        const off = muted.includes(t.key);
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            title={off ? "Tidak dipakai template brand ini" : undefined}
            className={`shrink-0 border-b-2 px-3 py-2 text-sm transition-colors ${
              active ? "border-gray-900 font-semibold text-gray-900" : "border-transparent hover:text-gray-900"
            } ${!active && off ? "text-gray-400" : !active ? "text-gray-600" : ""}`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
