import Link from "next/link";
import type { Brand } from "@prisma/client";
import { DADAK_NAV, InstagramIcon, TikTokIcon, WRAP, Wordmark } from "@/components/templates/dadak/shared";
import { AMINOTO } from "@/data/brands/aminoto";
import { mapsLink, whatsappUrl } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { waMessage } from "@/lib/site";
import { branchKey, trackName } from "@/lib/track";

/** Footer kaca: nama brand, navigasi, cabang (Maps/WA kalau datanya ada), sosial media. */
export default async function DadakFooter({ brand }: { brand: Brand }) {
  const branches = await prisma.branch.findMany({
    where: { brandId: brand.id },
    orderBy: { order: "asc" },
    select: { name: true, address: true, openHours: true, whatsapp: true, mapsUrl: true, lat: true, lng: true },
  });
  const heading = "mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-ink/55";

  return (
    <footer className="pb-6 pt-10 text-ink md:pb-10">
      <div className={WRAP}>
        <div className="dk-glass grid gap-10 p-7 sm:grid-cols-2 md:p-10 lg:grid-cols-[1.3fr_0.8fr_1.6fr_0.9fr]">
          <div>
            <Link href="/" aria-label={`${brand.name}, ke Beranda`}>
              <Wordmark name={AMINOTO.shortName} kicker={AMINOTO.kicker} />
            </Link>
            {brand.tagline && <p className="mt-5 max-w-xs text-ink/75">{brand.tagline}.</p>}
          </div>

          <nav aria-label="Navigasi footer">
            <p className={heading}>Jelajahi</p>
            <ul className="space-y-2">
              {DADAK_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="underline-offset-4 hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {branches.length > 0 && (
            <div>
              <p className={heading}>Cabang · {AMINOTO.hoursShort}</p>
              <ul className="space-y-4">
                {branches.map((b) => {
                  const key = branchKey(b.name);
                  return (
                    <li key={b.name}>
                      <p className="font-semibold">{b.name}</p>
                      {b.address && <p className="mt-0.5 text-sm text-ink/70">{b.address}</p>}
                      <div className="mt-1.5 flex gap-4 text-sm font-medium">
                        {(b.mapsUrl || b.address) && (
                          <a href={mapsLink(b)} target="_blank" rel="noopener noreferrer" data-track={trackName("maps", key)} className="underline underline-offset-4 hover:text-ink/70">
                            Maps
                          </a>
                        )}
                        {b.whatsapp && (
                          <a href={whatsappUrl(b.whatsapp, waMessage(brand.name, b.name))} target="_blank" rel="noopener noreferrer" data-track={trackName("wa", key)} className="underline underline-offset-4 hover:text-ink/70">
                            WhatsApp
                          </a>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {(brand.instagramUrl || brand.tiktokUrl) && (
            <div>
              <p className={heading}>Ikuti kami</p>
              <div className="flex gap-2">
                {brand.instagramUrl && (
                  <a href={brand.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" data-track={trackName("ig")} className="grid h-11 w-11 place-items-center rounded-full bg-ink text-white hover:bg-ink/85">
                    <InstagramIcon />
                  </a>
                )}
                {brand.tiktokUrl && (
                  <a href={brand.tiktokUrl} target="_blank" rel="noopener noreferrer" aria-label="TikTok" data-track={trackName("tiktok")} className="grid h-11 w-11 place-items-center rounded-full bg-ink text-white hover:bg-ink/85">
                    <TikTokIcon />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-ink/60">
          © {new Date().getFullYear()} {brand.name}. {AMINOTO.footer.note}
        </p>
      </div>
    </footer>
  );
}
