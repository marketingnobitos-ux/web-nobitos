"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";
import { afterLoad } from "@/lib/after-load";

/** Event untuk gsap.ts: Lenis siap (sinkron ScrollTrigger) & pindah halaman (hitung ulang posisi trigger). */
export const LENIS_READY_EVENT = "lenis:ready";
export const ROUTE_CHANGE_EVENT = "route:change";

type LenisWindow = Window & { __lenis?: Lenis };

/**
 * Smooth scroll (Lenis), mati saat reduced-motion. Lenis diunduh setelah halaman selesai dimuat (tidak menunda LCP)
 * dan berjalan dengan loop-nya sendiri, jadi brand yang tidak memakai GSAP (mis. Anglo) tidak ikut mengunduh GSAP.
 * Template yang memakai ScrollTrigger menyinkronkan diri lewat gsap.ts.
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lenis: Lenis | undefined;
    let cancelled = false;
    const cancelLoad = afterLoad(() =>
      import("lenis").then(({ default: LenisClass }) => {
        if (cancelled) return;
        lenis = new LenisClass({ duration: 1.1, smoothWheel: true, autoRaf: true });
        (window as LenisWindow).__lenis = lenis;
        window.dispatchEvent(new Event(LENIS_READY_EVENT));
      }),
    );

    return () => {
      cancelled = true;
      cancelLoad();
      lenis?.destroy();
      delete (window as LenisWindow).__lenis;
    };
  }, []);

  // Pindah halaman: mulai dari atas & hitung ulang posisi trigger.
  useEffect(() => {
    const lenis = (window as LenisWindow).__lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    window.dispatchEvent(new Event(ROUTE_CHANGE_EVENT));
  }, [pathname]);

  return null;
}

/** Scroll halus ke posisi (dipakai tombol "Kembali ke atas"). */
export function smoothScrollTo(target: number | string) {
  const lenis = (window as LenisWindow).__lenis;
  if (lenis) lenis.scrollTo(target);
  else if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
}
