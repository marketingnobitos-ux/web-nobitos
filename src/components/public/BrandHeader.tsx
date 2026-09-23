import Link from "next/link";
import type { Brand } from "@prisma/client";

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/menu", label: "Menu" },
  { href: "/galeri", label: "Galeri" },
  { href: "/cerita", label: "Cerita" },
  { href: "/cabang", label: "Cabang" },
];

export default function BrandHeader({ brand }: { brand: Brand }) {
  return (
    <header className="bg-primary text-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold">
          {brand.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={brand.logoUrl} alt={brand.name} className="h-8 w-auto" />
          ) : (
            brand.name
          )}
        </Link>
        <nav className="flex flex-wrap gap-4 text-sm">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:underline">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
