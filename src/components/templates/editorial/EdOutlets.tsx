"use client";

import { useRef, useState } from "react";
import Reveal from "@/components/animations/Reveal";
import EdLink from "@/components/templates/editorial/EdLink";
import { imageSrcSet } from "@/lib/image";

export type Outlet = { id: string; name: string; address: string; hours: string | null; mapsUrl: string; photo: string };

/** Outlet: carousel horizontal (geser/drag) berisi foto suasana, alamat, jam buka, link Maps ↗. */
export default function EdOutlets({ outlets }: { outlets: Outlet[] }) {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const [dragging, setDragging] = useState(false);

  const scrollBy = (dir: 1 | -1) => {
    const card = track.current?.querySelector<HTMLElement>("[data-outlet]");
    if (card) track.current?.scrollBy({ left: dir * (card.offsetWidth + 24), behavior: "smooth" });
  };

  return (
    <section aria-labelledby="ed-outlets" className="overflow-hidden bg-ink-deep py-24 text-paper md:py-36">
      <div className="mx-auto mb-12 flex max-w-[1440px] flex-wrap items-end justify-between gap-6 px-5 sm:px-8 md:mb-16 md:px-12">
        <Reveal>
          <h2 id="ed-outlets" className="ed-title max-w-lg text-[clamp(32px,4.2vw,60px)]">
            Mampir ke <em>outlet</em> kami
          </h2>
        </Reveal>
        {outlets.length > 1 && (
          <div className="hidden gap-6 text-lg md:flex">
            <button type="button" onClick={() => scrollBy(-1)} className="ed-link" aria-label="Outlet sebelumnya">
              ← Sebelumnya
            </button>
            <button type="button" onClick={() => scrollBy(1)} className="ed-link" aria-label="Outlet berikutnya">
              Berikutnya →
            </button>
          </div>
        )}
      </div>

      <div
        ref={track}
        onPointerDown={(e) => {
          if (e.pointerType === "mouse" && track.current) drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d || !track.current) return;
          const dx = e.clientX - d.x;
          if (!d.moved && Math.abs(dx) > 5) {
            d.moved = true;
            setDragging(true);
          }
          if (d.moved) track.current.scrollLeft = d.left - dx;
        }}
        onPointerUp={() => {
          if (drag.current?.moved) requestAnimationFrame(() => setDragging(false));
          drag.current = null;
        }}
        onPointerLeave={() => {
          if (drag.current?.moved) requestAnimationFrame(() => setDragging(false));
          drag.current = null;
        }}
        onClickCapture={(e) => dragging && e.preventDefault()}
        className={`no-scrollbar flex gap-6 overflow-x-auto scroll-px-5 px-5 sm:scroll-px-8 sm:px-8 md:scroll-px-[max(3rem,calc((100vw-1440px)/2+3rem))] md:px-[max(3rem,calc((100vw-1440px)/2+3rem))] ${
          dragging ? "cursor-grabbing select-none" : "cursor-grab snap-x snap-mandatory"
        }`}
        role="region"
        aria-label="Daftar outlet"
        tabIndex={0}
      >
        {outlets.map((o) => (
          <article key={o.id} data-outlet className="w-[82vw] max-w-[560px] shrink-0 snap-start">
            <div className="aspect-[4/3] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={o.photo}
                srcSet={imageSrcSet(o.photo)}
                sizes="(min-width: 768px) 560px, 82vw"
                alt=""
                loading="lazy"
                decoding="async"
                draggable={false}
                className="h-full w-full object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(.16,.8,.2,1)] hover:scale-[1.04]"
              />
            </div>
            <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h3 className="ed-title text-[clamp(26px,2.6vw,38px)]">{o.name}</h3>
              {o.hours && <p className="tabular-nums text-paper/70">{o.hours}</p>}
            </div>
            <p className="mt-2 max-w-sm text-paper/65">{o.address}</p>
            <EdLink href={o.mapsUrl} external track={`ed-maps-${o.id}`} className="mt-5">
              Buka di Maps
            </EdLink>
          </article>
        ))}
        <div className="w-1 shrink-0" aria-hidden />
      </div>
    </section>
  );
}
