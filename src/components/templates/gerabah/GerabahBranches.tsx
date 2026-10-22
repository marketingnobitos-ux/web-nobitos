import type { Branch, BranchHours } from "@prisma/client";
import OpenBadge from "@/components/public/OpenBadge";
import { HoursRing, HoursTable } from "@/components/templates/gerabah/HoursViz";
import { BoardHero, InstagramIcon, Kicker, Photo, Pill, TikTokIcon, WRAP } from "@/components/templates/gerabah/shared";
import { GR_PHOTOS } from "@/data/brands/apw-gerabah";
import { gerabahText } from "@/lib/template-text";
import { mapsLink, telUrl, whatsappUrl } from "@/lib/format";
import { isCompleteWeek } from "@/lib/hours";
import { waMessage } from "@/lib/site";
import { branchKey, trackName } from "@/lib/track";

type Props = {
  brandName: string;
  branches: (Branch & { hours: BranchHours[] })[];
  instagramUrl: string | null;
  tiktokUrl: string | null;
};

/** Halaman Cabang Gerabah (APW hanya punya Kesambi): kartu alamat & kontak, tabel jam, foto tampak depan. */
export default async function GerabahBranches({ brandName, branches, instagramUrl, tiktokUrl }: Props) {
  const GR = await gerabahText();
  const [main] = branches;
  return (
    <>
      <BoardHero kicker={GR.area} title={main ? ["Cabang", main.name] : GR.branches.title} lead={GR.branches.lead} dish={GR_PHOTOS.sajian} />

      <div className="bg-[var(--gr-char)] py-16 md:py-24">
        <div className={`${WRAP} grid gap-16`}>
          {branches.length === 0 && <p className="text-[var(--gr-cream)]/70">Info cabang belum tersedia.</p>}
          {branches.map((b) => {
            const key = branchKey(b.name);
            const hours = isCompleteWeek(b.hours) ? b.hours : null;
            return (
              <section key={b.id} aria-labelledby={`cabang-${key}`} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="flex flex-col gap-6">
                  <div className="rounded-[28px] bg-[var(--gr-clay)] p-6 md:p-10">
                    <Kicker className="text-[var(--gr-cream)]/80">Alamat</Kicker>
                    <h2 id={`cabang-${key}`} className="gr-display mt-4 text-[clamp(40px,5vw,72px)]">
                      {b.name}
                    </h2>
                    <p className="mt-4 max-w-lg text-[17px] leading-relaxed">{b.address}</p>
                    <p className="mt-2 text-[var(--gr-cream)]/85">{GR.landmark}</p>
                    {hours && <OpenBadge hours={hours} className="gr-glass mt-6 !rounded-full px-4 py-2 text-sm" />}
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Pill href={mapsLink(b)} external track={trackName("maps", key)} variant="gold">
                        Buka di Google Maps
                      </Pill>
                      {b.whatsapp && (
                        <Pill href={whatsappUrl(b.whatsapp, waMessage(brandName, b.name))} external track={trackName("wa", key)}>
                          WhatsApp
                        </Pill>
                      )}
                      {b.phone && (
                        <a href={telUrl(b.phone)} data-track={trackName("tel", key)} className="gr-pill">
                          Telepon {b.phone}
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-[220px_1fr]">
                    {hours && (
                      <div className="gr-glass flex flex-col items-center justify-center gap-3 p-6 text-center">
                        <HoursRing hours={hours} size={132} />
                        <p className="text-sm text-[var(--gr-cream)]/75">{GR.closedDay}</p>
                      </div>
                    )}
                    <div className="rounded-[28px] bg-[var(--gr-slate)] p-6 ring-1 ring-[var(--gr-line)] md:p-8">
                      <Kicker className="text-[var(--gr-cream)]/75">Jam buka (WIB)</Kicker>
                      <div className="mt-4">{hours ? <HoursTable hours={hours} /> : <p>{b.openHours ?? "Jam buka belum tersedia."}</p>}</div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6">
                  <Photo photo={GR_PHOTOS.depan} className="aspect-square w-full rounded-[28px] ring-1 ring-[var(--gr-line)]" />
                  <Photo photo={GR_PHOTOS.senja} className="aspect-[16/9] w-full rounded-[28px] ring-1 ring-[var(--gr-line)]" />
                </div>
              </section>
            );
          })}

          {(instagramUrl || tiktokUrl) && (
            <section aria-labelledby="sosmed-title" className="flex flex-col gap-6 rounded-[28px] bg-[var(--gr-leaf)] p-6 md:flex-row md:items-center md:justify-between md:p-10">
              <h2 id="sosmed-title" className="gr-serif text-[clamp(28px,3.4vw,44px)]">
                {GR.branches.follow}
              </h2>
              <div className="flex flex-wrap gap-3">
                {instagramUrl && (
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer" data-track={trackName("ig")} className="gr-pill">
                    <InstagramIcon className="h-[18px] w-[18px]" /> Instagram
                  </a>
                )}
                {tiktokUrl && (
                  <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" data-track={trackName("tiktok")} className="gr-pill">
                    <TikTokIcon className="h-[18px] w-[18px]" /> TikTok
                  </a>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
