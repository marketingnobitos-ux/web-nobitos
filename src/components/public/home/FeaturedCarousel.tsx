"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { imageSrcSet } from "@/lib/image";
import { formatRupiah } from "@/lib/format";

export type FeaturedItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  portion: string | null;
  photo: string;
  category: string;
};

/**
 * Carousel menu andalan: geser dengan jari (scroll-snap), drag dengan mouse, atau tombol panah.
 * Kartu tinggi berisi foto penuh, nama besar, badge harga, chip kategori.
 */
export default function FeaturedCarousel({ items }: { items: FeaturedItem[] }) {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const [dragging, setDragging] = useState(false);

  const scrollByCard = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.querySelector<HTMLElement>("[data-card]");
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.offsetWidth + 16), behavior: "smooth" });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !track.current) return;
    drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || !track.current) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true;
      setDragging(true);
    }
    if (d.moved) track.current.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    if (!drag.current) return;
    const moved = drag.current.moved;
    drag.current = null;
    // Lepas mode drag setelah event click (supaya klik hasil drag tidak membuka kartu).
    if (moved) requestAnimationFrame(() => setDragging(false));
  };

  return (
    <div className="relative">
      <div
        ref={track}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={(e) => dragging && e.preventDefault()}
        className={`no-scrollbar flex gap-4 overflow-x-auto px-4 pb-2 sm:px-6 md:px-[max(1.5rem,calc((100vw-1400px)/2+1.5rem))] ${
          dragging ? "cursor-grabbing select-none" : "cursor-grab snap-x snap-mandatory"
        }`}
        aria-label="Menu andalan"
        role="region"
        tabIndex={0}
      >
        {items.map((item, i) => (
          <Link
            key={item.id}
            href={`/menu/${item.id}`}
            data-card
            data-track={`menu-andalan-${i + 1}`}
            draggable={false}
            className="group relative block aspect-[3/4.4] w-[78vw] max-w-[380px] shrink-0 snap-start overflow-hidden rounded-[1.75rem] bg-ink text-paper sm:w-[340px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.photo}
              srcSet={imageSrcSet(item.photo)}
              sizes="(min-width: 640px) 380px, 78vw"
              alt={item.name}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />

            <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-xs font-semibold text-ink backdrop-blur">
              {item.category}
            </span>
            <span className="absolute right-4 top-4 flex h-[5.2rem] w-[5.2rem] rotate-[-8deg] flex-col items-center justify-center rounded-full bg-accent text-center leading-none shadow-lg transition-transform duration-500 group-hover:rotate-[4deg]">
              <span className="text-xs font-semibold opacity-80">Rp</span>
              <span className="display mt-0.5 text-[1.3rem] tracking-tight">{formatRupiah(item.price).replace("Rp ", "")}</span>
            </span>

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <h3 className="display text-[2rem] leading-[1.05] sm:text-[2.3rem]">{item.name}</h3>
              {item.description && <p className="mt-2 line-clamp-2 text-sm text-paper/75">{item.description}</p>}
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                Lihat menu
                <span className="transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden>
                  →
                </span>
              </span>
            </div>
          </Link>
        ))}
        <div className="w-1 shrink-0" aria-hidden />
      </div>

      <div className="mx-auto mt-6 hidden max-w-[1400px] justify-end gap-2 px-6 md:flex">
        {([-1, 1] as const).map((dir) => (
          <button
            key={dir}
            type="button"
            onClick={() => scrollByCard(dir)}
            aria-label={dir < 0 ? "Menu sebelumnya" : "Menu berikutnya"}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-ink/20 text-xl transition hover:bg-ink hover:text-paper"
          >
            {dir < 0 ? "←" : "→"}
          </button>
        ))}
      </div>
    </div>
  );
}
