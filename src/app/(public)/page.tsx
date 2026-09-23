import Link from "next/link";
import Reveal from "@/components/animations/Reveal";
import BranchCta from "@/components/public/home/BranchCta";
import FeaturedCarousel from "@/components/public/home/FeaturedCarousel";
import GalleryTeaser from "@/components/public/home/GalleryTeaser";
import HeroSection from "@/components/public/home/HeroSection";
import PromoSpotlight from "@/components/public/home/PromoSpotlight";
import SectionIntro from "@/components/public/home/SectionIntro";
import StoryTeaser from "@/components/public/home/StoryTeaser";
import { requireActiveBrand } from "@/lib/active-brand";
import { getActivePromos, getSections } from "@/lib/content";
import { prisma } from "@/lib/prisma";

// Halaman Utama (Milestone 7): hero, menu andalan, promo, cerita, galeri, CTA cabang.
export default async function HomePage() {
  const brand = await requireActiveBrand();

  const [homeSections, storySections, featured, promos, photos, branches] = await Promise.all([
    getSections(brand.id, "home"),
    getSections(brand.id, "story"),
    prisma.menuItem.findMany({
      where: { brandId: brand.id, isFeatured: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      take: 10,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        portion: true,
        imageUrl: true,
        category: { select: { name: true } },
      },
    }),
    getActivePromos(brand.id),
    prisma.galleryPhoto.findMany({
      where: { album: { brandId: brand.id } },
      orderBy: [{ album: { order: "asc" } }, { order: "asc" }],
      take: 6,
      select: { id: true, imageUrl: true, caption: true },
    }),
    prisma.branch.findMany({ where: { brandId: brand.id }, orderBy: { order: "asc" } }),
  ]);

  const hero = homeSections.find((s) => s.key === "hero")?.data ?? {};
  const story = (key: string) => storySections.find((s) => s.key === key)?.data;
  // Foto hero: dari konten Beranda; kalau kosong pakai foto menu andalan pertama.
  const heroImage = hero.imageUrl ?? featured.find((f) => f.imageUrl)?.imageUrl ?? null;
  const storyText = story("profile")?.body ?? story("history")?.body ?? brand.tagline ?? `Selamat datang di ${brand.name}.`;
  const storyImage = story("atmosphere")?.imageUrl ?? story("profile")?.imageUrl ?? story("history")?.imageUrl ?? null;

  return (
    <>
      <HeroSection
        eyebrow={(hero.title ?? brand.name) === brand.name ? "Selamat datang di" : brand.name}
        title={hero.title ?? brand.name}
        subtitle={hero.subtitle ?? brand.tagline}
        imageUrl={heroImage}
      />

      {featured.length > 0 && (
        <section className="py-16 sm:py-24" aria-labelledby="featured-title">
          <div className="mx-auto mb-10 max-w-6xl px-5">
            <SectionIntro
              id="featured-title"
              eyebrow="Menu andalan"
              title="Yang paling sering dipesan"
              description="Pilihan favorit pelanggan kami. Geser untuk melihat semuanya."
            />
          </div>
          <FeaturedCarousel items={featured.map(({ category, ...f }) => ({ ...f, category: category.name }))} />
          <div className="mt-10 text-center">
            <Link
              href="/menu"
              data-track="cta-semua-menu"
              className="inline-flex rounded-full border-2 border-ink px-6 py-3 text-sm font-bold transition hover:bg-ink hover:text-white"
            >
              Lihat semua menu
            </Link>
          </div>
        </section>
      )}

      {promos.length > 0 && <PromoSpotlight promos={promos} />}

      <StoryTeaser brandName={brand.name} text={storyText} imageUrl={storyImage} />

      {photos.length > 0 && (
        <section className="py-16 sm:py-24" aria-labelledby="gallery-title">
          <div className="mx-auto max-w-6xl px-5">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionIntro id="gallery-title" align="left" eyebrow="Galeri" title="Suasana & sajian kami" />
              <Reveal>
                <Link
                  href="/galeri"
                  data-track="cta-lihat-galeri"
                  className="inline-flex rounded-full border-2 border-ink px-6 py-3 text-sm font-bold transition hover:bg-ink hover:text-white"
                >
                  Lihat galeri
                </Link>
              </Reveal>
            </div>
            <GalleryTeaser photos={photos} />
          </div>
        </section>
      )}

      <BranchCta brandName={brand.name} branches={branches} />
    </>
  );
}
