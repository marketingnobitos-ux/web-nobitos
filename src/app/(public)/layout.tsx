import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import MotionProvider from "@/components/animations/MotionProvider";
import { NoScriptReveal } from "@/components/animations/Reveal";
import SmoothScroll from "@/components/animations/SmoothScroll";
import BackToTop from "@/components/public/BackToTop";
import BrandFooter from "@/components/public/BrandFooter";
import BrandHeader from "@/components/public/BrandHeader";
import Tracker from "@/components/public/Tracker";
import { getActiveBrand, requireActiveBrand } from "@/lib/active-brand";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-jakarta",
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

  const brandVars = {
    "--color-primary": brand.colorPrimary,
    "--color-secondary": brand.colorSecondary,
    "--color-accent": brand.colorAccent ?? brand.colorPrimary,
  } as CSSProperties;

  return (
    <div style={brandVars} className={`brand-scope ${jakarta.variable} flex min-h-screen flex-col bg-paper font-display text-ink`}>
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
