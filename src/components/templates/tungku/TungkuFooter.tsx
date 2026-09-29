import Link from "next/link";
import type { Brand } from "@prisma/client";
import { InstagramIcon, TUNGKU_NAV, TikTokIcon, WRAP, Wordmark, branchArea } from "@/components/templates/tungku/shared";
import { mapsLink, whatsappUrl } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { waMessage } from "@/lib/site";
import { branchKey, trackName } from "@/lib/track";

/** Footer sederhana: logo, navigasi, cabang (WA/Maps hanya kalau datanya ada), Instagram & TikTok. */
export default async function TungkuFooter({ brand }: { brand: Brand }) {
  const branches = await prisma.branch.findMany({
    where: { brandId: brand.id },
    orderBy: { order: "asc" },
    select: { name: true, address: true, openHours: true, whatsapp: true, mapsUrl: true, lat: true, lng: true },
  });
  const heading = "tk-caps mb-4 text-xs text-ink/55";

  return (
    <footer className="border-t border-ink/10 bg-paper text-ink">
      <div className={`${WRAP} grid gap-10 py-16 sm:grid-cols-2 md:grid-cols-[1.2fr_1fr_1fr_1fr] md:py-20`}>
        <Link href="/" aria-label={`${brand.name}, ke Beranda`} className="self-start text-brand">
          {brand.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={brand.logoUrl} alt={`Logo ${brand.name}`} width={96} height={96} loading="lazy" className="h-24 w-24 rounded-full" />
          ) : (
            <Wordmark className="items-start" />
          )}
        </Link>

        <nav aria-label="Navigasi footer">
          <p className={heading}>Jelajahi</p>
          <ul className="space-y-2">
            {TUNGKU_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-brand">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {branches.length > 0 && (
          <div>
            <p className={heading}>Cabang</p>
            <ul className="space-y-4">
              {branches.map((b) => {
                const key = branchKey(b.name);
                return (
                  <li key={b.name}>
                    <p>{branchArea(b.name)}</p>
                    {b.address && <p className="mt-1 text-sm text-ink/70">{b.address}</p>}
                    {b.openHours && <p className="mt-1 text-sm text-ink/70">{b.openHours}</p>}
                    <div className="mt-2 flex gap-4 text-sm">
                      {b.whatsapp && (
                        <a href={whatsappUrl(b.whatsapp, waMessage(brand.name, b.name))} target="_blank" rel="noopener noreferrer" data-track={trackName("wa", key)} className="underline-offset-4 hover:text-brand hover:underline">
                          WhatsApp
                        </a>
                      )}
                      {(b.mapsUrl || b.address) && (
                        <a href={mapsLink(b)} target="_blank" rel="noopener noreferrer" data-track={trackName("maps", key)} className="underline-offset-4 hover:text-brand hover:underline">
                          Google Maps
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
            <ul className="space-y-2">
              {brand.instagramUrl && (
                <li>
                  <a href={brand.instagramUrl} target="_blank" rel="noopener noreferrer" data-track={trackName("ig")} className="flex items-center gap-2 hover:text-brand">
                    <InstagramIcon className="h-4 w-4" /> Instagram
                  </a>
                </li>
              )}
              {brand.tiktokUrl && (
                <li>
                  <a href={brand.tiktokUrl} target="_blank" rel="noopener noreferrer" data-track={trackName("tiktok")} className="flex items-center gap-2 hover:text-brand">
                    <TikTokIcon className="h-4 w-4" /> TikTok
                  </a>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
      <p className={`${WRAP} border-t border-ink/10 py-6 text-xs text-ink/55`}>
        © {new Date().getFullYear()} {brand.name}
      </p>
    </footer>
  );
}
