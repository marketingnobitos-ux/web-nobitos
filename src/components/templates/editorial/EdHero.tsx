"use client";

import { useEffect, useRef } from "react";
import { MOTION_QUERIES, gsap } from "@/components/animations/gsap";
import EdLink from "@/components/templates/editorial/EdLink";
import { imageSrcSet, repoWebp } from "@/lib/image";
import { altText } from "@/lib/site";

type Props = {
  title: string;
  subtitle?: string | null;
  imageUrl: string;
  videoUrl?: string | null;
  primary: { href: string; label: string; external?: boolean; track: string };
  secondary?: { href: string; label: string; external?: boolean; track: string };
};

/**
 * Hero sinematik: video (kalau ada) atau foto suasana layar penuh di semua ukuran layar,
 * overlay maroon tipis, judul besar yang muncul pelan (CSS), 1–2 link teks.
 * Media sedikit membesar-mengecil saat scroll.
 */
export default function EdHero({ title, subtitle, imageUrl, videoUrl, primary, secondary }: Props) {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    // Video tidak diputar untuk pengunjung yang memilih kurangi gerakan.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) video.current?.pause();
    const mm = gsap.matchMedia();
    mm.add(`${MOTION_QUERIES.desktop}, ${MOTION_QUERIES.mobile}`, () => {
      gsap.fromTo(
        el.querySelector("[data-ed-media]"),
        { scale: 1.08 },
        { scale: 1, yPercent: 8, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="relative isolate flex h-svh min-h-[560px] items-end overflow-hidden bg-ink text-paper">
      <div data-ed-media className="absolute inset-0 -z-10 will-change-transform">
        {videoUrl ? (
          <video
            ref={video}
            className="h-full w-full object-cover"
            src={videoUrl}
            poster={repoWebp(imageUrl)}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} srcSet={imageSrcSet(imageUrl)} sizes="100vw" alt={altText(subtitle, title)} fetchPriority="high" className="h-full w-full object-cover" />
        )}
        {/* Overlay tipis: video tetap jelas, teks di bawah tetap terbaca. */}
        <div className="absolute inset-0 bg-ink/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent via-45% to-ink/35" />
      </div>

      <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-5 pb-12 sm:px-8 md:grid-cols-12 md:items-end md:px-12 md:pb-16">
        <div className="md:col-span-8">
          <h1 className="ed-title ed-rise text-[clamp(44px,7.5vw,120px)]" style={{ "--delay": "150ms" } as React.CSSProperties}>
            {title}
          </h1>
          {subtitle && (
            <p className="ed-rise mt-6 max-w-md text-lg text-paper/85" style={{ "--delay": "650ms" } as React.CSSProperties}>
              {subtitle}
            </p>
          )}
        </div>
        <div
          className="ed-rise flex flex-col items-start gap-3 text-lg md:col-span-4 md:items-end"
          style={{ "--delay": "950ms" } as React.CSSProperties}
        >
          <EdLink href={primary.href} external={primary.external} track={primary.track}>
            {primary.label}
          </EdLink>
          {secondary && (
            <EdLink href={secondary.href} external={secondary.external} track={secondary.track}>
              {secondary.label}
            </EdLink>
          )}
        </div>
      </div>
    </section>
  );
}
