"use client";

// Registrasi plugin GSAP sekali saja (client).
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";
import { LENIS_READY_EVENT, ROUTE_CHANGE_EVENT } from "@/components/animations/SmoothScroll";

gsap.registerPlugin(ScrollTrigger);

// Sinkron dengan smooth scroll Lenis (SmoothScroll.tsx). Modul ini hanya diunduh template yang memakai GSAP,
// jadi sinkronnya dipasang dari sini: Lenis yang sudah jalan, atau yang baru siap belakangan.
if (typeof window !== "undefined") {
  const linkLenis = () => (window as Window & { __lenis?: Lenis }).__lenis?.on("scroll", ScrollTrigger.update);
  linkLenis();
  window.addEventListener(LENIS_READY_EVENT, linkLenis);
  window.addEventListener(ROUTE_CHANGE_EVENT, () => requestAnimationFrame(() => ScrollTrigger.refresh()));
}

export { gsap, ScrollTrigger };

/** Kueri media standar untuk gsap.matchMedia(). */
export const MOTION_QUERIES = {
  desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
};
