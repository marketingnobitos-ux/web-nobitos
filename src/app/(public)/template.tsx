"use client";

import { useEffect } from "react";
import { m } from "framer-motion";

// Halaman pertama tidak dianimasikan (supaya LCP tidak tertunda); perpindahan berikutnya fade-up.
let hasNavigated = false;

export default function PublicTemplate({ children }: { children: React.ReactNode }) {
  const animate = hasNavigated;
  useEffect(() => {
    hasNavigated = true;
  }, []);

  return (
    <m.div
      initial={animate ? { opacity: 0, y: 14 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </m.div>
  );
}
