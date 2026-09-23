import Link from "next/link";
import type { Brand } from "@prisma/client";
import { NAV_ITEMS } from "@/components/public/nav";

export default function BrandFooter({ brand }: { brand: Brand }) {
  return (
    <footer className="bg-deep text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="font-display text-3xl font-extrabold tracking-tight text-white">{brand.name}</p>
          {brand.tagline && <p className="mt-3 max-w-md">{brand.tagline}</p>}
        </div>
        <nav aria-label="Navigasi footer">
          <ul className="grid grid-cols-2 gap-3 text-sm font-semibold">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-white/55">
          © {new Date().getFullYear()} {brand.name} · Bagian dari Nobitos Indonesia
        </p>
      </div>
    </footer>
  );
}
