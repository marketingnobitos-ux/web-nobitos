import Reveal from "@/components/animations/Reveal";
import OpenBadge from "@/components/public/OpenBadge";
import { InstagramIcon, Photo, TikTokIcon, WRAP } from "@/components/templates/tungku/shared";
import { APW, APW_IMAGES } from "@/data/brands/apw";
import { mapsLink, telUrl, whatsappUrl } from "@/lib/format";
import type { DayHours } from "@/lib/hours";
import { waMessage } from "@/lib/site";
import { branchKey, trackName } from "@/lib/track";

type Branch = {
  id: string;
  name: string;
  address: string;
  openHours: string | null;
  mapsUrl: string | null;
  lat: number | null;
  lng: number | null;
  whatsapp: string | null;
  phone: string | null;
  hours: DayHours[];
};

type Props = { brandName: string; branches: Branch[]; instagramUrl: string | null; tiktokUrl: string | null };

/**
 * Halaman Cabang (desain Figma "Cabang — Desktop 1440"): foto, alamat, jam, badge Buka/Tutup, tombol Maps/WA/telepon.
 * Tombol hanya dirender kalau datanya ada (WA Kesambi belum ada: TODO konfirmasi Fran).
 */
export default function TungkuBranches({ brandName, branches, instagramUrl, tiktokUrl }: Props) {
  const label = "tk-caps text-xs tracking-[0.14em] text-ink/55";

  return (
    <div className={`${WRAP} overflow-hidden pb-24 pt-16 md:pb-32 md:pt-24`}>
      <Reveal y={16} className="text-center">
        <h1 className="tk-caps text-[clamp(34px,4vw,48px)] tracking-[0.12em]">{APW.branches.title}</h1>
        <p className="mt-5 text-lg text-ink/80">{APW.branches.lead}</p>
      </Reveal>

      <div className="mt-16 space-y-24 md:mt-24">
        {branches.map((b) => {
          const key = branchKey(b.name);
          return (
            <article key={b.id} id={key} aria-labelledby={`cabang-${key}`} className="grid items-center gap-12 md:grid-cols-[480px_1fr] md:gap-20">
              <Reveal y={16} className="relative ml-6 md:ml-10">
                <div aria-hidden className="bg-paper-deep absolute -left-6 bottom-10 top-12 w-full md:-left-10" />
                <Photo image={APW_IMAGES.cabang} className="relative aspect-[4/5] w-full" />
                <div aria-hidden className="absolute -right-3 top-8 h-5 w-32 bg-accent md:-right-8 md:w-44" />
              </Reveal>
              <Reveal y={16} delay={0.1}>
                <h2 id={`cabang-${key}`} className="tk-caps text-[clamp(28px,3vw,34px)]">
                  {b.name}
                </h2>
                <OpenBadge hours={b.hours} className="mt-3 text-sm font-normal" />
                {b.address && (
                  <>
                    <p className={`${label} mt-8`}>Alamat</p>
                    <p className="mt-2 max-w-md text-[17px] leading-[1.65]">{b.address}</p>
                  </>
                )}
                {b.openHours && (
                  <>
                    <p className={`${label} mt-6`}>Jam buka</p>
                    <p className="mt-2 text-[17px] leading-[1.65]">{b.openHours}</p>
                  </>
                )}
                <div className="mt-8 flex flex-wrap gap-3">
                  {(b.mapsUrl || b.address) && (
                    <a href={mapsLink(b)} target="_blank" rel="noopener noreferrer" data-track={trackName("maps", key)} className="tk-btn">
                      Buka di Google Maps <span aria-hidden>→</span>
                    </a>
                  )}
                  {b.whatsapp && (
                    <a
                      href={whatsappUrl(b.whatsapp, waMessage(brandName, b.name))}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-track={trackName("wa", key)}
                      className="tk-btn tk-btn-ghost"
                    >
                      WhatsApp
                    </a>
                  )}
                  {b.phone && (
                    <a href={telUrl(b.phone)} data-track={trackName("tel", key)} className="tk-btn tk-btn-ghost">
                      Telepon
                    </a>
                  )}
                </div>
                {(instagramUrl || tiktokUrl) && (
                  <>
                    <p className={`${label} mt-10`}>{APW.branches.follow}</p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {instagramUrl && (
                        <a href={instagramUrl} target="_blank" rel="noopener noreferrer" data-track={trackName("ig")} className="tk-btn tk-btn-ghost">
                          <InstagramIcon className="h-4 w-4" /> Instagram
                        </a>
                      )}
                      {tiktokUrl && (
                        <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" data-track={trackName("tiktok")} className="tk-btn tk-btn-ghost">
                          <TikTokIcon className="h-4 w-4" /> TikTok
                        </a>
                      )}
                    </div>
                  </>
                )}
              </Reveal>
            </article>
          );
        })}
      </div>
    </div>
  );
}
