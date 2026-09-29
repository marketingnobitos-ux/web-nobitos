"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { MOTION_QUERIES, gsap } from "@/components/animations/gsap";
import Headline from "@/components/public/home/Headline";
import { imageSrcSet } from "@/lib/image";
import { altText } from "@/lib/site";
import { trackName } from "@/lib/track";

type Photo = { id: string; imageUrl: string; caption: string | null };

// Posisi & ukuran tiap foto (grid 12 kolom di desktop, 2 kolom di HP) + kecepatan parallax.
const SLOTS = [
  { cls: "col-span-2 aspect-[4/3] md:col-span-5 md:aspect-[4/5]", speed: -6 },
  { cls: "aspect-[3/4] md:col-span-4 md:mt-40 md:aspect-square", speed: 10 },
  { cls: "mt-10 aspect-[3/4] md:col-span-3 md:mt-16 md:aspect-[3/4]", speed: -12 },
  { cls: "aspect-square md:col-span-4 md:col-start-2 md:aspect-[4/3]", speed: 8 },
  { cls: "aspect-[3/4] md:col-span-3 md:mt-24 md:aspect-[3/4]", speed: -10 },
  { cls: "col-span-2 aspect-[16/10] md:col-span-4 md:mt-4 md:aspect-[4/5]", speed: 12 },
];

/** Kolase galeri: ukuran foto beda-beda, tiap foto bergerak dengan kecepatan parallax berbeda. */
export default function GalleryCollage({ photos }: { photos: Photo[] }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    const run = (factor: number) => {
      gsap.utils.toArray<HTMLElement>("[data-speed]", el).forEach((item) => {
        const speed = Number(item.dataset.speed) * factor;
        gsap.fromTo(
          item,
          { yPercent: speed },
          { yPercent: -speed, ease: "none", scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    };
    mm.add(MOTION_QUERIES.desktop, () => run(1));
    mm.add(MOTION_QUERIES.mobile, () => run(0.4));
    return () => mm.revert();
  }, []);

  return (
    <section aria-labelledby="gallery-title" className="overflow-hidden bg-paper py-20 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Headline id="gallery-title" text="Suasana warung kita" className="max-w-xl text-[clamp(32px,5vw,64px)]" />
          <p className="max-w-xs text-ink/70 lg:pb-3">Tenda digelar, wajan dipanasin, obrolan jalan terus sampai malam.</p>
        </div>

        <div ref={root} className="mt-14 grid grid-cols-2 gap-3 md:mt-20 md:grid-cols-12 md:gap-x-6 md:gap-y-16">
          {photos.slice(0, SLOTS.length).map((p, i) => (
            <figure key={p.id} data-speed={SLOTS[i].speed} className={`group relative overflow-hidden rounded-[1.25rem] bg-ink/10 ${SLOTS[i].cls}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.imageUrl}
                srcSet={imageSrcSet(p.imageUrl)}
                sizes="(min-width: 768px) 40vw, 50vw"
                alt={altText(p.caption, "Foto galeri")}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-105"
              />
              {p.caption && (
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-4 pt-10 text-sm text-paper opacity-100 transition-opacity duration-500 md:opacity-0 md:group-hover:opacity-100">
                  {p.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>

        <div className="mt-16 md:mt-24">
          <Link
            href="/galeri"
            data-track={trackName("galeri")}
            className="display inline-flex items-center gap-3 text-2xl transition-colors hover:text-brand md:text-3xl"
          >
            Lihat semua foto <span className="transition-transform group-hover:translate-x-2" aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
