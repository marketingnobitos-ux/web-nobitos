"use client";

import { useEffect } from "react";

/** Setelah waktu ini pengaman CSS (ag-failsafe, 2 detik) sudah memunculkan stiker; jangan dianimasikan ulang. */
const FAILSAFE_MS = 1900;

/** Tempel semua sisa stiker tanpa animasi (dipakai kalau animasi tidak bisa/tidak boleh jalan). */
function stickAll(els: HTMLElement[], instant: boolean) {
  els.forEach((el) => {
    if (instant) el.style.animation = "none";
    el.dataset.stuck = "";
  });
}

/**
 * Pasang di tiap halaman Anglo: elemen [data-stick] yang masuk layar diberi [data-stuck]
 * sehingga animasi "tempel" di globals.css berjalan. Elemen yang masuk bersamaan
 * ditempel bergiliran, arah putarnya bergantian.
 * Kalau apa pun gagal, semua stiker langsung ditampilkan (tidak boleh ada konten tersembunyi).
 */
export default function StickObserver() {
  useEffect(() => {
    const pending = [...document.querySelectorAll<HTMLElement>("[data-stick]:not([data-stuck])")];
    try {
      // Menandai observer aktif: mematikan pengaman 2 detik di CSS.
      document.documentElement.dataset.agStick = "";

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const late = performance.now() > FAILSAFE_MS && !document.documentElement.dataset.agStickReady;
      document.documentElement.dataset.agStickReady = "";
      if (reduce || late || !("IntersectionObserver" in window)) {
        // Hydrate lambat: pengaman sudah memunculkan stiker, jangan dibuat hilang lalu muncul lagi.
        stickAll(pending, late);
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
    } catch (error) {
      console.error("[anglo] animasi stiker dimatikan:", error);
      stickAll(pending, true);
    }
  }, []);

  return null;
}
