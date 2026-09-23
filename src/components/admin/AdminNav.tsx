"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/brands", label: "Brand" },
  { href: "/admin/domains", label: "Domain" },
  { href: "/admin/settings", label: "Pengaturan" },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col">
      {ITEMS.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`shrink-0 rounded-md px-3 py-2 text-sm ${active ? "bg-white/15 font-semibold text-white" : "text-gray-300 hover:bg-white/10"}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Tab navigasi per brand (Info, Konten, Menu, ...). */
export function BrandTabs({ brandId }: { brandId: string }) {
  const pathname = usePathname();
  const base = `/admin/brands/${brandId}`;
  const tabs = [
    { href: base, label: "Info Brand", exact: true },
    { href: `${base}/pages`, label: "Konten Halaman" },
    { href: `${base}/menu`, label: "Menu" },
    { href: `${base}/gallery`, label: "Galeri" },
    { href: `${base}/promos`, label: "Promo" },
    { href: `${base}/branches`, label: "Cabang" },
  ];
  return (
    <nav className="-mx-4 flex gap-1 overflow-x-auto border-b border-gray-200 px-4">
      {tabs.map((t) => {
        const active = t.exact ? pathname === t.href : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`shrink-0 border-b-2 px-3 py-2 text-sm ${active ? "border-gray-900 font-semibold text-gray-900" : "border-transparent text-gray-600 hover:text-gray-900"}`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
