import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Bricolage_Grotesque, Caveat_Brush, Courier_Prime, DM_Sans, Instrument_Sans, Space_Mono } from "next/font/google";
import MotionProvider from "@/components/animations/MotionProvider";
import { NoScriptReveal } from "@/components/animations/Reveal";
import SmoothScroll from "@/components/animations/SmoothScroll";
import BackToTop from "@/components/public/BackToTop";
import BrandFooter from "@/components/public/BrandFooter";
import BrandHeader from "@/components/public/BrandHeader";
import AngloFooter from "@/components/templates/anglo/AngloFooter";
import AngloHeader from "@/components/templates/anglo/AngloHeader";
import EditorialFooter from "@/components/templates/editorial/EditorialFooter";
import EditorialHeader from "@/components/templates/editorial/EditorialHeader";
import Tracker from "@/components/public/Tracker";
import { getActiveBrand, requireActiveBrand } from "@/lib/active-brand";
import { darkTones } from "@/lib/color";

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
// Template Anglo (kertas & zine): judul spidol, label/harga mesin ketik, paragraf Courier.
// Tidak di-preload supaya brand lain tidak ikut mengunduh.
const caveatBrush = Caveat_Brush({ subsets: ["latin"], weight: "400", display: "swap", preload: false, variable: "--font-caveat-brush" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap", preload: false, variable: "--font-space-mono" });
const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
  variable: "--font-courier-prime",
});

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getActiveBrand();
  if (!brand) return {};
  return {
    title: { default: brand.name, template: `%s · ${brand.name}` },
    description: brand.tagline ?? undefined,
    icons: brand.faviconUrl ? { icon: brand.faviconUrl } : undefined,
  };
}

// Layout situs publik: menerapkan identitas brand aktif sebagai CSS variables.
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const brand = await requireActiveBrand();

  const editorial = brand.template === "EDITORIAL";
  const anglo = brand.template === "ANGLO";

  // Warna gelap dominan (--ink) diturunkan dari warna brand, jadi tiap brand punya nuansa sendiri.
  // Editorial: gelapnya sedikit lebih terang (maroon, bukan hampir hitam) & latar terang dari warna secondary.
  // Anglo: warna brief dipakai apa adanya (primary = tinta hitam, secondary = kertas krem).
  const tones = anglo
    ? { ink: brand.colorPrimary, inkDeep: brand.colorPrimary }
    : darkTones(brand.colorPrimary, editorial ? { ink: 0.18, inkDeep: 0.13 } : undefined);
  const brandVars = {
    "--brand": brand.colorPrimary,
    ...(tones ? { "--ink": tones.ink, "--ink-deep": tones.inkDeep } : {}),
    ...(brand.colorAccent ? { "--accent": brand.colorAccent } : {}),
    ...(editorial || anglo ? { "--paper": brand.colorSecondary } : {}),
  } as CSSProperties;
  const fonts = editorial
    ? `${instrumentSans.variable} tpl-editorial`
    : anglo
      ? `${caveatBrush.variable} ${spaceMono.variable} ${courierPrime.variable} tpl-anglo`
      : `${bricolage.variable} ${dmSans.variable}`;

  return (
    <div
      style={brandVars}
      data-template={brand.template}
      className={`brand-scope ${fonts} flex min-h-screen flex-col bg-paper font-sans text-ink`}
    >
      <NoScriptReveal />
      <MotionProvider>
        {editorial ? (
          <EditorialHeader brandName={brand.name} logoUrl={brand.logoUrl} />
        ) : anglo ? (
          <AngloHeader brandName={brand.name} />
        ) : (
          <BrandHeader brandName={brand.name} logoUrl={brand.logoUrl} />
        )}
        <main className="flex-1">{children}</main>
        {editorial ? <EditorialFooter brand={brand} /> : anglo ? <AngloFooter brand={brand} /> : <BrandFooter brand={brand} />}
        <BackToTop />
      </MotionProvider>
      <SmoothScroll />
      <Tracker brandSlug={brand.slug} />
    </div>
  );
}
