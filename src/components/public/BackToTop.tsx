"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { smoothScrollTo } from "@/components/animations/SmoothScroll";

/** Tombol melayang "Kembali ke atas" setelah scroll cukup jauh. */
export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <m.button
          type="button"
          onClick={() => smoothScrollTo(0)}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-lg ring-1 ring-ink/10 hover:text-primary"
        >
          <span aria-hidden>↑</span> Kembali ke atas
        </m.button>
      )}
    </AnimatePresence>
  );
}
