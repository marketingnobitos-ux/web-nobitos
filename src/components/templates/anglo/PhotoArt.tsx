import { ANGLO_PHOTO_SLOTS, angloPhoto, type AngloPhotoSlot } from "@/lib/anglo-photos";

type Props = {
  slot: AngloPhotoSlot | null;
  /** Ilustrasi SVG yang dipakai selama foto slot belum ada. */
  children: React.ReactNode;
  className?: string;
  /** Kelas khusus foto (mis. tinggi tetap + object-contain); default = className. */
  photoClassName?: string;
  /** Potongan ala stiker: tepi putih tebal mengikuti bentuk foto (PNG/WebP transparan). */
  sticker?: boolean;
};

/** Foto asli dari public/brands/bakmi-pak-joko/foto kalau ada, selain itu ilustrasi SVG (children). */
export default function PhotoArt({ slot, children, className = "", photoClassName, sticker = false }: Props) {
  const src = slot ? angloPhoto(slot) : null;
  if (!slot || !src) return <>{children}</>;
  const alt = ANGLO_PHOTO_SLOTS[slot].split(" (")[0];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`block h-auto w-full object-contain ${sticker ? "ag-photo-sticker" : ""} ${photoClassName ?? className}`}
    />
  );
}
