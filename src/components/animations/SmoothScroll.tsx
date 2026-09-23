"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { ScrollTrigger, gsap } from "@/components/animations/gsap";

/** Smooth scroll (Lenis) yang tersinkron dengan GSAP ScrollTrigger. Mati saat reduced-motion. */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    (window as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete (window as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  // Pindah halaman: mulai dari atas & hitung ulang posisi trigger.
  useEffect(() => {
    const lenis = (window as { __lenis?: Lenis }).__lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname]);

  return null;
}

/** Scroll halus ke posisi (dipakai tombol "Kembali ke atas"). */
export function smoothScrollTo(target: number | string) {
  const lenis = (window as { __lenis?: Lenis }).__lenis;
  if (lenis) lenis.scrollTo(target);
  else if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
}
