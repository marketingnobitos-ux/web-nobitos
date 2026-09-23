"use client";

import { m } from "framer-motion";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Jarak geser awal (px). */
  y?: number;
  as?: "div" | "section" | "li" | "article";
};

/**
 * Fade-up pendek saat elemen masuk viewport (sekali saja).
 * Tanpa JS, <NoScriptReveal /> di layout membuat elemen tetap terlihat.
 */
export default function Reveal({ children, className, delay = 0, y = 24, as = "div" }: Props) {
  const Tag = m[as];
  return (
    <Tag
      className={className}
      data-reveal
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1], delay }}
    >
      {children}
    </Tag>
  );
}

/** Pasang sekali di layout: kalau JS mati, semua elemen reveal langsung tampil. */
export function NoScriptReveal() {
  return (
    <noscript>
      <style>{"[data-reveal]{opacity:1!important;transform:none!important}[data-story-line],[data-ch-text]{grid-area:auto!important;opacity:1!important}"}</style>
    </noscript>
  );
}
