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
  const label = "mb-6 text-sm leading-none text-paper/50";

  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-20 sm:px-8 md:px-12 md:pt-28">
        {/*
          HP: brand, lalu Navigasi + Sosial berdampingan, lalu Kontak.
          Tablet: brand di atas, tiga kolom sama lebar.
          Desktop: brand mengisi sisa ruang; tiga kolom merapat ke kanan dengan jarak antarkolom yang sama.
        */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-14 md:grid-cols-3 md:gap-x-12 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto] lg:gap-x-20 xl:gap-x-28">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="ed-title block text-[clamp(28px,3vw,40px)] leading-none">
              {brand.name}
            </Link>
            {brand.tagline && <p className="mt-4 max-w-xs text-paper/65">{brand.tagline}</p>}
          </div>

          <nav aria-label="Navigasi footer">
            <p className={label}>Navigasi</p>
            <ul className="space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="ed-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="order-last col-span-2 md:order-none md:col-span-1">
            <p className={label}>Kontak</p>
            <ul className="space-y-7">
              {branches.map((b) => (
                <li key={b.id}>
                  <p className="font-medium leading-snug">{branchLabel(b.name)}</p>
                  <p className="mt-1 text-sm text-paper/65">{b.address}</p>
                  {b.openHours && <p className="text-sm tabular-nums text-paper/65">{shortHours(b.openHours)}</p>}
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
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

          <div>
            <p className={label}>Sosial</p>
            {social.length > 0 ? (
              <ul className="space-y-3">
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

        <div className="mt-20 flex flex-wrap justify-between gap-2 border-t md:mt-24 border-paper/15 pt-6 text-xs text-paper/50">
          <p>
            © {new Date().getFullYear()} {brand.name}
          </p>
          <p>Bagian dari keluarga Nobitos · Cirebon</p>
        </div>
      </div>
    </footer>
  );
}
