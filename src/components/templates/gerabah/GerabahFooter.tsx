import Link from "next/link";
import type { Brand } from "@prisma/client";
import { GERABAH_NAV, InstagramIcon, TikTokIcon, WRAP, hoursSummary } from "@/components/templates/gerabah/shared";
import { gerabahText } from "@/lib/template-text";
import { mapsLink, whatsappUrl } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { waMessage } from "@/lib/site";
import { branchKey, trackName } from "@/lib/track";

/** Footer arang: nama brand besar bergaris grid, navigasi, satu kolom per cabang (alamat, jam, Maps/WA kalau ada), sosial media. */
export default async function GerabahFooter({ brand }: { brand: Brand }) {
  const GR = await gerabahText();
  const branches = await prisma.branch.findMany({
    where: { brandId: brand.id },
    orderBy: { order: "asc" },
    select: {
      name: true,
      address: true,
      whatsapp: true,
      mapsUrl: true,
      lat: true,
      lng: true,
      hours: { select: { dayOfWeek: true, isClosed: true, opens: true, closes: true } },
    },
  });
  const heading = "gr-caps mb-4 text-[var(--gr-gold)]";
  const link = "underline decoration-white/30 underline-offset-4 hover:decoration-[var(--gr-gold)]";

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

          {branches.map((b) => {
            const key = branchKey(b.name);
            const sum = hoursSummary(b.hours);
            return (
              <div key={b.name}>
                <p className={heading}>Cabang {b.name}</p>
                <p className="text-[15px] leading-relaxed text-[var(--gr-cream)]/80">{b.address}</p>
                {GR.branchInfo[b.name]?.landmark && <p className="mt-2 text-sm text-[var(--gr-cream)]/60">{GR.branchInfo[b.name].landmark}</p>}
                {sum && (
                  <p className="mt-3 text-sm">
                    <span className="font-semibold">{sum.range} WIB</span> · <span className="text-[var(--gr-cream)]/70">{sum.days}</span>
                  </p>
                )}
                <div className="mt-3 flex gap-5 text-sm font-semibold">
                  <a href={mapsLink(b)} target="_blank" rel="noopener noreferrer" data-track={trackName("maps", key)} className={link}>
                    Google Maps
                  </a>
                  {b.whatsapp && (
                    <a href={whatsappUrl(b.whatsapp, waMessage(brand.name, b.name))} target="_blank" rel="noopener noreferrer" data-track={trackName("wa", key)} className={link}>
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            );
          })}

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
