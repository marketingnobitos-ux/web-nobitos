// Bagian kecil yang dipakai bersama halaman template Dadak (Pecel Lele Sambel Dadak Aminoto).
import Link from "next/link";
import { AMINOTO, AMINOTO_IMAGES, type AminotoImage } from "@/data/brands/aminoto";
import { trackName } from "@/lib/track";

/** Navigasi utama (logo = Beranda). */
export const DADAK_NAV = [
  { href: "/", label: "Beranda" },
  { href: "/cerita", label: "Cerita" },
  { href: "/cabang", label: "Cabang" },
];

/** Lebar konten & gutter (16px di HP). */
export const WRAP = "mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-10";

/** Warna gelap section (hijau tua pekat) & teks krem. */
export const DEEP = "bg-[var(--dk-deep)] text-[var(--dk-cream)]";

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

/** Foto biasa. `priority` untuk foto LCP. */
export function Img({ image, className = "", priority = false, width = 600, height = 800 }: { image: AminotoImage; className?: string; priority?: boolean; width?: number; height?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image.src}
      alt={image.alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={`object-cover ${className}`}
    />
  );
}

/** Label kecil kapital di atas judul. */
export function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`dk-caps text-[13px] font-medium ${className}`}>{children}</p>;
}

type BtnProps = { href: string; track?: string; variant?: "lime" | "cream" | "line"; arrow?: boolean; className?: string; children: React.ReactNode };

/** Tombol persegi (link internal). */
export function Btn({ href, track, variant = "lime", arrow = true, className = "", children }: BtnProps) {
  return (
    <Link href={href} data-track={track} className={`dk-btn dk-btn-${variant} ${className}`}>
      {children}
      {arrow && <ArrowIcon />}
    </Link>
  );
}

/**
 * Hero foto penuh dengan judul kondensed di tengah (Beranda: tinggi layar; halaman lain: lebih pendek).
 * Foto digelapkan gradasi hijau tua supaya teks terbaca; HP memakai potongan portrait kalau ada.
 */
export function PageHero({
  image,
  title,
  sub,
  tall = false,
  children,
}: {
  image: AminotoImage;
  title: string;
  sub?: string;
  tall?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby="page-title"
      className={`relative isolate flex items-end overflow-hidden ${DEEP} ${
        tall ? "min-h-[600px] h-[92svh] max-h-[880px]" : "min-h-[440px] h-[62svh] max-h-[600px]"
      }`}
    >
      <picture>
        {image.srcHp && <source media="(max-width: 767px)" srcSet={image.srcHp} />}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.src} alt={image.alt} width={1080} height={720} fetchPriority="high" decoding="async" className="absolute inset-0 -z-20 h-full w-full object-cover" />
      </picture>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(10_34_25/0.55)_0%,rgb(10_34_25/0.25)_38%,rgb(10_34_25/0.88)_100%)]" />
      <div className={`${WRAP} pb-14 pt-36 text-center md:pb-20`}>
        <h1 id="page-title" className={`dk-display mx-auto max-w-[14ch] ${tall ? "text-[clamp(52px,8.6vw,124px)]" : "text-[clamp(46px,7vw,96px)]"}`}>
          {title}
        </h1>
        {sub && <p className="dk-caps mx-auto mt-5 max-w-[34ch] text-[15px] font-medium leading-snug text-[var(--dk-cream)]/90 sm:text-base">{sub}</p>}
        {children && <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>}
      </div>
    </section>
  );
}

/** Strip foto portrait dari tepi ke tepi. Desktop: satu baris penuh; HP: geser ke samping. */
export function PhotoStrip({ images = AMINOTO_IMAGES.strip }: { images?: AminotoImage[] }) {
  return (
    <div className="dk-strip flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 md:overflow-hidden md:px-2" role="group" aria-label="Foto suasana Aminoto">
      {images.map((img) => (
        <Img key={img.src} image={img} className="aspect-[3/4] w-[44vw] shrink-0 snap-start sm:w-[30vw] md:w-auto md:min-w-0 md:flex-1" />
      ))}
    </div>
  );
}

/** Penutup halaman: "SAMBALNYA [foto] LAGI DIULEK." di atas gradasi stabilo. */
export function ClosingCta() {
  const { closing } = AMINOTO;
  return (
    <section aria-label={`${closing.left} ${closing.right}`} className="dk-wash-cream">
      <div className={`${WRAP} grid items-center gap-8 py-20 text-center md:grid-cols-[1fr_auto_1fr] md:py-28`}>
        <p className="dk-display text-[clamp(44px,6vw,84px)] md:text-right">{closing.left}</p>
        <Img image={AMINOTO_IMAGES.ctaPiring} width={600} height={600} className="mx-auto aspect-[4/5] w-48 md:w-60" />
        <p className="dk-display text-[clamp(44px,6vw,84px)] md:text-left">{closing.right}</p>
        <div className="md:col-span-3">
          <Btn href="/cabang" track={trackName("cabang")} variant="line">
            {closing.cta}
          </Btn>
        </div>
      </div>
    </section>
  );
}

export function ArrowIcon({ className = "h-4 w-5" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
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
