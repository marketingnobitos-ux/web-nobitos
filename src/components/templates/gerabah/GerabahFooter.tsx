import Link from "next/link";
import type { Brand } from "@prisma/client";
import { GERABAH_NAV, InstagramIcon, TikTokIcon, WRAP } from "@/components/templates/gerabah/shared";
import { GR } from "@/data/brands/apw-gerabah";
import { mapsLink, whatsappUrl } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { waMessage } from "@/lib/site";
import { branchKey, trackName } from "@/lib/track";

/** Footer arang: nama brand besar bergaris grid, navigasi, alamat (Maps/WA kalau datanya ada), jam, sosial media. */
export default async function GerabahFooter({ brand }: { brand: Brand }) {
  const branch = await prisma.branch.findFirst({
    where: { brandId: brand.id },
    orderBy: { order: "asc" },
    select: { name: true, address: true, whatsapp: true, mapsUrl: true, lat: true, lng: true },
  });
  const heading = "gr-caps mb-4 text-[var(--gr-gold)]";
  const key = branch ? branchKey(branch.name) : "";

  return (
    <footer className="gr-lines border-t border-[var(--gr-line)] bg-[var(--gr-char)] text-[var(--gr-cream)]">
      <div className={`${WRAP} pb-8 pt-16 md:pt-20`}>
        <Link href="/" aria-label={`${brand.name}, ke Beranda`} className="gr-display block text-[clamp(44px,10.5vw,168px)] leading-[0.86]">
          <span className="block text-[0.42em] text-[var(--gr-cream)]/70">Ayam Panggang</span>
          Wicaksono
        </Link>
        <p className="gr-serif mt-4 text-2xl italic text-[var(--gr-cream)]/80">{GR.slogan}</p>

        <div className="mt-14 grid gap-10 border-t border-[var(--gr-line)] pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <nav aria-label="Navigasi footer">
            <p className={heading}>Jelajahi</p>
            <ul className="space-y-2.5">
              {GERABAH_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-[15px] hover:text-[var(--gr-gold)]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {branch && (
            <div>
              <p className={heading}>Cabang {branch.name}</p>
              <p className="text-[15px] leading-relaxed text-[var(--gr-cream)]/80">{branch.address}</p>
              <p className="mt-2 text-sm text-[var(--gr-cream)]/60">{GR.landmark}</p>
              <div className="mt-3 flex gap-5 text-sm font-semibold">
                <a href={mapsLink(branch)} target="_blank" rel="noopener noreferrer" data-track={trackName("maps", key)} className="underline decoration-white/30 underline-offset-4 hover:decoration-[var(--gr-gold)]">
                  Google Maps
                </a>
                {branch.whatsapp && (
                  <a href={whatsappUrl(branch.whatsapp, waMessage(brand.name, branch.name))} target="_blank" rel="noopener noreferrer" data-track={trackName("wa", key)} className="underline decoration-white/30 underline-offset-4 hover:decoration-[var(--gr-gold)]">
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          )}

          <div>
            <p className={heading}>Jam buka</p>
            <p className="gr-display text-4xl">{GR.hoursShort}</p>
            <p className="mt-2 text-sm text-[var(--gr-cream)]/70">WIB · {GR.closedDay}</p>
          </div>

          {(brand.instagramUrl || brand.tiktokUrl) && (
            <div>
              <p className={heading}>Ikuti kami</p>
              <div className="flex gap-2">
                {brand.instagramUrl && (
                  <a href={brand.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" data-track={trackName("ig")} className="grid h-11 w-11 place-items-center rounded-full ring-1 ring-white/25 hover:text-[var(--gr-gold)] hover:ring-[var(--gr-gold)]">
                    <InstagramIcon />
                  </a>
                )}
                {brand.tiktokUrl && (
                  <a href={brand.tiktokUrl} target="_blank" rel="noopener noreferrer" aria-label="TikTok" data-track={trackName("tiktok")} className="grid h-11 w-11 place-items-center rounded-full ring-1 ring-white/25 hover:text-[var(--gr-gold)] hover:ring-[var(--gr-gold)]">
                    <TikTokIcon />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-[var(--gr-line)] pt-6 text-sm text-[var(--gr-cream)]/55 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {brand.name}
          </p>
          <p>{GR.footer.note}</p>
        </div>
      </div>
    </footer>
  );
}
