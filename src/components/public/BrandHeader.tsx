import Link from "next/link";
import type { Brand } from "@prisma/client";

export const NAV_ITEMS = [
  { href: "/", label: "Beranda" },
  { href: "/menu", label: "Menu" },
  { href: "/galeri", label: "Galeri" },
  { href: "/cerita", label: "Cerita" },
  { href: "/cabang", label: "Cabang" },
];

export default function BrandHeader({ brand }: { brand: Brand }) {
  return (
    <header className="sticky top-0 z-40 bg-primary text-white shadow">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          {brand.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={brand.logoUrl} alt={brand.name} className="h-9 w-auto" />
          ) : (
            brand.name
          )}
        </Link>
        <nav className="-mx-4 flex gap-5 overflow-x-auto px-4 text-sm sm:mx-0 sm:px-0">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="shrink-0 py-1 hover:underline">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
