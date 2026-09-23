"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";

/** Framer Motion versi ringan (LazyMotion) + otomatis hormati prefers-reduced-motion. */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
