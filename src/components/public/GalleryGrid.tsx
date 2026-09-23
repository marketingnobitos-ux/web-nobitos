"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type GalleryPhotoItem = { id: string; imageUrl: string; caption: string | null };

// Grid foto + lightbox (Esc untuk tutup, panah kiri/kanan & swipe untuk navigasi).
export default function GalleryGrid({ photos }: { photos: GalleryPhotoItem[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [index, close, step]);

  const current = index === null ? null : photos[index];

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3">
        {photos.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setIndex(i)}
            className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 focus-visible:outline-2 focus-visible:outline-primary"
            aria-label={p.caption ? `Buka foto: ${p.caption}` : "Buka foto"}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.imageUrl}
              alt={p.caption ?? ""}
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {current && index !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Foto galeri"
          className="fixed inset-0 z-50 flex flex-col bg-black/90"
          onClick={close}
          onTouchStart={(e) => {
            touchX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <div className="flex items-center justify-between p-4 text-sm text-white">
            <span>
              {index + 1} / {photos.length}
            </span>
            <button
              type="button"
              onClick={close}
              className="rounded px-3 py-1 text-2xl leading-none hover:bg-white/10"
              aria-label="Tutup"
            >
              ×
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-4" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.imageUrl} alt={current.caption ?? ""} className="max-h-[75vh] max-w-full rounded object-contain" />
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="absolute left-2 hidden rounded-full bg-white/10 px-4 py-3 text-2xl text-white hover:bg-white/20 sm:block"
                  aria-label="Foto sebelumnya"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="absolute right-2 hidden rounded-full bg-white/10 px-4 py-3 text-2xl text-white hover:bg-white/20 sm:block"
                  aria-label="Foto berikutnya"
                >
                  ›
                </button>
              </>
            )}
          </div>
          {current.caption && <p className="p-4 text-center text-sm text-white/90">{current.caption}</p>}
        </div>
      )}
    </>
  );
}
