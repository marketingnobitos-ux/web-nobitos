"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { MOTION_QUERIES, gsap } from "@/components/animations/gsap";
import { imageSrcSet, imageVariant } from "@/lib/image";

type Props = { brandName: string; text: string; imageUrl?: string | null };

/**
 * Cerita singkat: kalimat besar yang "menyala" kata per kata mengikuti scroll,
 * plus foto dengan parallax halus. Tanpa JS / reduced-motion: teks langsung penuh.
 */
export default function StoryTeaser({ brandName, text, imageUrl }: Props) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    const run = (parallax: number) => {
      gsap.fromTo(
        el.querySelectorAll("[data-word]"),
        { opacity: 0.18 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: el.querySelector("[data-story-text]"), start: "top 80%", end: "bottom 45%", scrub: true },
        },
      );
      const img = el.querySelector("[data-story-img]");
      if (img) {
        gsap.fromTo(img, { yPercent: -parallax }, {
          yPercent: parallax,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
      }
    };
    mm.add(MOTION_QUERIES.desktop, () => run(8));
    mm.add(MOTION_QUERIES.mobile, () => run(4));
    return () => mm.revert();
  }, []);

  const words = text.split(/\s+/).filter(Boolean);

  return (
    <section ref={root} className="bg-white py-20 sm:py-28" aria-labelledby="story-title">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <div>
          <p id="story-title" className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-primary">
            Cerita {brandName}
          </p>
          <p data-story-text className="font-display text-[clamp(1.6rem,3.6vw,2.75rem)] font-bold leading-snug tracking-tight text-ink">
            {words.map((w, i) => (
              <span key={i} data-word>
                {w}
                {i < words.length - 1 && " "}
              </span>
            ))}
          </p>
          <Link
            href="/cerita"
            data-track="cta-lihat-cerita"
            className="mt-10 inline-flex items-center gap-2 rounded-full border-2 border-ink px-6 py-3 text-sm font-bold text-ink transition hover:bg-ink hover:text-white"
          >
            Baca cerita lengkap <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-primary/15">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              data-story-img
              src={imageVariant(imageUrl, 1000)}
              srcSet={imageSrcSet(imageUrl)}
              sizes="(min-width: 1024px) 40vw, 100vw"
              alt=""
              loading="lazy"
              className="absolute inset-0 h-[112%] w-full object-cover"
            />
          ) : (
            <div data-story-img className="absolute inset-0 flex items-center justify-center bg-primary">
              <span className="font-display text-[10rem] font-extrabold text-white/15">{brandName.charAt(0)}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
