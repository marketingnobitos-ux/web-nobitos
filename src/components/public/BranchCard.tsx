import type { Branch } from "@prisma/client";
import OpenBadge from "@/components/public/OpenBadge";
import { mapsEmbedUrl, mapsLink, slugify, telUrl, whatsappUrl } from "@/lib/format";
import type { DayHours } from "@/lib/hours";
import { waMessage } from "@/lib/site";

export default function BranchCard({ branch, brandName }: { branch: Branch & { hours: DayHours[] }; brandName: string }) {
  const key = slugify(branch.name);
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <iframe
        src={mapsEmbedUrl(branch)}
        title={`Peta ${branch.name}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-48 w-full border-0 bg-gray-100"
      />
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h2 className="text-lg font-bold text-gray-900">{branch.name}</h2>
        <OpenBadge hours={branch.hours} className="text-sm text-gray-700" />
        <p className="text-sm text-gray-700">{branch.address}</p>
        {branch.openHours && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Jam buka:</span> {branch.openHours}
          </p>
        )}
        <div className="mt-auto flex flex-wrap gap-2 pt-3">
          <a
            href={mapsLink(branch)}
            target="_blank"
            rel="noopener noreferrer"
            data-track={`maps-cabang-${key}`}
            className="rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5"
          >
            Buka di Google Maps
          </a>
          {branch.whatsapp && (
            <a
              href={whatsappUrl(branch.whatsapp, waMessage(brandName, branch.name))}
              target="_blank"
              rel="noopener noreferrer"
              data-track={`wa-cabang-${key}`}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              WhatsApp
            </a>
          )}
          {branch.phone && (
            <a
              href={telUrl(branch.phone)}
              data-track={`telp-cabang-${key}`}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Telepon
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
