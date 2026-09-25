"use client";

import { useEffect } from "react";

/**
 * Pasang di tiap halaman Anglo: elemen [data-stick] yang masuk layar diberi [data-stuck]
 * sehingga animasi "tempel" di globals.css berjalan. Elemen yang masuk bersamaan
 * ditempel bergiliran, arah putarnya bergantian.
 */
export default function StickObserver() {
  useEffect(() => {
    const pending = [...document.querySelectorAll<HTMLElement>("[data-stick]:not([data-stuck])")];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      pending.forEach((el) => (el.dataset.stuck = ""));
      return;
    }

    let count = 0;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target as HTMLElement)
          .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
        visible.forEach((el, i) => {
          el.style.setProperty("--stick-delay", `${Math.min(i, 6) * 90}ms`);
          el.style.setProperty("--stick-from", `${count++ % 2 ? 8 : -8}deg`);
          el.dataset.stuck = "";
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -6% 0px" },
    );
    pending.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
