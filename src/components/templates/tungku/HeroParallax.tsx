"use client";

import { useRef } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Parallax tipis untuk foto hero: foto turun pelan (maks. 10% tingginya) saat halaman di-scroll.
 * Mati saat prefers-reduced-motion. Wadah dibuat 110% tinggi supaya tidak ada celah di atas.
 */
export default function HeroParallax({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <m.div style={reduce ? undefined : { y }} className="absolute inset-x-0 -top-[10%] bottom-0 will-change-transform">
        {children}
      </m.div>
    </div>
  );
}
