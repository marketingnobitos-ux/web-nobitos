"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { MOTION_QUERIES, gsap } from "@/components/animations/gsap";
import { imageSrcSet } from "@/lib/image";

type Props = {
  title: string;
  subtitle?: string | null;
  eyebrow: string;
  imageUrl?: string | null;
};

/**
 * Hero full-screen: foto besar + judul muncul kata per kata (CSS, tanpa menunggu JS)
 * + parallax saat scroll (GSAP ScrollTrigger, dimatikan saat reduced-motion).
 */
export default function HeroSection({ title, subtitle, eyebrow, imageUrl }: Props) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    const parallax = (strength: number) => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
      tl.to(el.querySelector("[data-hero-media]"), { yPercent: strength, scale: 1.08, ease: "none" }, 0).to(
        el.querySelector("[data-hero-content]"),
        { yPercent: -strength * 1.6, opacity: 0, ease: "none" },
        0,
      );
    };
    mm.add(MOTION_QUERIES.desktop, () => parallax(18));
    mm.add(MOTION_QUERIES.mobile, () => parallax(10));
    return () => mm.revert();
  }, []);

  const words = title.split(/\s+/).filter(Boolean);

  return (
    <section ref={root} className="relative isolate flex h-[calc(100svh-4rem)] min-h-[540px] items-center overflow-hidden bg-deep text-white md:h-[calc(100svh-7rem)]">
      <div data-hero-media className="absolute inset-0 -z-10 will-change-transform">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            srcSet={imageSrcSet(imageUrl)}
            sizes="100vw"
            alt=""
            fetchPriority="high"
            className="h-full w-full object-cover"
          />
        ) : (
          <HeroFallbackArt />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/70" />
      </div>

      <div data-hero-content className="mx-auto w-full max-w-5xl px-5 text-center">
        <p className="fade-up-in mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-white/85" style={{ "--delay": "50ms" } as React.CSSProperties}>
          {eyebrow}
        </p>
        <h1 className="font-display text-[clamp(2.4rem,7vw,5.5rem)] font-extrabold leading-[1.02] tracking-tight">
          {words.map((w, i) => (
            <span key={i}>
              <span className="word-mask">
                <span style={{ "--i": i } as React.CSSProperties}>{w}</span>
              </span>
              {i < words.length - 1 && " "}
            </span>
          ))}
        </h1>
        {subtitle && (
          <p
            className="fade-up-in mx-auto mt-6 max-w-2xl text-lg text-white/90 sm:text-xl"
            style={{ "--delay": `${words.length * 90 + 350}ms` } as React.CSSProperties}
          >
            {subtitle}
          </p>
        )}
        <div
          className="fade-up-in mt-9 flex flex-wrap justify-center gap-3"
          style={{ "--delay": `${words.length * 90 + 500}ms` } as React.CSSProperties}
        >
          <Link
            href="/menu"
            data-track="cta-lihat-menu"
            className="rounded-full bg-white px-7 py-3.5 text-sm font-bold text-ink shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Lihat Menu
          </Link>
          <Link
            href="/cabang"
            data-track="cta-cari-cabang"
            className="rounded-full border-2 border-white/80 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
          >
            Cari Cabang
          </Link>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center" aria-hidden>
        <span className="scroll-cue flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/70 pt-2">
          <span className="h-2 w-1 rounded-full bg-white" />
        </span>
      </div>
    </section>
  );
}

/** Latar hero kalau belum ada foto: gradasi warna brand + motif piring. */
function HeroFallbackArt() {
  return (
    <div className="relative h-full w-full bg-primary">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,color-mix(in_oklab,var(--color-accent)_60%,transparent),transparent_55%),radial-gradient(circle_at_85%_80%,color-mix(in_oklab,var(--color-primary)_40%,black),transparent_60%)]" />
      <svg className="absolute -right-24 top-1/2 h-[140%] -translate-y-1/2 opacity-15" viewBox="0 0 400 400" aria-hidden>
        <g fill="none" stroke="white" strokeWidth="2">
          <circle cx="200" cy="200" r="190" />
          <circle cx="200" cy="200" r="150" />
          <circle cx="200" cy="200" r="100" strokeDasharray="4 10" />
        </g>
      </svg>
    </div>
  );
}
