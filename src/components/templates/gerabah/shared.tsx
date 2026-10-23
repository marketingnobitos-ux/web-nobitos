// Bagian kecil yang dipakai bersama halaman template Gerabah (Ayam Panggang Wicaksono).
import Link from "next/link";
import type { GerabahPhoto } from "@/data/brands/apw-gerabah";

/** Navigasi utama. `icon` dipakai rail kiri (desktop). */
export const GERABAH_NAV = [
  { href: "/", label: "Beranda", icon: "home" },
  { href: "/menu", label: "Menu", icon: "menu" },
  { href: "/cerita", label: "Cerita", icon: "story" },
  { href: "/cabang", label: "Cabang", icon: "pin" },
] as const;

export type NavIconName = (typeof GERABAH_NAV)[number]["icon"];

/** Lebar konten & gutter (16px di HP). */
export const WRAP = "mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-10";

const harga = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });

/** 25000 -> "25.000". */
export function formatHarga(value: number): string {
  return harga.format(value);
}

/** Slug anchor kategori menu ("Menu Tambahan" -> "menu-tambahan"). */
export function categoryAnchor(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Foto biasa. `priority` untuk foto LCP. */
export function Photo({ photo, className = "", priority = false }: { photo: GerabahPhoto; className?: string; priority?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={photo.src}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding={priority ? undefined : "async"}
      className={`object-cover ${className}`}
    />
  );
}

/** Label kecil kapital di atas judul, dengan titik emas. */
export function Kicker({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`gr-caps flex items-center gap-2 ${className}`}>
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--gr-gold)]" />
      {children}
    </p>
  );
}

type PillProps = { href: string; track?: string; variant?: "line" | "gold" | "dark"; arrow?: boolean; external?: boolean; className?: string; children: React.ReactNode };

/** Tombol pil: link internal, atau tab baru kalau `external`. */
export function Pill({ href, track, variant = "line", arrow = true, external = false, className = "", children }: PillProps) {
  const cls = `gr-pill ${variant === "gold" ? "gr-pill-gold" : variant === "dark" ? "gr-pill-dark" : ""} ${className}`;
  const inner = (
    <>
      {children}
      {arrow && (external ? <ArrowUpRight /> : <ArrowIcon />)}
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" data-track={track} className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} data-track={track} className={cls}>
      {inner}
    </Link>
  );
}

/**
 * Pembuka halaman non-Beranda: papan blok warna (gerabah di kiri, asap di kanan) bergaris grid,
 * judul kapital lebar, dan sajian bulat melayang di kanan (opsional).
 */
export function BoardHero({
  kicker,
  title,
  lead,
  dish,
  aside,
}: {
  kicker: string;
  title: string[];
  lead?: string;
  dish?: GerabahPhoto;
  aside?: React.ReactNode;
}) {
  return (
    <section aria-labelledby="page-title" className="relative overflow-hidden bg-[var(--gr-slate)]">
      <div aria-hidden className="absolute inset-y-0 left-0 w-full bg-[var(--gr-clay)] md:w-[58%]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 bg-[var(--gr-leaf)] md:left-[58%] md:h-[34%]" />
      <div aria-hidden className="gr-lines pointer-events-none absolute inset-0" />
      <div className={`${WRAP} relative grid min-h-[480px] items-end gap-10 pb-16 pt-32 md:min-h-[560px] md:grid-cols-[58fr_42fr] md:pb-20 md:pt-36`}>
        <div className="relative z-[1]">
          <Kicker className="text-[var(--gr-cream)]/85">{kicker}</Kicker>
          <h1 id="page-title" className="gr-display mt-5 text-[clamp(52px,8vw,118px)]">
            {title.map((line) => (
              <span key={line} className="block">
                {line}{" "}
              </span>
            ))}
          </h1>
          {lead && <p className="mt-6 max-w-[46ch] text-[17px] leading-relaxed text-[var(--gr-cream)]/85">{lead}</p>}
        </div>
        <div className="relative z-[1] flex flex-col items-center gap-6 md:items-end">
          {dish && (
            <div className="gr-dish w-[min(70vw,340px)] md:w-[min(30vw,400px)]">
              <Photo photo={dish} priority className="gr-spin aspect-square w-full rounded-full !object-contain" />
            </div>
          )}
          {aside}
        </div>
      </div>
    </section>
  );
}

export function ArrowIcon({ className = "h-3.5 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path d="M0 6h18M13 1l5 5-5 5" />
    </svg>
  );
}

export function ArrowUpRight({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path d="M2 10L10 2M4 2h6v6" />
    </svg>
  );
}

/** Ikon garis untuk rail navigasi. */
export function NavIcon({ name, className = "h-5 w-5" }: { name: NavIconName; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {name === "home" && <path d="M4 11l8-6.5 8 6.5M6 9.5V19h12V9.5M10 19v-5h4v5" />}
      {name === "menu" && (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="12" r="4.5" />
        </>
      )}
      {name === "story" && <path d="M4 5.5c2.5-1 5.5-1 8 .5 2.5-1.5 5.5-1.5 8-.5V19c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5zM12 6v13.5" />}
      {name === "pin" && (
        <>
          <path d="M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 0 1 13 0c0 5.2-6.5 11-6.5 11z" />
          <circle cx="12" cy="10" r="2.4" />
        </>
      )}
    </svg>
  );
}

export function InstagramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TikTokIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" className={className}>
      <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M14 3c.4 2.6 2.2 4.4 5 4.6" />
    </svg>
  );
}
