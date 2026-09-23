"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MOTION_QUERIES, gsap } from "@/components/animations/gsap";
import { greetingFor } from "@/lib/greeting";
import { imageSrcSet } from "@/lib/image";

type Props = {
  title: string;
  subtitle?: string | null;
  imageUrl: string;
  /** Sapaan awal dari server (jam WIB); di browser diperbarui sesuai jam pengunjung. */
  greeting: string;
  sticker: string;
};

/** Bagi judul jadi maksimal 2 baris yang panjangnya seimbang (untuk animasi per baris). */
function toLines(title: string): string[] {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length < 2 || title.length <= 12) return [words.join(" ")];
  let best = 1;
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const diff = Math.abs(words.slice(0, i).join(" ").length - words.slice(i).join(" ").length);
    if (diff < bestDiff) [best, bestDiff] = [i, diff];
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
}

/**
 * Hero layar penuh: foto full-bleed + overlay gelap di bawah, sapaan sesuai waktu,
 * judul raksasa muncul per baris (CSS, tidak menunggu JS), stiker berputar, parallax pelan.
 */
export default function HeroSection({ title, subtitle, imageUrl, greeting: initialGreeting, sticker }: Props) {
  const root = useRef<HTMLElement>(null);
  const [greeting, setGreeting] = useState(initialGreeting);

  useEffect(() => setGreeting(greetingFor(new Date().getHours())), []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    const parallax = (strength: number) => {
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } })
        .to(el.querySelector("[data-hero-media]"), { yPercent: strength, ease: "none" }, 0)
        .to(el.querySelector("[data-hero-content]"), { yPercent: -strength * 0.8, opacity: 0.2, ease: "none" }, 0)
        .to(el.querySelector("[data-hero-sticker]"), { rotate: 120, yPercent: -40, ease: "none" }, 0);
    };
    mm.add(MOTION_QUERIES.desktop, () => parallax(22));
    mm.add(MOTION_QUERIES.mobile, () => parallax(12));
    return () => mm.revert();
  }, []);

  const lines = toLines(title);
  const afterTitle = lines.length * 110 + 450;

  return (
    <section ref={root} className="relative isolate flex h-svh min-h-[600px] items-end overflow-hidden bg-ink text-paper">
      <div data-hero-media className="absolute inset-0 -z-10 will-change-transform">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          srcSet={imageSrcSet(imageUrl)}
          sizes="100vw"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="h-[115%] w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/70 to-transparent" />
      </div>

      <div data-hero-content className="mx-auto w-full max-w-[1400px] px-4 pb-10 sm:px-6 md:pb-14">
        <p className="fade-up-in mb-4 text-lg sm:text-2xl" style={{ "--delay": "80ms" } as React.CSSProperties}>
          <span suppressHydrationWarning>{greeting}</span>,{" "}
          <span className="font-semibold text-accent">lapar?</span>
        </p>

        <h1 className="display max-w-5xl text-[clamp(48px,9vw,128px)] leading-[0.95]" aria-label={title}>
          {lines.map((line, i) => (
            <span key={i} className="line-mask" aria-hidden>
              <span style={{ "--i": i } as React.CSSProperties}>{line}</span>
            </span>
          ))}
        </h1>

        <div
          className="fade-up-in mt-6 flex flex-col gap-6 md:mt-8 md:flex-row md:items-end md:justify-between"
          style={{ "--delay": `${afterTitle}ms` } as React.CSSProperties}
        >
          {subtitle && <p className="max-w-md text-base text-paper/80 sm:text-lg">{subtitle}</p>}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/menu"
              data-track="cta-lihat-menu"
              className="inline-flex h-13 items-center rounded-full bg-paper px-7 font-semibold text-ink transition hover:bg-paper/85"
            >
              Lihat menu
            </Link>
            <Link
              href="/cabang"
              data-track="cta-cari-cabang"
              className="inline-flex h-13 items-center rounded-full border border-paper/50 px-7 font-semibold transition hover:bg-paper hover:text-ink"
            >
              Cari cabang
            </Link>
          </div>
        </div>
      </div>

      <div
        data-hero-sticker
        className="absolute right-4 top-24 w-24 sm:right-8 sm:top-28 sm:w-32 md:right-[8%] md:top-1/4 md:w-40"
        aria-hidden
      >
        <Sticker text={sticker} />
      </div>

      <div className="pointer-events-none absolute bottom-0 right-6 hidden h-16 w-px overflow-hidden md:block" aria-hidden>
        <span className="scroll-line block h-full w-full bg-paper/70" />
      </div>
    </section>
  );
}

/** Stiker bulat: teks melingkar berputar pelan, bintang cabai di tengah. */
export function Sticker({ text, className = "bg-accent" }: { text: string; className?: string }) {
  // Ulang teks sampai cukup panjang, lalu atur jarak huruf supaya pas satu lingkaran
  // (keliling ±452 unit; lebar rata-rata huruf kapital Bricolage 800 ±9.5 unit di ukuran font 18).
  const once = `${text.toUpperCase()} • `;
  const label = once.repeat(Math.max(1, Math.round(26 / once.length)));
  const spacing = Math.max(0, (452 - label.length * 9.5) / label.length);
  // Id dari teks (bukan useId) supaya sama persis di server & browser; teks sama = path sama.
  const pathId = `sticker-${text.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className={`relative aspect-square rounded-full text-paper shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] ${className}`}>
      <svg viewBox="0 0 200 200" className="spin-slow absolute inset-0 h-full w-full">
        <defs>
          <path id={pathId} d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
        </defs>
        <text className="font-display" fontSize="18" fontWeight="800" letterSpacing={spacing.toFixed(2)} fill="currentColor">
          <textPath href={`#${pathId}`}>
            {label}
          </textPath>
        </text>
      </svg>
      <svg viewBox="0 0 24 24" className="absolute left-1/2 top-1/2 h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2" fill="currentColor">
        <path d="M17.5 3.5c-.4-.6-1.3-.5-1.5.2-.3.8-.9 1.4-1.7 1.6-4.6 1.2-8.6 5.2-10.5 10.6-.4 1.2-.9 2.4-1.6 3.4-.5.7.1 1.6.9 1.4 7.4-1.8 13-7 14.6-13.7.2-.9-.1-2.2-.2-3.5Z" />
        <path d="M18.6 5.2c1.1-.9 2.3-1.2 3.4-1" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}
