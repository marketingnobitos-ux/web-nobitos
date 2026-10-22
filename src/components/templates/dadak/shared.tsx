// Bagian kecil yang dipakai bersama halaman template Dadak (Pecel Lele Sambel Dadak Aminoto).
import Link from "next/link";
import type { AminotoImage } from "@/data/brands/aminoto";

/** Navigasi utama. */
export const DADAK_NAV = [
  { href: "/", label: "Beranda" },
  { href: "/menu", label: "Menu" },
  { href: "/cerita", label: "Cerita" },
  { href: "/cabang", label: "Cabang" },
];

/** Lebar konten & gutter (16px di HP). */
export const WRAP = "mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8";

const harga = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });

/** 18000 -> "18.000". */
export function formatHarga(value: number): string {
  return harga.format(value);
}

/** Slug anchor kategori menu ("Sambal & Sayur" -> "sambal-sayur"). */
export function categoryAnchor(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Teks dengan *kata* yang distabilo. */
export function Marked({ text }: { text: string }) {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith("*") && part.endsWith("*") ? (
      <span key={i} className="dk-mark">
        {part.slice(1, -1)}
      </span>
    ) : (
      part
    ),
  );
}

/** Nama brand: "Aminoto" tebal + baris kecil "Pecel Lele · Sambel Dadak". */
export function Wordmark({ kicker, name, className = "" }: { kicker: string; name: string; className?: string }) {
  return (
    <span className={`flex flex-col leading-none ${className}`}>
      <span className="text-[1.35rem] font-bold tracking-tight">{name}</span>
      <span className="mt-1 whitespace-nowrap text-[0.6rem] font-medium uppercase tracking-[0.16em] opacity-70">{kicker}</span>
    </span>
  );
}

/** Foto biasa (sudut bulat diatur lewat className). `priority` untuk foto hero (LCP). */
export function Photo({ image, className = "", priority = false, sizes }: { image: AminotoImage; className?: string; priority?: boolean; sizes?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image.src}
      alt={image.alt}
      width={900}
      height={900}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={`object-cover ${className}`}
    />
  );
}

/** Foto makanan dalam piring bulat. */
export function Plate({ image, className = "", priority = false }: { image: { src: string; alt: string }; className?: string; priority?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image.src}
      alt={image.alt}
      width={720}
      height={720}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={`dk-plate ${className}`}
    />
  );
}

/** Tombol pil dengan bulatan panah stabilo (link internal). */
export function DkButton({ href, track, children, className = "" }: { href: string; track?: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} data-track={track} className={`dk-btn ${className}`}>
      {children}
      <span className="dk-btn-arrow">
        <ArrowIcon />
      </span>
    </Link>
  );
}

/** Judul section kecil di atas judul besar. */
export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-xs font-semibold uppercase tracking-[0.2em] text-ink/60 ${className}`}>{children}</p>;
}

export function ArrowIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function PinIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

export function ClockIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function PhoneIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    </svg>
  );
}

export function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" />
      <path d="M9 9.5c0 2.5 2 5 5 5.5l1.2-1.2-1.7-.9-.8.8c-1-.4-2-1.4-2.4-2.4l.8-.8-.9-1.7z" />
    </svg>
  );
}

export function InstagramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TikTokIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" className={className}>
      <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M14 3c.4 2.6 2.2 4.4 5 4.6" />
    </svg>
  );
}
