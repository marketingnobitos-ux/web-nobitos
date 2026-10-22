import OpenBadge from "@/components/public/OpenBadge";
import { ClockIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/templates/dadak/shared";
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

/** Kartu kaca satu cabang: nama, badge buka/tutup, alamat, jam, tombol Maps/WA/telepon (hanya kalau datanya ada). */
export default function DadakBranchCard({ branch: b, brandName, headingLevel = "h3" }: { branch: DadakBranch; brandName: string; headingLevel?: "h2" | "h3" }) {
  const key = branchKey(b.name);
  const Heading = headingLevel;
  return (
    <article id={key} aria-labelledby={`cabang-${key}`} className="dk-glass flex h-full flex-col p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">Aminoto</p>
      <Heading id={`cabang-${key}`} className="dk-title mt-1 text-3xl">
        {b.name}
      </Heading>
      <OpenBadge hours={b.hours} className="mt-3 text-sm" />
      <p className="mt-5 flex gap-3 text-[15px] leading-relaxed">
        <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-ink/60" />
        <span>{b.address}</span>
      </p>
      {b.openHours && (
        <p className="mt-3 flex gap-3 text-[15px]">
          <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-ink/60" />
          <span>{b.openHours}</span>
        </p>
      )}
      <div className="mt-6 flex flex-1 flex-wrap items-end gap-2">
        {(b.mapsUrl || b.address) && (
          <a href={mapsLink(b)} target="_blank" rel="noopener noreferrer" data-track={trackName("maps", key)} className="dk-btn !py-2.5 !pr-5 text-sm">
            Buka Maps
          </a>
        )}
        {b.whatsapp && (
          <a
            href={whatsappUrl(b.whatsapp, waMessage(brandName, b.name))}
            target="_blank"
            rel="noopener noreferrer"
            data-track={trackName("wa", key)}
            className="dk-btn dk-btn-ghost !py-2.5 text-sm"
          >
            <WhatsAppIcon /> WhatsApp
          </a>
        )}
        {b.phone && (
          <a href={telUrl(b.phone)} data-track={trackName("tel", key)} className="dk-btn dk-btn-ghost !py-2.5 text-sm">
            <PhoneIcon /> Telepon
          </a>
        )}
      </div>
    </article>
  );
}
