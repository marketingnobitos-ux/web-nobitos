import Link from "next/link";
import type { Brand } from "@prisma/client";
import { WarungFront } from "@/components/templates/anglo/illustrations";
import { ANGLO_NAV, LocationCard, WRAP } from "@/components/templates/anglo/shared";
import { BAKMI_PAK_JOKO } from "@/data/brands/bakmi-pak-joko";
import { socialHandle } from "@/lib/site";
import { trackName } from "@/lib/track";

/** Footer Anglo (brief 6.3): ilustrasi garis warung, kartu lokasi per cabang, link Instagram & TikTok (kolom Brand). */
export default function AngloFooter({ brand }: { brand: Brand }) {
  const { branches, hashtag } = BAKMI_PAK_JOKO;

  return (
    <footer className="ag-noise border-t-2 border-ink bg-paper text-ink">
      <div className={`${WRAP} pb-10 pt-16 md:pt-24`}>
        <WarungFront className="mx-auto w-full max-w-[560px]" />

        <ul className="mt-14 grid gap-8 md:mt-20 md:grid-cols-2 md:gap-10">
          {branches.map((b, i) => (
            <li key={b.slug}>
              <LocationCard branch={b} brandName={brand.name} className={i % 2 ? "md:rotate-1" : "md:-rotate-1"} />
            </li>
          ))}
        </ul>

        <div className="mt-16 flex flex-col gap-8 border-t-2 border-ink pt-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href="/" className="ag-marker block text-[2.4rem]">
              {brand.name}
            </Link>
            {brand.tagline && <p className="mt-2">{brand.tagline}</p>}
          </div>
          <div className="flex flex-col gap-4 md:items-end">
            <nav aria-label="Navigasi footer">
              <ul className="flex gap-5 font-mono text-sm font-bold uppercase tracking-wider">
                {ANGLO_NAV.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-accent">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            {(brand.instagramUrl || brand.tiktokUrl) && (
              <div className="flex flex-wrap gap-3 self-start md:self-end">
                {brand.instagramUrl && (
                  <a
                    href={brand.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track={trackName("ig")}
                    className="ag-sticker rotate-1"
                  >
                    Instagram {socialHandle(brand.instagramUrl)}
                  </a>
                )}
                {brand.tiktokUrl && (
                  <a
                    href={brand.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track={trackName("tiktok")}
                    className="ag-sticker -rotate-1"
                  >
                    TikTok {socialHandle(brand.tiktokUrl)}
                  </a>
                )}
              </div>
            )}
            <p className="font-mono text-xs">{hashtag}</p>
          </div>
        </div>

        <p className="mt-10 font-mono text-xs opacity-60">
          © {new Date().getFullYear()} {brand.name}
        </p>
      </div>
    </footer>
  );
}
