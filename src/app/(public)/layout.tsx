import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import MotionProvider from "@/components/animations/MotionProvider";
import { NoScriptReveal } from "@/components/animations/Reveal";
import SmoothScroll from "@/components/animations/SmoothScroll";
import BackToTop from "@/components/public/BackToTop";
import BrandFooter from "@/components/public/BrandFooter";
import BrandHeader from "@/components/public/BrandHeader";
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

  // Warna gelap dominan (--ink) diturunkan dari warna brand, jadi tiap brand punya nuansa sendiri.
  const tones = darkTones(brand.colorPrimary);
  const brandVars = {
    "--brand": brand.colorPrimary,
    ...(tones ? { "--ink": tones.ink, "--ink-deep": tones.inkDeep } : {}),
    ...(brand.colorAccent ? { "--accent": brand.colorAccent } : {}),
  } as CSSProperties;

  return (
    <div
      style={brandVars}
      className={`brand-scope ${bricolage.variable} ${dmSans.variable} flex min-h-screen flex-col bg-paper font-sans text-ink`}
    >
      <NoScriptReveal />
      <MotionProvider>
        <BrandHeader brandName={brand.name} logoUrl={brand.logoUrl} />
        <main className="flex-1">{children}</main>
        <BrandFooter brand={brand} />
        <BackToTop />
      </MotionProvider>
      <SmoothScroll />
      <Tracker brandSlug={brand.slug} />
    </div>
  );
}
