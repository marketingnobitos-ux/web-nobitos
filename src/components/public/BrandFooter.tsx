import Link from "next/link";
import type { Brand } from "@prisma/client";
import { NAV_ITEMS } from "@/components/public/nav";
import { getSections } from "@/lib/content";
import { slugify, whatsappUrl } from "@/lib/format";
import { prisma } from "@/lib/prisma";

type Social = { label: string; url: string };

/** Baris "Instagram | https://..." dari admin -> link; hanya URL http(s) yang dipakai. */
function parseSocial(items: string[] | undefined): Social[] {
  return (items ?? []).flatMap((line) => {
    const [a, b] = line.split("|").map((s) => s.trim());
    const url = b ?? a;
    if (!/^https?:\/\//i.test(url)) return [];
    try {
      const label = b ? a : new URL(url).hostname.replace(/^www\./, "");
      return [{ label, url }];
    } catch {
      return [];
    }
  });
}

/** "16.00 - 23.00 setiap hari" -> "16.00–23.00". */
function shortHours(openHours: string | null): string | null {
  const m = openHours?.match(/(\d{1,2}[.:]\d{2})\s*[-–]\s*(\d{1,2}[.:]\d{2})/);
  return m ? `${m[1]}–${m[2]}` : openHours;
}

/** Footer: nama brand, navigasi, daftar cabang + jam buka + WhatsApp, sosial media, copyright. */
export default async function BrandFooter({ brand }: { brand: Brand }) {
  const [branches, site] = await Promise.all([
    prisma.branch.findMany({
      where: { brandId: brand.id },
      orderBy: { order: "asc" },
      take: 6,
      select: { id: true, name: true, openHours: true, whatsapp: true },
    }),
    getSections(brand.id, "site"),
  ]);
  const social = parseSocial(site.find((s) => s.key === "social")?.data.items);
  const heading = "mb-4 text-sm font-semibold text-paper/50";

  return (
    <footer className="bg-ink-deep text-paper">
      <div className="mx-auto max-w-[1400px] px-4 pt-16 sm:px-6 md:pt-24">
        {/* Satu baris: clamp(48px, 8vw, 140px), diperkecil lagi kalau nama terlalu panjang untuk layar. */}
        <Link
          href="/"
          className="display block whitespace-nowrap leading-none"
          style={{ fontSize: `min(clamp(48px, 8vw, 140px), calc((100vw - 2rem) / ${(brand.name.length * 0.56).toFixed(2)}))` }}
        >
          {brand.name}
        </Link>
        {brand.tagline && <p className="mt-4 max-w-lg text-lg text-paper/70">{brand.tagline}</p>}

        <div className="mt-14 grid gap-10 border-t border-paper/15 pt-10 sm:grid-cols-2 lg:grid-cols-[1fr_2fr_1fr]">
          <nav aria-label="Navigasi footer">
            <p className={heading}>Jelajahi</p>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-paper/70">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {branches.length > 0 && (
            <div className="sm:col-span-2 lg:col-span-1">
              <p className={heading}>Cabang & jam buka</p>
              <ul className="divide-y divide-paper/10">
                {branches.map((b) => (
                  <li key={b.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2.5 first:pt-0">
                    <span className="font-semibold">{b.name.replace(/\s+-\s+/, " — ")}</span>
                    <span className="flex items-baseline gap-4 text-sm text-paper/70">
                      {b.openHours && <span className="tabular-nums">{shortHours(b.openHours)}</span>}
                      {b.whatsapp && (
                        <a
                          href={whatsappUrl(b.whatsapp, `Halo ${brand.name} ${b.name}, mau tanya dong.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-track={`footer-wa-${slugify(b.name)}`}
                          className="font-semibold text-paper underline-offset-4 hover:underline"
                        >
                          WhatsApp
                        </a>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <Link href="/cabang" className="mt-4 inline-flex text-sm font-semibold underline-offset-4 hover:underline">
                Lihat semua cabang →
              </Link>
            </div>
          )}

          {social.length > 0 && (
            <div>
              <p className={heading}>Ikuti kami</p>
              <ul className="space-y-2">
                {social.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" data-track={`footer-sosmed-${slugify(s.label)}`} className="transition-colors hover:text-paper/70">
                      {s.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-[1400px] flex-wrap justify-between gap-2 border-t border-paper/10 px-4 py-6 text-xs text-paper/55 sm:px-6">
        <p>
          © {new Date().getFullYear()} {brand.name}. Semua hak dilindungi.
        </p>
        <p>Bagian dari keluarga Nobitos · Cirebon</p>
      </div>
    </footer>
  );
}
