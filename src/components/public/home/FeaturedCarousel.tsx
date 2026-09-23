"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { m, useReducedMotion } from "framer-motion";
import { formatRupiah, slugify } from "@/lib/format";
import { imageSrcSet, imageVariant } from "@/lib/image";

export type FeaturedItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  portion: string | null;
  imageUrl: string | null;
  category: string;
};

const AUTOPLAY_MS = 4500;

/** Carousel menu andalan: swipe (scroll-snap), tombol panah, progress, autoplay yang tahu diri. */
export default function FeaturedCarousel({ items }: { items: FeaturedItem[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const paused = useRef(false);
  const reduceMotion = useReducedMotion();

  const step = useCallback((dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const width = (card?.offsetWidth ?? el.clientWidth * 0.8) + 16;
    const max = el.scrollWidth - el.clientWidth;
    if (dir === 1 && el.scrollLeft >= max - 4) el.scrollTo({ left: 0, behavior: "smooth" });
    else el.scrollBy({ left: dir * width, behavior: "smooth" });
  }, []);

  const onScroll = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 1);
    setAtStart(el.scrollLeft <= 4);
  }, []);

  // Autoplay: hanya saat terlihat, tab aktif, tidak di-hover/sentuh, dan tanpa reduced-motion.
  useEffect(() => {
    const el = track.current;
    if (!el || reduceMotion || items.length < 2) return;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    const id = setInterval(() => {
      if (visible && !paused.current && document.visibilityState === "visible") step(1);
    }, AUTOPLAY_MS);
    return () => {
      clearInterval(id);
      io.disconnect();
    };
  }, [items.length, reduceMotion, step]);

  useEffect(onScroll, [onScroll]);

  const pause = () => (paused.current = true);
  const resume = () => (paused.current = false);

  return (
    <div onMouseEnter={pause} onMouseLeave={resume} onFocusCapture={pause} onBlurCapture={resume} onTouchStart={pause}>
      <div
        ref={track}
        onScroll={onScroll}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-6 sm:scroll-px-[max(1.25rem,calc((100vw-72rem)/2))] sm:px-[max(1.25rem,calc((100vw-72rem)/2))]"
        aria-roledescription="carousel"
        aria-label="Menu andalan"
      >
        {items.map((item, i) => (
          <m.div
            key={item.id}
            data-card
            data-reveal
            className="w-[78%] shrink-0 snap-start sm:w-[44%] lg:w-[31%]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -5% 0px" }}
            transition={{ duration: 0.6, delay: Math.min(i, 4) * 0.08, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <MenuSlide item={item} />
          </m.div>
        ))}
      </div>

      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-ink/10" aria-hidden>
          <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${Math.max(progress, 0.08) * 100}%` }} />
        </div>
        <div className="flex gap-2">
          <ArrowButton label="Menu sebelumnya" disabled={atStart} onClick={() => step(-1)} dir="left" />
          <ArrowButton label="Menu berikutnya" disabled={items.length < 2} onClick={() => step(1)} dir="right" />
        </div>
      </div>
    </div>
  );
}

function MenuSlide({ item }: { item: FeaturedItem }) {
  return (
    <Link href={`/menu/${item.id}`} data-track={`menu-andalan-${slugify(item.name)}`} className="group block">
      <m.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-primary/15 shadow-sm"
      >
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageVariant(item.imageUrl, 1000)}
            srcSet={imageSrcSet(item.imageUrl)}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 44vw, 78vw"
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_25%,color-mix(in_oklab,var(--color-primary)_28%,white),color-mix(in_oklab,var(--color-primary)_12%,white))]">
            <span className="font-display text-8xl font-extrabold text-primary/35 transition duration-700 group-hover:scale-110">
              {item.name.charAt(0)}
            </span>
          </div>
        )}
        <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-ink shadow">{item.category}</span>
      </m.div>
      <div className="mt-4 px-1">
        <h3 className="font-display text-xl font-bold text-ink group-hover:text-primary">{item.name}</h3>
        {item.description && <p className="mt-1 line-clamp-2 text-sm text-ink/65">{item.description}</p>}
        <p className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-primary">{formatRupiah(item.price)}</span>
          {item.portion && <span className="text-xs text-ink/50">/ {item.portion}</span>}
        </p>
      </div>
    </Link>
  );
}

function ArrowButton({ label, disabled, onClick, dir }: { label: string; disabled: boolean; onClick: () => void; dir: "left" | "right" }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 bg-white text-ink shadow-sm transition hover:border-primary hover:text-primary disabled:opacity-35"
    >
      <svg viewBox="0 0 24 24" className={`h-5 w-5 ${dir === "left" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
        <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
