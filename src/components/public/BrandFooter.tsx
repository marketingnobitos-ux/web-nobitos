import Link from "next/link";
import type { Brand } from "@prisma/client";
import { NAV_ITEMS } from "@/components/public/BrandHeader";

export default function BrandFooter({ brand }: { brand: Brand }) {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-gray-900">{brand.name}</p>
          {brand.tagline && <p>{brand.tagline}</p>}
          <p className="mt-1 text-xs">Bagian dari Nobitos Indonesia · © {new Date().getFullYear()}</p>
        </div>
        <nav className="flex flex-wrap gap-4">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-primary">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
