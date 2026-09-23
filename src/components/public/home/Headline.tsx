"use client";

import { m } from "framer-motion";

type Props = {
  /** Baris dipisah "|"; kata di antara *bintang* jadi serif miring. Contoh: "Lagi pengen|*apa*?" */
  text: string;
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
};

/** Pecah "*kata*" jadi potongan biasa & penekanan. */
function renderLine(line: string) {
  return line.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith("*") && part.endsWith("*") ? <em key={i}>{part.slice(1, -1)}</em> : part,
  );
}

const line = {
  hidden: { y: "105%" },
  show: (i: number) => ({ y: 0, transition: { duration: 0.9, ease: [0.2, 0.75, 0.15, 1] as const, delay: i * 0.09 } }),
};

/**
 * Judul display raksasa: tiap baris naik dari balik mask saat judul masuk layar.
 * Yang dipantau judulnya (bukan baris), karena baris yang tersembunyi di balik mask
 * tidak pernah terhitung "terlihat" oleh IntersectionObserver.
 */
export default function Headline({ text, as = "h2", id, className = "" }: Props) {
  const Tag = m[as];
  const lines = text.split("|");
  return (
    <Tag
      id={id}
      className={`display ${className}`}
      aria-label={text.replace(/\*/g, "").replace(/\|/g, " ")}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    >
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em] -mb-[0.06em]" aria-hidden>
          <m.span className="block" data-reveal variants={line} custom={i}>
            {renderLine(l)}
          </m.span>
        </span>
      ))}
    </Tag>
  );
}
