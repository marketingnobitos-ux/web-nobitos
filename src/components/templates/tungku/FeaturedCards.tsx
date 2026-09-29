"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type Lenis from "lenis";
import { formatHarga } from "@/components/templates/tungku/shared";
import { altText } from "@/lib/site";
import { trackName } from "@/lib/track";

export type FeaturedItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  portion: string | null;
  imageUrl: string | null;
  category: string;
};

type Props = { items: FeaturedItem[]; moreLabel: string; menuLabel: string };

/**
 * Tiga kartu gambar persegi. Tombol "+ Lihat deskripsi" membuka popup (<dialog> bawaan: fokus terkunci, Escape menutup).
 * HP: kartu digeser ke samping (scroll-snap) dengan titik penanda; mulai md: tiga kolom.
 */
export default function FeaturedCards({ items, moreLabel, menuLabel }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const railRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState<FeaturedItem | null>(null);
  const [slide, setSlide] = useState(0);

  const open = (item: FeaturedItem) => {
    setActive(item);
    dialogRef.current?.showModal();
    (window as { __lenis?: Lenis }).__lenis?.stop();
  };
  const close = () => dialogRef.current?.close();

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onClose = () => (window as { __lenis?: Lenis }).__lenis?.start();
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, []);

  // Titik penanda kartu aktif (HP).
  const onScroll = () => {
    const rail = railRef.current;
    if (!rail?.firstElementChild) return;
    const step = (rail.firstElementChild as HTMLElement).offsetWidth + 16;
    setSlide(Math.round(rail.scrollLeft / step));
  };

  return (
    <>
      <ul
        ref={railRef}
        onScroll={onScroll}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-3 md:gap-10 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <li key={item.id} className="w-[78%] shrink-0 snap-start md:w-auto">
            <button
              type="button"
              onClick={() => open(item)}
              aria-haspopup="dialog"
              aria-label={`${moreLabel} ${item.name}`}
              className="group relative block aspect-square w-full overflow-hidden bg-paper-deep text-left"
            >
              {item.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imageUrl}
                  alt={altText(null, `Foto ${item.name}`)}
                  width={720}
                  height={720}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              )}
              <span className="absolute inset-x-0 bottom-0 flex h-14 items-center justify-center gap-2 bg-ink/70 text-[15px] text-paper transition-colors group-hover:bg-brand/90">
                <span aria-hidden>+</span> {moreLabel}
              </span>
            </button>
            <h3 className="tk-display mt-5 text-center text-xl md:text-[22px]">{item.name}</h3>
            <p className="mt-1 text-center text-[15px] text-ink/60">Rp {formatHarga(item.price)}</p>
          </li>
        ))}
      </ul>

      {items.length > 1 && (
        <div aria-hidden className="mt-5 flex justify-center gap-2 md:hidden">
          {items.map((item, i) => (
            <span key={item.id} className={`h-1.5 w-1.5 rounded-full transition-colors ${i === slide ? "bg-brand" : "bg-ink/20"}`} />
          ))}
        </div>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby="tk-popup-title"
        onClick={(e) => e.target === e.currentTarget && close()}
        data-lenis-prevent
        className="tk-dialog m-auto w-[calc(100%-2rem)] max-w-[840px] bg-paper p-0 text-ink backdrop:bg-ink/55"
      >
        {active && (
          <div className="grid md:grid-cols-2">
            {active.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={active.imageUrl} alt={`Foto ${active.name}`} width={720} height={720} className="aspect-[4/3] w-full object-cover md:aspect-square" />
            )}
            <div className="relative flex flex-col p-6 md:p-10">
              <button type="button" onClick={close} className="tk-caps absolute right-4 top-4 flex h-11 items-center gap-2 px-2 text-xs hover:text-brand">
                Tutup <span aria-hidden>✕</span>
              </button>
              <p className="tk-caps text-xs text-brand">{active.category}</p>
              <h3 id="tk-popup-title" className="tk-display mt-3 pr-16 text-[26px] leading-tight md:text-[28px]">
                {active.name}
              </h3>
              {active.portion && <p className="mt-2 text-sm text-ink/60">{active.portion}</p>}
              <p className="mt-3 text-xl font-normal">Rp {formatHarga(active.price)}</p>
              {active.description && <p className="mt-5 leading-[1.75] text-ink/85">{active.description}</p>}
              <div className="mt-8 md:mt-auto md:pt-8">
                <Link href="/menu" data-track={trackName("menu")} className="tk-btn" onClick={close}>
                  {menuLabel}
                </Link>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
