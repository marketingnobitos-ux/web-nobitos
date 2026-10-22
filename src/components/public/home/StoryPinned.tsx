"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { withGsap } from "@/components/animations/lazy-gsap";
import { imageSrcSet } from "@/lib/image";
import { trackName } from "@/lib/track";

type Props = { lines: string[]; body?: string | null; imageUrl: string };

/**
 * Cerita singkat: layout belah dua, foto dengan parallax, teks yang "menempel" (sticky)
 * dan berganti per baris saat scroll. Reduced-motion: semua baris tampil bertumpuk biasa.
 */
export default function StoryPinned({ lines, body, imageUrl }: Props) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    return withGsap(({ MOTION_QUERIES, ScrollTrigger, gsap }) => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_QUERIES.desktop}, ${MOTION_QUERIES.mobile}`, () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-story-line]", el);
        const counter = el.querySelector<HTMLElement>("[data-story-count]");
        gsap.set(items, { yPercent: 100, opacity: 0 });
        gsap.set(items[0], { yPercent: 0, opacity: 1 });

        // Satu timeline di-scrub sepanjang section: baris lama naik & hilang, baris baru masuk.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            onUpdate: (self) => {
              if (!counter) return;
              const idx = Math.min(items.length - 1, Math.floor(self.progress * items.length));
              counter.textContent = String(idx + 1).padStart(2, "0");
            },
          },
        });
        items.forEach((item, i) => {
          if (i === 0) return;
          tl.to(items[i - 1], { yPercent: -100, opacity: 0, duration: 1, ease: "power2.inOut" }, i)
            .to(item, { yPercent: 0, opacity: 1, duration: 1, ease: "power2.inOut" }, i);
        });
        tl.to({}, { duration: 0.6 });

        gsap.fromTo(
          el.querySelector("[data-story-img]"),
          { yPercent: -8, scale: 1.15 },
          { yPercent: 8, scale: 1.05, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
        );
        ScrollTrigger.refresh();
      });
      return () => mm.revert();
    });
  }, []);

  const total = String(lines.length).padStart(2, "0");

  return (
    <section
      ref={root}
      aria-label="Cerita dapur kami"
      className="relative bg-paper motion-safe:h-[calc(100svh*var(--steps))]"
      style={{ "--steps": Math.max(2, lines.length) } as React.CSSProperties}
    >
      <div className="grid gap-8 px-4 py-16 sm:px-6 motion-safe:sticky motion-safe:top-0 motion-safe:h-svh motion-safe:content-center motion-safe:py-6 md:grid-cols-2 md:motion-safe:py-0 md:gap-0 md:px-0">
        <div className="relative h-[38svh] overflow-hidden rounded-[1.75rem] md:h-full md:rounded-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-story-img
            src={imageUrl}
            srcSet={imageSrcSet(imageUrl)}
            sizes="(min-width: 768px) 50vw, 100vw"
            alt="Sambal diulek di cobek"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center md:px-12 lg:px-20">
          <p className="mb-4 text-lg font-semibold text-ink/60 md:text-xl">Tiap hari di dapur kita</p>
          {/* Semua baris di satu sel grid; GSAP yang mengatur baris mana yang terlihat. */}
          <div className="grid overflow-hidden motion-reduce:gap-2">
            {lines.map((line, i) => (
              <p
                key={i}
                data-story-line
                className="display text-[clamp(36px,5vw,72px)] leading-[1.05] [overflow-wrap:anywhere] [grid-area:1/1] motion-safe:[&:not(:first-child)]:opacity-0 motion-reduce:[grid-area:auto]"
              >
                {line.endsWith(".") ? (
                  <>
                    {line.slice(0, -1)}
                    <span className="text-accent">.</span>
                  </>
                ) : (
                  line
                )}
              </p>
            ))}
          </div>
          <p className="mt-4 text-sm tabular-nums text-ink/50 motion-reduce:hidden" aria-hidden>
            <span data-story-count>01</span> / {total}
          </p>
          {body && <p className="mt-6 max-w-md text-base text-ink/75 md:text-lg">{body}</p>}
          <Link
            href="/cerita"
            data-track={trackName("cerita")}
            className="mt-8 inline-flex w-fit items-center gap-3 border-b-2 border-ink pb-1 text-lg font-semibold transition hover:gap-5 hover:border-brand hover:text-brand"
          >
            Kenalan lebih dekat <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
