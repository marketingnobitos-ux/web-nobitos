import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Bricolage_Grotesque, Courier_Prime, DM_Sans, Instrument_Sans, M_PLUS_Rounded_1c, Nunito_Sans, Space_Mono } from "next/font/google";
import { preload } from "react-dom";
import MotionProvider from "@/components/animations/MotionProvider";
import { NoScriptReveal } from "@/components/animations/Reveal";
import SmoothScroll from "@/components/animations/SmoothScroll";
import BackToTop from "@/components/public/BackToTop";
import BrandFooter from "@/components/public/BrandFooter";
import BrandHeader from "@/components/public/BrandHeader";
import AngloFooter from "@/components/templates/anglo/AngloFooter";
import AngloHeader from "@/components/templates/anglo/AngloHeader";
import { StickerDefs } from "@/components/templates/anglo/illustrations";
import EditorialFooter from "@/components/templates/editorial/EditorialFooter";
import TungkuFooter from "@/components/templates/tungku/TungkuFooter";
import TungkuHeader from "@/components/templates/tungku/TungkuHeader";
import EditorialHeader from "@/components/templates/editorial/EditorialHeader";
import Tracker from "@/components/public/Tracker";
import { getActiveBrand, requireActiveBrand } from "@/lib/active-brand";
import { darkTones } from "@/lib/color";
import { ogImage, siteOrigin } from "@/lib/seo";

// Judul: sans tebal yang bulat & ramah; teks: DM Sans.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
  variable: "--font-bricolage",
});
const dmSans = DM_Sans({ subsets: ["latin"], display: "swap", variable: "--font-dm-sans" });
// Template Editorial: satu keluarga sans geometris, italic untuk penekanan.
const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument-sans",
});
// Template Anglo (kertas & zine): label/harga mesin ketik, paragraf Courier. Tidak di-preload supaya brand lain
// tidak ikut mengunduh. Font judul spidol (Caveat Brush) di-self-host di globals.css & di-preload hanya untuk Anglo.
const ANGLO_MARKER_FONT = "/brands/bakmi-pak-joko/fonts/caveat-brush-latin.woff2";
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap", preload: false, variable: "--font-space-mono" });
const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
  variable: "--font-courier-prime",
});

// Template Tungku (APW): judul M PLUS Rounded 1c 300 (tipis), tombol 400, isi Nunito Sans 300–400. Tidak di-preload supaya
// brand lain tidak ikut mengunduh.
const mplusRounded = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
  preload: false,
  variable: "--font-mplus-rounded",
});
const nunitoSans = Nunito_Sans({ subsets: ["latin"], weight: ["300", "400"], display: "swap", preload: false, variable: "--font-nunito-sans" });

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getActiveBrand();
  if (!brand) return {};
  // Default untuk halaman tanpa metadata sendiri. Canonical sengaja tidak di sini (tiap halaman menulis miliknya, lib/seo).
  const image = ogImage(brand);
  return {
    metadataBase: await siteOrigin(brand.id),
    title: { default: brand.name, template: `%s · ${brand.name}` },
    description: brand.tagline ?? undefined,
    icons: brand.faviconUrl ? { icon: brand.faviconUrl } : undefined,
    openGraph: { type: "website", locale: "id_ID", siteName: brand.name, images: [image] },
    twitter: { card: "summary_large_image", images: [image.url] },
  };
}

// Layout situs publik: menerapkan identitas brand aktif sebagai CSS variables.
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const brand = await requireActiveBrand();

  const editorial = brand.template === "EDITORIAL";
  const anglo = brand.template === "ANGLO";
  const tungku = brand.template === "TUNGKU";
  // Font judul = elemen LCP Beranda Anglo: unduh sedini mungkin supaya judul langsung tampil dengan font akhirnya.
  if (anglo) preload(ANGLO_MARKER_FONT, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });

  // Warna gelap dominan (--ink) diturunkan dari warna brand, jadi tiap brand punya nuansa sendiri.
  // Editorial: gelapnya sedikit lebih terang (maroon, bukan hampir hitam) & latar terang dari warna secondary.
  // Anglo: warna brief dipakai apa adanya (primary = tinta hitam, secondary = kertas krem).
  // Tungku: teks gelap netral hangat (bukan turunan marun), latar putih; krem (secondary) hanya aksen kecil.
  const tones = anglo
    ? { ink: brand.colorPrimary, inkDeep: brand.colorPrimary }
    : tungku
      ? { ink: "#2b211e", inkDeep: "#1c1513" }
    : darkTones(brand.colorPrimary, editorial ? { ink: 0.18, inkDeep: 0.13 } : undefined);
  const brandVars = {
    "--brand": brand.colorPrimary,
    ...(tones ? { "--ink": tones.ink, "--ink-deep": tones.inkDeep } : {}),
    ...(brand.colorAccent ? { "--accent": brand.colorAccent } : {}),
    ...(editorial || anglo ? { "--paper": brand.colorSecondary } : {}),
    ...(tungku ? { "--paper": "#ffffff", "--cream": brand.colorSecondary } : {}),
  } as CSSProperties;
  const fonts = editorial
    ? `${instrumentSans.variable} tpl-editorial`
    : anglo
      ? `${spaceMono.variable} ${courierPrime.variable} tpl-anglo`
      : tungku
        ? `${mplusRounded.variable} ${nunitoSans.variable} tpl-tungku`
        : `${bricolage.variable} ${dmSans.variable}`;

  return (
    <div
      style={brandVars}
      data-template={brand.template}
      className={`brand-scope ${fonts} flex min-h-screen flex-col bg-paper font-sans text-ink`}
    >
      <NoScriptReveal />
      {anglo && <StickerDefs />}
      <MotionProvider>
        {editorial ? (
          <EditorialHeader brandName={brand.name} logoUrl={brand.logoUrl} />
        ) : anglo ? (
          <AngloHeader brandName={brand.name} />
        ) : tungku ? (
          <TungkuHeader brandName={brand.name} logoUrl={brand.logoUrl} instagramUrl={brand.instagramUrl} tiktokUrl={brand.tiktokUrl} />
        ) : (
          <BrandHeader brandName={brand.name} logoUrl={brand.logoUrl} />
        )}
        <main className="flex-1">{children}</main>
        {editorial ? (
          <EditorialFooter brand={brand} />
        ) : anglo ? (
          <AngloFooter brand={brand} />
        ) : tungku ? (
          <TungkuFooter brand={brand} />
        ) : (
          <BrandFooter brand={brand} />
        )}
        <BackToTop />
      </MotionProvider>
      <SmoothScroll />
      <Tracker brandSlug={brand.slug} />
    </div>
  );
}
