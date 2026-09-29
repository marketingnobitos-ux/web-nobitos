import Link from "next/link";
import Headline from "@/components/public/home/Headline";
import OpenBadge from "@/components/public/OpenBadge";
import { mapsLink, whatsappUrl } from "@/lib/format";
import type { DayHours } from "@/lib/hours";
import { waMessage } from "@/lib/site";
import { branchKey, trackName } from "@/lib/track";

type Branch = {
  id: string;
  name: string;
  address: string;
  mapsUrl: string | null;
  lat: number | null;
  lng: number | null;
  openHours: string | null;
  whatsapp: string | null;
  hours: DayHours[];
};

/** "16.00 - 23.00 setiap hari" -> "16.00–23.00" (jam saja untuk baris ringkas). */
function shortHours(openHours: string | null): string | null {
  const m = openHours?.match(/(\d{1,2}[.:]\d{2})\s*[-–]\s*(\d{1,2}[.:]\d{2})/);
  return m ? `${m[1]}–${m[2]}` : openHours;
}

/**
 * Daftar cabang bergaya editorial di latar gelap: "01  AMG — Ciledug  16.00–23.00  →".
 * Hover (desktop) memunculkan tombol Maps & WhatsApp; di HP tombol selalu terlihat.
 */
export default function BranchList({ brandName, branches }: { brandName: string; branches: Branch[] }) {
  return (
    <section aria-labelledby="branch-title" className="bg-ink py-20 text-paper md:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Headline id="branch-title" text="Mampir ke cabang terdekat" className="max-w-xl text-[clamp(32px,5vw,64px)]" />
          <p className="max-w-xs text-paper/60 lg:pb-3">
            {branches.length} cabang {brandName} siap nyambut kamu. Buka tiap sore, sampai malam.
          </p>
        </div>

        <ol className="mt-14 border-t border-paper/15 md:mt-20">
          {branches.map((b, i) => {
            const hours = shortHours(b.openHours);
            const key = branchKey(b.name);
            return (
              <li key={b.id} className="group relative border-b border-paper/15">
                {/* Latar aksen menyapu dari kiri saat hover. */}
                <span
                  className="absolute inset-0 origin-left scale-x-0 bg-paper/[0.07] transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] md:group-hover:scale-x-100"
                  aria-hidden
                />
                <div className="relative grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 gap-y-3 py-6 md:grid-cols-[4rem_1.6fr_1fr_auto] md:py-8 md:transition-[padding] md:duration-500 md:group-hover:px-6">
                  <span className="display text-lg text-paper/45 tabular-nums md:text-xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="display text-2xl md:text-4xl">
                      <Link href="/cabang" data-track={trackName("cabang", key)} className="after:absolute after:inset-0">
                        {b.name.replace(/\s+-\s+/, " — ")}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-paper/60 md:group-hover:text-paper/85">{b.address}</p>
                    <OpenBadge hours={b.hours} className="mt-2 text-sm text-paper/80" />
                  </div>
                  {hours && (
                    <p className="col-start-2 text-sm tabular-nums text-paper/80 transition-opacity md:col-start-auto md:text-lg md:group-hover:opacity-0">{hours}</p>
                  )}
                  <span
                    className="col-start-3 row-start-1 text-3xl transition-transform duration-500 md:col-start-auto md:row-start-auto md:group-hover:-rotate-45"
                    aria-hidden
                  >
                    →
                  </span>

                  <div className="relative z-10 col-span-3 col-start-1 flex flex-wrap gap-2 md:absolute md:right-20 md:top-1/2 md:col-auto md:-translate-y-1/2 md:translate-x-4 md:opacity-0 md:transition md:duration-500 md:group-focus-within:translate-x-0 md:group-focus-within:opacity-100 md:group-hover:translate-x-0 md:group-hover:opacity-100">
                    <a
                      href={mapsLink(b)}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-track={trackName("maps", key)}
                      className="inline-flex h-11 items-center rounded-full bg-paper px-5 text-sm font-semibold text-ink transition hover:bg-ink hover:text-paper"
                    >
                      Buka Maps
                    </a>
                    {b.whatsapp && (
                      <a
                        href={whatsappUrl(b.whatsapp, waMessage(brandName, b.name))}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-track={trackName("wa", key)}
                        className="inline-flex h-11 items-center rounded-full border border-paper/60 px-5 text-sm font-semibold transition hover:bg-paper hover:text-ink"
                      >
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
