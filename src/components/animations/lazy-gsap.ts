"use client";

type GsapModule = typeof import("@/components/animations/gsap");

/**
 * Jalankan animasi GSAP di dalam useEffect dengan GSAP yang diunduh belakangan (`import()`).
 * Beranda semua brand berbagi satu chunk JS, jadi import GSAP statis di satu template membuat semua brand
 * ikut mengunduh GSAP + ScrollTrigger. Lewat helper ini GSAP hanya diunduh template yang benar-benar menjalankannya.
 * `setup` boleh mengembalikan fungsi pembersih (mis. `() => mm.revert()`); hasilnya dipakai sebagai cleanup efek.
 */
export function withGsap(setup: (g: GsapModule) => (() => void) | void): () => void {
  let cleanup: (() => void) | void;
  let cancelled = false;
  import("@/components/animations/gsap").then((g) => {
    if (!cancelled) cleanup = setup(g);
  });
  return () => {
    cancelled = true;
    cleanup?.();
  };
}
