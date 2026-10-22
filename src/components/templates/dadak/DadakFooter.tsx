import Link from "next/link";
import type { Brand } from "@prisma/client";
import { DADAK_NAV, DEEP, InstagramIcon, TikTokIcon, WRAP } from "@/components/templates/dadak/shared";
import { AMINOTO } from "@/data/brands/aminoto";
import { mapsLink, whatsappUrl } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { waMessage } from "@/lib/site";
import { branchKey, trackName } from "@/lib/track";

/** Footer hijau tua: nama brand besar, navigasi, cabang (Maps/WA kalau datanya ada), jam, sosial media. */
export default async function DadakFooter({ brand }: { brand: Brand }) {
  const branches = await prisma.branch.findMany({
    where: { brandId: brand.id },
    orderBy: { order: "asc" },
    select: { name: true, address: true, whatsapp: true, mapsUrl: true, lat: true, lng: true },
  });
  const heading = "dk-caps mb-4 text-[13px] font-medium text-accent";
  const link = "dk-caps text-[13px] font-medium underline decoration-white/30 underline-offset-4 hover:decoration-accent";

  return (
    <footer className={DEEP}>
      <div className={`${WRAP} pb-8 pt-16 md:pt-20`}>
        <Link href="/" aria-label={`${brand.name}, ke Beranda`} className="dk-display block text-[clamp(64px,13vw,180px)] leading-[0.85]">
          {AMINOTO.shortName}
        </Link>
        <p className="dk-caps mt-3 text-sm font-medium text-white/70">{AMINOTO.kicker}</p>

        <div className="mt-14 grid gap-10 border-t border-white/15 pt-10 sm:grid-cols-2 lg:grid-cols-[0.7fr_2fr_0.8fr_0.8fr]">
          <nav aria-label="Navigasi footer">
            <p className={heading}>Jelajahi</p>
            <ul className="space-y-2">
              {[...DADAK_NAV, { href: "/menu", label: "Menu" }].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="dk-caps text-[15px] hover:text-accent">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {branches.length > 0 && (
            <div>
              <p className={heading}>Cabang</p>
              <ul className="grid gap-6 sm:grid-cols-3">
                {branches.map((b) => {
                  const key = branchKey(b.name);
                  return (
                    <li key={b.name}>
                      <p className="dk-display text-2xl">{b.name}</p>
                      {b.address && <p className="mt-1.5 text-sm leading-relaxed text-white/70">{b.address}</p>}
                      <div className="mt-2 flex gap-4">
                        {(b.mapsUrl || b.address) && (
                          <a href={mapsLink(b)} target="_blank" rel="noopener noreferrer" data-track={trackName("maps", key)} className={link}>
                            Maps
                          </a>
                        )}
                        {b.whatsapp && (
                          <a href={whatsappUrl(b.whatsapp, waMessage(brand.name, b.name))} target="_blank" rel="noopener noreferrer" data-track={trackName("wa", key)} className={link}>
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

          <div>
            <p className={heading}>Jam buka</p>
            <p className="dk-caps text-[15px]">Setiap hari</p>
            <p className="dk-display mt-1 text-3xl">{AMINOTO.hoursShort}</p>
          </div>

          {(brand.instagramUrl || brand.tiktokUrl) && (
            <div>
              <p className={heading}>Ikuti kami</p>
              <div className="flex gap-2">
                {brand.instagramUrl && (
                  <a href={brand.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" data-track={trackName("ig")} className="grid h-11 w-11 place-items-center border border-white/25 hover:border-accent hover:text-accent">
                    <InstagramIcon />
                  </a>
                )}
                {brand.tiktokUrl && (
                  <a href={brand.tiktokUrl} target="_blank" rel="noopener noreferrer" aria-label="TikTok" data-track={trackName("tiktok")} className="grid h-11 w-11 place-items-center border border-white/25 hover:border-accent hover:text-accent">
                    <TikTokIcon />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-white/15 pt-6 text-sm text-white/60 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {brand.name}
          </p>
          <p>{AMINOTO.footer.note}</p>
        </div>
      </div>
    </footer>
  );
}
