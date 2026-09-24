"use client";

import { m } from "framer-motion";
import { imageSrcSet } from "@/lib/image";

const EASE = [0.16, 0.8, 0.2, 1] as const;

/**
 * Foto yang "terbuka" dari bawah saat masuk layar (clip-path), sementara isinya perlahan
 * mengecil dari zoom. Tanpa sudut membulat, sesuai gaya editorial.
 */
export default function EdRevealImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <m.div
      className={`relative overflow-hidden ${className}`}
      data-reveal
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 1.4, ease: EASE }}
    >
      <m.img
        src={src}
        srcSet={imageSrcSet(src)}
        sizes="(min-width: 768px) 50vw, 100vw"
        alt={alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
        initial={{ scale: 1.18 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        transition={{ duration: 2.2, ease: EASE }}
      />
    </m.div>
  );
}
