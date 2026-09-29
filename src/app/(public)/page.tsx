import Link from "next/link";
import BranchList from "@/components/public/home/BranchList";
import FeaturedCarousel from "@/components/public/home/FeaturedCarousel";
import GalleryCollage from "@/components/public/home/GalleryCollage";
import Headline from "@/components/public/home/Headline";
import HeroSection from "@/components/public/home/HeroSection";
import Marquee from "@/components/public/home/Marquee";
import MenuPicker from "@/components/public/home/MenuPicker";
import PromoPoster from "@/components/public/home/PromoPoster";
import RestaurantJsonLd from "@/components/public/RestaurantJsonLd";
import StoryPinned from "@/components/public/home/StoryPinned";
import AngloHome from "@/components/templates/anglo/AngloHome";
import EditorialHome from "@/components/templates/editorial/EditorialHome";
import { requireActiveBrand } from "@/lib/active-brand";
import { getActivePromos, getSections } from "@/lib/content";
import { greetingFor, wibHour } from "@/lib/greeting";
import { GALLERY_PLACEHOLDERS, PLACEHOLDER, menuPhoto, realPhoto } from "@/lib/placeholder";
import { prisma } from "@/lib/prisma";
import { branchNames, brandPageMetadata, joinNames } from "@/lib/seo";
import { trackName } from "@/lib/track";

const DEFAULT_PROCESS = ["Diulek.", "Digoreng.", "Disajikan hangat."];

/** Batas judul Beranda sebelum tagline tidak lagi ikut di judul (hasil pencarian memotong ±60 karakter). */
const HOME_TITLE_MAX = 65;

export function generateMetadata() {
  return brandPageMetadata(async (brand) => {
    const names = await branchNames(brand);
    const withTagline = brand.tagline ? `${brand.name} — ${brand.tagline}` : brand.name;
    const branches = names.length ? ` ${names.length} cabang: ${joinNames(names)}.` : "";
    return {
      title: withTagline.length <= HOME_TITLE_MAX ? withTagline : brand.name,
      absoluteTitle: true,
      description: `${brand.tagline ? `${brand.tagline}.` : brand.name}${branches} Lihat menu, harga, jam buka & lokasi.`,
      path: "/",
    };
  });
}

// Halaman Utama. Template Editorial punya susunan sendiri; selebihnya template Bold:
// hero, marquee, menu andalan, picker, cerita, promo, galeri, cabang.
export default async function HomePage() {
  const brand = await requireActiveBrand();
  const jsonLd = <RestaurantJsonLd brand={brand} />;
  if (brand.template === "EDITORIAL")
    return (
      <>
        {jsonLd}
        <EditorialHome brand={brand} />
      </>
    );
  if (brand.template === "ANGLO") {
    const featured = await prisma.menuItem.findMany({
      where: { brandId: brand.id, isFeatured: true, isAvailable: true },
      orderBy: [{ category: { order: "asc" } }, { order: "asc" }],
      select: { id: true, name: true, description: true, price: true },
    });
    return (
      <>
        {jsonLd}
        <AngloHome featured={featured} />
      </>
    );
  }

  const [homeSections, storySections, menu, promos, photos, branches] = await Promise.all([
    getSections(brand.id, "home"),
    getSections(brand.id, "story"),
    prisma.menuItem.findMany({
      where: { brandId: brand.id, isAvailable: true },
      orderBy: [{ category: { order: "asc" } }, { order: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        portion: true,
        imageUrl: true,
        isFeatured: true,
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
    prisma.branch.findMany({
      where: { brandId: brand.id },
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        address: true,
        mapsUrl: true,
        lat: true,
        lng: true,
        openHours: true,
        whatsapp: true,
        hours: { select: { dayOfWeek: true, isClosed: true, opens: true, closes: true } },
      },
    }),
  ]);

  const section = (list: typeof homeSections, key: string) => list.find((s) => s.key === key)?.data;
  const hero = section(homeSections, "hero") ?? {};
  const steps = section(homeSections, "process") ?? {};
  const story = section(storySections, "profile") ?? section(storySections, "history");

  const items = menu.map(({ category, ...m }) => ({ ...m, category: category.name, photo: menuPhoto(m, category.name) }));
  const featured = items.filter((i) => i.isFeatured).slice(0, 10);

  // Foto: pakai foto dari admin; kalau belum ada, foto contoh (placeholder).
  const heroImage = realPhoto(hero.imageUrl) ?? PLACEHOLDER.hero;
  const processImage = realPhoto(steps.imageUrl) ?? PLACEHOLDER.ulekSambal;
  const galleryReal = photos.flatMap((p) => {
    const url = realPhoto(p.imageUrl);
    return url ? [{ ...p, imageUrl: url }] : [];
  });
  const gallery = galleryReal.length
    ? galleryReal
    : GALLERY_PLACEHOLDERS.map((p, i) => ({ id: `placeholder-${i}`, ...p }));

  return (
    <>
      {jsonLd}
      <HeroSection
        title={hero.title ?? brand.name}
        subtitle={hero.subtitle ?? brand.tagline}
        imageUrl={heroImage}
        greeting={greetingFor(wibHour())}
        sticker="Sambal diulek tiap hari"
      />

      <Marquee items={items.map((i) => i.name)} />

      {featured.length > 0 && (
        <section aria-labelledby="featured-title" className="overflow-hidden bg-paper pb-20 pt-24 md:pb-28 md:pt-32">
          <div className="mx-auto mb-12 flex max-w-[1400px] flex-col gap-6 px-4 sm:px-6 md:mb-16 lg:flex-row lg:items-end lg:justify-between">
            <Headline id="featured-title" text="Paling sering dipesan" className="max-w-xl text-[clamp(32px,5vw,64px)]" />
            <div className="max-w-xs lg:pb-3">
              <p className="text-ink/70">Yang ini jarang sisa sampai tutup. Geser, pilih, gas.</p>
              <Link
                href="/menu"
                data-track={trackName("menu")}
                className="mt-4 inline-flex items-center gap-2 border-b-2 border-ink pb-1 font-semibold transition hover:border-brand hover:text-brand"
              >
                Semua menu <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
          <FeaturedCarousel items={featured} />
        </section>
      )}

      {items.length > 0 && (
        <section aria-labelledby="picker-title" className="grain relative bg-ink py-20 text-paper md:py-32">
          <div className="mx-auto grid max-w-[1400px] gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <Headline id="picker-title" text="Lagi pengen apa?" className="text-[clamp(32px,5vw,64px)]" />
              <p className="mt-6 max-w-sm text-paper/65">
                Bingung milih? Jawab tiga pertanyaan, kita pilihin satu menu yang paling cocok buat perutmu malam ini.
              </p>
            </div>
            <MenuPicker items={items} />
          </div>
        </section>
      )}

      <StoryPinned
        lines={steps.items?.length ? steps.items : DEFAULT_PROCESS}
        body={steps.body ?? story?.body ?? brand.tagline}
        imageUrl={processImage}
      />

      {promos.length > 0 && (
        <PromoPoster
          promos={promos.map((p) => ({ ...p, imageUrl: realPhoto(p.imageUrl) }))}
          fallbackPhoto={featured[0]?.photo ?? PLACEHOLDER.lele}
        />
      )}

      <GalleryCollage photos={gallery} />

      {branches.length > 0 && <BranchList brandName={brand.name} branches={branches} />}
    </>
  );
}
