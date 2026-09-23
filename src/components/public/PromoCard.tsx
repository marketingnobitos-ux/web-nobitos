import type { Promo } from "@prisma/client";
import { formatDate } from "@/lib/format";
import { imageVariant } from "@/lib/image";

export default function PromoCard({ promo }: { promo: Promo }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-primary/20 bg-white shadow-sm sm:flex-row">
      {promo.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageVariant(promo.imageUrl, 1000)} alt={promo.title} loading="lazy" className="aspect-[16/9] w-full object-cover sm:w-2/5" />
      )}
      <div className="flex flex-col gap-2 p-5">
        <span className="w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">Promo</span>
        <h3 className="text-lg font-bold text-gray-900">{promo.title}</h3>
        {promo.description && <p className="text-sm text-gray-700">{promo.description}</p>}
        {promo.endsAt && <p className="text-xs text-gray-500">Berlaku sampai {formatDate(promo.endsAt)}</p>}
      </div>
    </article>
  );
}
