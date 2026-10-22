import type { CSSProperties } from "react";
import type { Metadata } from "next";
import MotionProvider from "@/components/animations/MotionProvider";
import { NoScriptReveal } from "@/components/animations/Reveal";
import SmoothScroll from "@/components/animations/SmoothScroll";
import BackToTop from "@/components/public/BackToTop";
import BrandFooter from "@/components/public/BrandFooter";
import BrandHeader from "@/components/public/BrandHeader";
import TemplateFrame from "@/components/public/TemplateFrame";
import AngloFooter from "@/components/templates/anglo/AngloFooter";
import AngloHeader from "@/components/templates/anglo/AngloHeader";
import { StickerDefs } from "@/components/templates/anglo/illustrations";
import DadakFooter from "@/components/templates/dadak/DadakFooter";
import DadakHeader from "@/components/templates/dadak/DadakHeader";
import EditorialFooter from "@/components/templates/editorial/EditorialFooter";
import GerabahFooter from "@/components/templates/gerabah/GerabahFooter";
import GerabahHeader from "@/components/templates/gerabah/GerabahHeader";
import TungkuFooter from "@/components/templates/tungku/TungkuFooter";
import TungkuHeader from "@/components/templates/tungku/TungkuHeader";
import EditorialHeader from "@/components/templates/editorial/EditorialHeader";
import Tracker from "@/components/public/Tracker";
import { getActiveBrand, requireActiveBrand } from "@/lib/active-brand";
import { darkTones } from "@/lib/color";
import { isCompleteWeek } from "@/lib/hours";
import { prisma } from "@/lib/prisma";
import { ogImage, siteOrigin } from "@/lib/seo";

// Font & CSS khusus template ada di frame template masing-masing (components/public/TemplateFrame.tsx), jadi tiap brand
// hanya mengunduh milik template-nya. Font judul spidol Anglo (Caveat Brush) di-self-host di tpl-anglo.css; di-preload
// di sini hanya untuk Anglo.
const ANGLO_MARKER_FONT = "/brands/bakmi-pak-joko/fonts/caveat-brush-latin.woff2";

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
  const dadak = brand.template === "DADAK";
  const gerabah = brand.template === "GERABAH";

  // Warna gelap dominan (--ink) diturunkan dari warna brand, jadi tiap brand punya nuansa sendiri.
  // Editorial: gelapnya sedikit lebih terang (maroon, bukan hampir hitam) & latar terang dari warna secondary.
  // Anglo: warna brief dipakai apa adanya (primary = tinta hitam, secondary = kertas krem).
  // Tungku: teks gelap netral hangat (bukan turunan marun), latar putih; krem (secondary) hanya aksen kecil.
  // Dadak: hijau tua (primary) dipakai apa adanya untuk teks & tombol, latar terang dari secondary, stabilo = accent.
  const tones = anglo || dadak
    ? { ink: brand.colorPrimary, inkDeep: brand.colorPrimary }
    : tungku
      ? { ink: "#2b211e", inkDeep: "#1c1513" }
    : darkTones(brand.colorPrimary, editorial ? { ink: 0.18, inkDeep: 0.13 } : undefined);
  const brandVars = {
    "--brand": brand.colorPrimary,
    ...(tones ? { "--ink": tones.ink, "--ink-deep": tones.inkDeep } : {}),
    ...(brand.colorAccent ? { "--accent": brand.colorAccent } : {}),
    ...(editorial || anglo || dadak ? { "--paper": brand.colorSecondary } : {}),
    ...(tungku ? { "--paper": "#ffffff", "--cream": brand.colorSecondary } : {}),
  } as CSSProperties;
  // Gerabah: badge "Buka sekarang" di header butuh jam cabang (APW hanya Kesambi).
  const gerabahHours = gerabah
    ? (await prisma.branch.findFirst({ where: { brandId: brand.id }, orderBy: { order: "asc" }, select: { hours: true } }))?.hours ?? []
    : [];

  return (
    <TemplateFrame
      template={brand.template}
      style={brandVars}
      data-template={brand.template}
      className="brand-scope flex min-h-screen flex-col bg-paper font-sans text-ink"
    >
      {/*
        Font judul = elemen LCP Beranda Anglo: unduh sedini mungkin supaya judul langsung tampil dengan font akhirnya.
        Elemen <link> (bukan preload() dari react-dom): React menaruhnya di <head> HTML awal, sedangkan preload() di
        server component hanya jadi hint RSC yang baru diproses setelah JS halaman terunduh.
      */}
      {anglo && <link rel="preload" href={ANGLO_MARKER_FONT} as="font" type="font/woff2" crossOrigin="anonymous" />}
      <NoScriptReveal />
      {anglo && <StickerDefs />}
      <MotionProvider>
        {editorial ? (
          <EditorialHeader brandName={brand.name} logoUrl={brand.logoUrl} />
        ) : anglo ? (
          <AngloHeader brandName={brand.name} />
        ) : dadak ? (
          <DadakHeader />
        ) : gerabah ? (
          <GerabahHeader
            brandName={brand.name}
            logoUrl={brand.logoUrl}
            instagramUrl={brand.instagramUrl}
            tiktokUrl={brand.tiktokUrl}
            hours={isCompleteWeek(gerabahHours) ? gerabahHours : null}
          />
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
        ) : dadak ? (
          <DadakFooter brand={brand} />
        ) : gerabah ? (
          <GerabahFooter brand={brand} />
        ) : tungku ? (
          <TungkuFooter brand={brand} />
        ) : (
          <BrandFooter brand={brand} />
        )}
        <BackToTop />
      </MotionProvider>
      <SmoothScroll />
      <Tracker brandSlug={brand.slug} />
    </TemplateFrame>
  );
}
