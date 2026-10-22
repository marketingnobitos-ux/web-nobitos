import OpenBadge from "@/components/public/OpenBadge";
import { mapsLink, telUrl, whatsappUrl } from "@/lib/format";
import type { DayHours } from "@/lib/hours";
import { waMessage } from "@/lib/site";
import { branchKey, trackName } from "@/lib/track";

export type DadakBranch = {
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

/**
 * Satu cabang sebagai baris bergaris atas: nama besar, badge buka/tutup, alamat, jam, tautan Maps/WA/telepon
 * (hanya kalau datanya ada). `large` untuk halaman Cabang.
 */
export default function DadakBranchCard({
  branch: b,
  brandName,
  headingLevel = "h3",
  large = false,
}: {
  branch: DadakBranch;
  brandName: string;
  headingLevel?: "h2" | "h3";
  large?: boolean;
}) {
  const key = branchKey(b.name);
  const Heading = headingLevel;
  const link = "dk-caps text-[13px] font-semibold underline decoration-current/30 underline-offset-4 hover:decoration-current";

  return (
    <article id={key} aria-labelledby={`cabang-${key}`} className={`grid gap-4 border-t border-current/20 py-7 ${large ? "md:grid-cols-[0.8fr_1.2fr] md:gap-10 md:py-10" : ""}`}>
      <div>
        <Heading id={`cabang-${key}`} className={`dk-display ${large ? "text-[clamp(44px,6vw,72px)]" : "text-4xl"}`}>
          {b.name}
        </Heading>
        <OpenBadge hours={b.hours} className="dk-caps mt-2 text-[13px]" />
      </div>
      <div>
        <p className={`leading-relaxed ${large ? "text-lg" : "text-[15px]"}`}>{b.address}</p>
        {b.openHours && <p className="dk-caps mt-2 text-[13px] font-medium opacity-70">{b.openHours}</p>}
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {(b.mapsUrl || b.address) && (
            <a href={mapsLink(b)} target="_blank" rel="noopener noreferrer" data-track={trackName("maps", key)} className={link}>
              Buka di Google Maps
            </a>
          )}
          {b.whatsapp && (
            <a href={whatsappUrl(b.whatsapp, waMessage(brandName, b.name))} target="_blank" rel="noopener noreferrer" data-track={trackName("wa", key)} className={link}>
              WhatsApp
            </a>
          )}
          {b.phone && (
            <a href={telUrl(b.phone)} data-track={trackName("tel", key)} className={link}>
              Telepon {b.phone}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
