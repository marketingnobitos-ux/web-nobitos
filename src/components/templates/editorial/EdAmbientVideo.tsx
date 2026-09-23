"use client";

import { useEffect, useRef } from "react";

/** Video latar tanpa suara yang berulang; berhenti untuk pengunjung yang memilih kurangi gerakan. */
export default function EdAmbientVideo({ src, poster, className }: { src: string; poster?: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) ref.current?.pause();
  }, []);

  return (
    <video ref={ref} className={className} src={src} poster={poster} autoPlay muted loop playsInline preload="metadata" aria-hidden />
  );
}
