"use client";

import { useEffect, useRef } from "react";
import { repoWebp, saveData, videoForScreen } from "@/lib/image";

/**
 * Video latar tanpa suara yang berulang. Sumber dipasang di browser: salinan 720px di HP bila ada,
 * dan tidak diunduh sama sekali untuk pengunjung yang memilih kurangi gerakan atau mode hemat data (cukup poster).
 */
export default function EdAmbientVideo({ src, poster, className }: { src: string; poster?: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches || saveData()) return;
    v.src = videoForScreen(src);
    v.play().catch(() => {});
  }, [src]);

  return <video ref={ref} className={className} poster={poster && repoWebp(poster)} autoPlay muted loop playsInline preload="metadata" aria-hidden />;
}
