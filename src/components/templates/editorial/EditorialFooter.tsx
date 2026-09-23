import Link from "next/link";
import type { Brand } from "@prisma/client";
import { NAV_ITEMS } from "@/components/public/nav";
import EdLink from "@/components/templates/editorial/EdLink";
import { getSections } from "@/lib/content";
import { mapsLink, slugify, telUrl, whatsappUrl } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { branchLabel, parseSocial, shortHours } from "@/lib/site";

/** Footer Editorial terstruktur: navigasi, kontak per toko, sosial, copyright. */
export default async function EditorialFooter({ brand }: { brand: Brand }) {
  const [branches, site] = await Promise.all([
    prisma.branch.findMany({
      where: { brandId: brand.id },
      orderBy: { order: "asc" },
      take: 4,
      select: { id: true, name: true, address: true, mapsUrl: true, lat: true, lng: true, openHours: true, whatsapp: true, phone: true },
    }),
    getSections(brand.id, "site"),
  ]);
  const social = parseSocial(site.find((s) => s.key === "social")?.data.items);
  const label = "mb-5 text-sm text-paper/50";

  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-20 sm:px-8 md:px-12 md:pt-28">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link href="/" className="ed-title block text-[clamp(28px,3vw,40px)]">
              {brand.name}
            </Link>
            {brand.tagline && <p className="mt-4 max-w-xs text-paper/65">{brand.tagline}</p>}
          </div>

          <nav aria-label="Navigasi footer" className="md:col-span-2">
            <p className={label}>Navigasi</p>
            <ul className="space-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="ed-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <p className={label}>Kontak</p>
            <ul className="space-y-6">
              {branches.map((b) => (
                <li key={b.id}>
                  <p className="font-medium">{branchLabel(b.name)}</p>
                  <p className="mt-1 text-sm text-paper/65">{b.address}</p>
                  {b.openHours && <p className="text-sm tabular-nums text-paper/65">{shortHours(b.openHours)}</p>}
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                    <EdLink href={mapsLink(b)} external track={`footer-maps-${slugify(b.name)}`}>
                      Maps
                    </EdLink>
                    {b.whatsapp && (
                      <EdLink
                        href={whatsappUrl(b.whatsapp, `Halo ${brand.name} ${b.name}, mau pesan.`)}
                        external
                        track={`footer-wa-${slugify(b.name)}`}
                      >
                        WhatsApp
                      </EdLink>
                    )}
                    {b.phone && (
                      <a href={telUrl(b.phone)} className="ed-link">
                        Telepon
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className={label}>Sosial</p>
            {social.length > 0 ? (
              <ul className="space-y-2.5">
                {social.map((s) => (
                  <li key={s.url}>
                    <EdLink href={s.url} external track={`footer-sosmed-${slugify(s.label)}`}>
                      {s.label}
                    </EdLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-paper/50">Segera hadir.</p>
            )}
          </div>
        </div>

        <div className="mt-20 flex flex-wrap justify-between gap-2 border-t border-paper/15 pt-6 text-xs text-paper/50">
          <p>
            © {new Date().getFullYear()} {brand.name}
          </p>
          <p>Bagian dari keluarga Nobitos · Cirebon</p>
        </div>
      </div>
    </footer>
  );
}
