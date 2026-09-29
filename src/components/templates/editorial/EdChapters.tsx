"use client";

import { useEffect, useRef } from "react";
import { MOTION_QUERIES, gsap } from "@/components/animations/gsap";
import { imageSrcSet } from "@/lib/image";

export type Chapter = { title: string; body: string; image: string };

/**
 * Cerita & proses: section di-pin (sticky), babak berganti saat scroll seperti timeline proses.
 * Kiri foto suasana (crossfade), kanan nomor babak + judul + isi + garis progres.
 * Reduced-motion / tanpa JS: semua babak tampil berurutan tanpa pin.
 */
export default function EdChapters({ heading, chapters }: { heading: string; chapters: Chapter[] }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || chapters.length < 2) return;
    const mm = gsap.matchMedia();
    mm.add(`${MOTION_QUERIES.desktop}, ${MOTION_QUERIES.mobile}`, () => {
      const texts = gsap.utils.toArray<HTMLElement>("[data-ch-text]", el);
      const images = gsap.utils.toArray<HTMLElement>("[data-ch-img]", el);
      const counter = el.querySelector<HTMLElement>("[data-ch-count]");
      gsap.set([...texts.slice(1), ...images.slice(1)], { autoAlpha: 0 });
      gsap.set(texts.slice(1), { y: 40 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            if (!counter) return;
            const idx = Math.min(chapters.length - 1, Math.floor(self.progress * chapters.length));
            counter.textContent = String(idx + 1).padStart(2, "0");
          },
        },
      });
      tl.fromTo(el.querySelector("[data-ch-progress]"), { scaleX: 1 / chapters.length }, { scaleX: 1, ease: "none", duration: chapters.length - 1 }, 0);
      for (let i = 1; i < chapters.length; i++) {
        tl.to(texts[i - 1], { autoAlpha: 0, y: -40, duration: 0.5, ease: "power2.inOut" }, i - 0.5)
          .to(images[i - 1], { autoAlpha: 0, duration: 0.6, ease: "none" }, i - 0.5)
          .to(images[i], { autoAlpha: 1, duration: 0.6, ease: "none" }, i - 0.5)
          .to(texts[i], { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, i - 0.2);
      }
      tl.to({}, { duration: 0.3 });
    });
    return () => mm.revert();
  }, [chapters.length]);

  const total = String(chapters.length).padStart(2, "0");

  return (
    <section
      ref={root}
      aria-label={heading}
      className="relative bg-paper motion-safe:h-[calc(100svh*var(--n))]"
      style={{ "--n": Math.max(1.5, chapters.length * 0.9) } as React.CSSProperties}
    >
      <div className="motion-safe:sticky motion-safe:top-0 motion-safe:h-svh">
        <div className="mx-auto grid h-full max-w-[1440px] gap-8 px-5 py-20 sm:px-8 md:grid-cols-12 md:items-center md:gap-12 md:px-12 motion-safe:py-16 md:motion-safe:py-0">
          {/* Foto: semua ditumpuk; GSAP mengatur yang terlihat. */}
          <div className="relative h-[38svh] overflow-hidden md:col-span-6 md:h-[76svh] motion-reduce:hidden">
            {chapters.map((c, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                data-ch-img
                src={c.image}
                srcSet={imageSrcSet(c.image)}
                sizes="(min-width: 768px) 50vw, 100vw"
                alt={c.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover motion-safe:[&:not(:first-child)]:opacity-0"
              />
            ))}
          </div>

          <div className="md:col-span-5 md:col-start-8">
            <p className="text-sm text-ink/55">{heading}</p>
            <div className="mt-2 flex items-baseline gap-2 tabular-nums motion-reduce:hidden" aria-hidden>
              <span data-ch-count className="ed-title text-[clamp(40px,5vw,72px)]">
                01
              </span>
              <span className="text-ink/45">/ {total}</span>
            </div>

            <div className="mt-8 grid motion-reduce:gap-12">
              {chapters.map((c, i) => (
                <div key={i} data-ch-text className="[grid-area:1/1] motion-safe:[&:not(:first-child)]:opacity-0 motion-reduce:[grid-area:auto]">
                  <h3 className="ed-title text-[clamp(28px,3.2vw,48px)]">{c.title}</h3>
                  {c.body && <p className="mt-5 max-w-md text-lg leading-relaxed text-ink/70">{c.body}</p>}
                </div>
              ))}
            </div>

            <div className="mt-12 h-px w-full bg-ink/15 motion-reduce:hidden" aria-hidden>
              <div data-ch-progress className="h-full origin-left bg-ink" style={{ transform: `scaleX(${1 / chapters.length})` }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
