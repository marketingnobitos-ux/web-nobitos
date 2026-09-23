"use client";

import { useEffect, useRef, useState } from "react";
import { MOTION_QUERIES, gsap } from "@/components/animations/gsap";
import EdLink from "@/components/templates/editorial/EdLink";
import { imageSrcSet } from "@/lib/image";

type Props = {
  title: string;
  subtitle?: string | null;
  imageUrl: string;
  videoUrl?: string | null;
  primary: { href: string; label: string; external?: boolean };
  secondary?: { href: string; label: string; external?: boolean };
};

/**
 * Hero sinematik: video (kalau ada) atau foto suasana layar penuh, overlay maroon tipis,
 * judul besar yang muncul pelan (CSS), 1–2 link teks. Gambar sedikit membesar-mengecil saat scroll.
 * Video potret (rekaman HP): di HP tampil penuh; di layar lebar tampil sebagai panel tegak di kanan
 * dengan versi blur dari video yang sama sebagai latar.
 */
export default function EdHero({ title, subtitle, imageUrl, videoUrl, primary, secondary }: Props) {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const panel = useRef<HTMLVideoElement>(null);
  const [portrait, setPortrait] = useState(false);

  // Metadata video bisa sudah termuat sebelum hydration (onLoadedMetadata terlewat), jadi cek juga saat mount.
  useEffect(() => {
    const v = video.current;
    if (v && v.readyState >= 1) setPortrait(v.videoHeight > v.videoWidth);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    // Video tidak diputar untuk pengunjung yang memilih kurangi gerakan.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.current?.pause();
      panel.current?.pause();
    }
    const mm = gsap.matchMedia();
    mm.add(`${MOTION_QUERIES.desktop}, ${MOTION_QUERIES.mobile}`, () => {
      gsap.fromTo(
        el.querySelector("[data-ed-media]"),
        { scale: 1.08 },
        { scale: 1, yPercent: 8, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } },
      );
    });
    return () => mm.revert();
  }, [portrait]);

  return (
    <section ref={root} className="relative isolate flex h-svh min-h-[560px] items-end overflow-hidden bg-ink text-paper">
      <div data-ed-media className="absolute inset-0 -z-10 will-change-transform">
        {videoUrl ? (
          <video
            ref={video}
            className={`h-full w-full object-cover transition-[filter,opacity] duration-700 ${portrait ? "md:scale-110 md:opacity-70 md:blur-2xl" : ""}`}
            onLoadedMetadata={(e) => setPortrait(e.currentTarget.videoHeight > e.currentTarget.videoWidth)}
            src={videoUrl}
            poster={imageUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} srcSet={imageSrcSet(imageUrl)} sizes="100vw" alt="" fetchPriority="high" className="h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-ink/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/30" />
      </div>

      <div
        className={`mx-auto grid w-full max-w-[1440px] gap-10 px-5 pb-12 sm:px-8 md:grid-cols-12 md:items-end md:px-12 md:pb-16 ${
          portrait ? "md:grid-rows-[1fr_auto]" : ""
        }`}
      >
        {portrait && videoUrl && (
          <div className="hidden md:col-span-5 md:col-start-8 md:row-span-2 md:flex md:justify-end md:self-end">
            <video
              ref={panel}
              className="ed-rise aspect-[9/16] h-[min(72svh,760px)] w-auto object-cover shadow-2xl shadow-ink-deep/60"
              style={{ "--delay": "300ms" } as React.CSSProperties}
              src={videoUrl}
              poster={imageUrl}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden
            />
          </div>
        )}
        <div className={portrait ? "md:col-span-7 md:row-start-1 md:self-end" : "md:col-span-8"}>
          <h1 className="ed-title ed-rise text-[clamp(44px,7.5vw,120px)]" style={{ "--delay": "150ms" } as React.CSSProperties}>
            {title}
          </h1>
          {subtitle && (
            <p className="ed-rise mt-6 max-w-md text-lg text-paper/80" style={{ "--delay": "650ms" } as React.CSSProperties}>
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={`ed-rise flex flex-col items-start gap-3 text-lg ${portrait ? "md:col-span-7 md:row-start-2" : "md:col-span-4 md:items-end"}`}
          style={{ "--delay": "950ms" } as React.CSSProperties}
        >
          <EdLink href={primary.href} external={primary.external} track="ed-hero-primary">
            {primary.label}
          </EdLink>
          {secondary && (
            <EdLink href={secondary.href} external={secondary.external} track="ed-hero-secondary">
              {secondary.label}
            </EdLink>
          )}
        </div>
      </div>
    </section>
  );
}
