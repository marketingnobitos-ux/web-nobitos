"use client";

import { useEffect } from "react";

/**
 * Penggerak efek gulir template Dadak. Menulis progres gulir (0–1) ke variabel CSS `--p` pada elemen ber-atribut
 * `data-dk-fx`; CSS di tpl-dadak.css yang menerjemahkannya jadi gerak. Dibuat dengan JS (bukan CSS
 * animation-timeline) supaya jalan juga di Safari iPhone yang belum mendukung scroll-driven animation.
 *   data-dk-fx="top"    : 0 di puncak halaman → 1 setelah digulir 90% tinggi layar (hero).
 *   data-dk-fx="sticky" : 0 saat section menyentuh atas layar → 1 saat bagian sticky-nya habis (adegan cobek).
 * Pengguna "kurangi gerakan": hero tetap 0, adegan langsung di keadaan akhir (1).
 */
export default function DadakScrollFx() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-dk-fx]"));
    if (els.length === 0) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const update = () => {
      const vh = window.innerHeight;
      for (const el of els) {
        let p: number;
        if (el.dataset.dkFx === "top") {
          p = reduce ? 0 : window.scrollY / (vh * 0.9);
        } else {
          const r = el.getBoundingClientRect();
          p = reduce ? 1 : -r.top / Math.max(1, r.height - vh);
        }
        el.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(4));
      }
    };

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
