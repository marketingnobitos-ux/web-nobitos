import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import { imageVariant } from "@/lib/image";

export type MenuCardItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  portion: string | null;
  imageUrl: string | null;
  isAvailable: boolean;
};

// Kartu menu (katalog saja, tanpa tombol pesan).
export default function MenuCard({ item, track }: { item: MenuCardItem; track?: string }) {
  return (
    <Link
      href={`/menu/${item.id}`}
      data-track={track}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-[4/3] bg-primary/10">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageVariant(item.imageUrl, 1000)} alt={item.name} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full items-center justify-center text-4xl font-bold text-primary/40">
            {item.name.charAt(0)}
          </span>
        )}
        {!item.isAvailable && (
          <span className="absolute left-2 top-2 rounded bg-gray-900/80 px-2 py-1 text-xs text-white">
            Sedang tidak tersedia
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-primary">{item.name}</h3>
        {item.description && <p className="line-clamp-2 text-sm text-gray-600">{item.description}</p>}
        <div className="mt-auto flex flex-wrap items-baseline justify-between gap-x-2 pt-2">
          <span className="font-bold text-primary">{formatRupiah(item.price)}</span>
          {item.portion && <span className="text-xs text-gray-500">{item.portion}</span>}
        </div>
      </div>
    </Link>
  );
}
