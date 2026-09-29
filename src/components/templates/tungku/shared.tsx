// Bagian kecil yang dipakai bersama oleh halaman template Tungku (Ayam Panggang Wicaksono).
import Link from "next/link";
import { APW, APW_BRANCH } from "@/data/brands/apw";

/** Navigasi Tungku: urutan sesuai permintaan Fran (Beranda, Cerita, Menu, Cabang). */
export const TUNGKU_NAV = [
  { href: "/", label: "Beranda" },
  { href: "/cerita", label: "Cerita" },
  { href: "/menu", label: "Menu" },
  { href: "/cabang", label: "Cabang" },
];

/** Lebar konten & gutter (16px di HP). Konten sempit (±1100px) supaya terasa lega. */
export const WRAP = "mx-auto w-full max-w-[1120px] px-4 sm:px-6 md:px-8";

const harga = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });

/** 25000 -> "25.000" (gaya menu cetak, tanpa "Rp"). */
export function formatHarga(value: number): string {
  return harga.format(value);
}

/** Wilayah cabang untuk label ("Kesambi" -> "Kesambi, Cirebon"). */
export function branchArea(name: string): string {
  return name === APW_BRANCH.name ? APW_BRANCH.area : name;
}

/** Nama brand dua baris untuk header (desain Figma). Logo bulat asli dipakai di footer. */
export function Wordmark({ className = "" }: { className?: string }) {
  const [top, bottom] = APW.hero.lines;
  return (
    <span className={`tk-caps flex flex-col items-center leading-none ${className}`}>
      <span className="text-[0.56rem] tracking-[0.34em]">{top}</span>
      <span className="mt-1 text-[1.05rem] tracking-[0.2em]">{bottom}</span>
    </span>
  );
}

/** Foto dari APW_IMAGES (ukuran asli 720 px). `priority` untuk foto hero (LCP). */
export function Photo({
  image,
  className = "",
  priority = false,
}: {
  image: { src: string; alt: string };
  className?: string;
  priority?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image.src}
      alt={image.alt}
      width={720}
      height={900}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={`object-cover ${className}`}
    />
  );
}

/** Judul section: huruf kapital tipis, letter-spacing lebar. */
export function SectionTitle({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <h2 id={id} className={`tk-caps text-[clamp(26px,3vw,36px)] ${className}`}>
      {children}
    </h2>
  );
}

/** Tombol solid bersudut siku (link internal). */
export function TkButton({
  href,
  track,
  children,
  ghost = false,
  className = "",
}: {
  href: string;
  track?: string;
  children: React.ReactNode;
  ghost?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} data-track={track} className={`tk-btn ${ghost ? "tk-btn-ghost" : ""} ${className}`}>
      {children}
    </Link>
  );
}

/** Ikon Instagram garis (24px). */
export function InstagramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Ikon TikTok garis (24px). */
export function TikTokIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" className={className}>
      <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M14 3c.4 2.6 2.2 4.4 5 4.6" />
    </svg>
  );
}
