"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { MOTION_QUERIES, gsap } from "@/components/animations/gsap";
import { imageSrcSet, imageVariant } from "@/lib/image";

type Photo = { id: string; imageUrl: string; caption: string | null };

/** Teaser galeri: 3 kolom foto yang bergerak beda kecepatan saat scroll (desktop). */
export default function GalleryTeaser({ photos }: { photos: Photo[] }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_QUERIES.desktop, () => {
      el.querySelectorAll<HTMLElement>("[data-col]").forEach((col, i) => {
        const shift = [-10, 8, -6][i % 3];
        gsap.fromTo(col, { yPercent: -shift }, {
          yPercent: shift,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    });
    return () => mm.revert();
  }, []);

  const columns = [0, 1, 2].map((c) => photos.filter((_, i) => i % 3 === c));

  return (
    <div ref={root} className="grid grid-cols-2 gap-3 overflow-hidden py-4 md:grid-cols-3 md:gap-5 md:py-12">
      {columns.map((col, c) => (
        <div key={c} data-col className={`space-y-3 md:space-y-5 ${c === 2 ? "hidden md:block" : ""} ${c === 1 ? "md:pt-16" : ""}`}>
          {col.map((p, i) => (
            <Link
              key={p.id}
              href="/galeri"
              data-track="teaser-galeri"
              className={`group block overflow-hidden rounded-2xl bg-primary/10 ${i % 2 === 0 ? "aspect-[4/5]" : "aspect-square"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageVariant(p.imageUrl, 1000)}
                srcSet={imageSrcSet(p.imageUrl)}
                sizes="(min-width: 768px) 33vw, 50vw"
                alt={p.caption ?? ""}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
