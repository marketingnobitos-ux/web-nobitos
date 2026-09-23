/** Pita warna aksen dengan teks yang terus berjalan (CSS murni, berhenti saat reduced-motion). */
export default function Marquee({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  // Gandakan isi supaya pita cukup panjang untuk layar lebar, lalu dua salinan untuk loop mulus.
  const base = items.length < 6 ? [...items, ...items, ...items] : items;
  const duration = Math.max(24, base.join("").length * 0.35);

  const Row = ({ hidden }: { hidden?: boolean }) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {base.map((item, i) => (
        <li key={i} className="flex items-center">
          <span className="px-5 md:px-8">{item}</span>
          <svg viewBox="0 0 24 24" className="h-[0.5em] w-[0.5em] shrink-0 text-ink" fill="currentColor" aria-hidden>
            <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
          </svg>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="relative z-10 -my-3 overflow-hidden py-3" aria-label={items.join(", ")}>
      <div className="marquee -rotate-2 scale-[1.04] bg-accent py-4 text-paper md:py-5">
        <div className="marquee-track display text-[1.9rem] uppercase leading-none tracking-[-0.01em] md:text-[2.8rem]" style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}>
          <Row />
          <Row hidden />
        </div>
      </div>
    </div>
  );
}
