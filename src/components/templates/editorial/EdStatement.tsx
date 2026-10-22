"use client";

import { useEffect, useRef } from "react";
import { withGsap } from "@/components/animations/lazy-gsap";

/**
 * Pernyataan pembuka: satu kalimat besar, posisi asimetris; kata-kata "menyala" bertahap
 * mengikuti scroll. Kata di antara *bintang* ditulis miring. Tanpa JS/reduced-motion: tampil penuh.
 */
export default function EdStatement({ text, label }: { text: string; label?: string }) {
  const root = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    return withGsap(({ MOTION_QUERIES, gsap }) => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_QUERIES.desktop}, ${MOTION_QUERIES.mobile}`, () => {
        gsap.fromTo(
          el.querySelectorAll("[data-word]"),
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: 0.8 },
          },
        );
      });
      return () => mm.revert();
    });
  }, []);

  // Pecah per kata; tandai kata yang berada di dalam *...* sebagai miring.
  let italic = false;
  const words = text.split(/\s+/).filter(Boolean).map((raw) => {
    const starts = raw.startsWith("*");
    const ends = raw.replace(/[.,!?;:]+$/, "").endsWith("*");
    if (starts) italic = true;
    const word = { text: raw.replace(/\*/g, ""), italic };
    if (ends) italic = false;
    return word;
  });

  return (
    <section className="bg-paper px-5 py-28 sm:px-8 md:px-12 md:py-44">
      <div className="mx-auto grid max-w-[1440px] gap-8 md:grid-cols-12">
        {label && <p className="text-sm text-ink/60 md:col-span-3 md:pt-4">{label}</p>}
        <p
          ref={root}
          className="ed-title text-[clamp(30px,4.4vw,68px)] leading-[1.12] md:col-span-9 md:col-start-4"
          aria-label={text.replace(/\*/g, "")}
        >
          {words.map((w, i) => (
            <span key={i} aria-hidden>
              <span data-word className={w.italic ? "italic" : undefined}>
                {w.text}
              </span>{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
