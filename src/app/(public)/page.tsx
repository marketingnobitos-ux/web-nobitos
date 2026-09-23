import Link from "next/link";
import GalleryGrid from "@/components/public/GalleryGrid";
import MenuCard from "@/components/public/MenuCard";
import PromoCard from "@/components/public/PromoCard";
import SectionHeading from "@/components/public/SectionHeading";
import { requireActiveBrand } from "@/lib/active-brand";
import { getActivePromos, getSections } from "@/lib/content";
import { slugify, whatsappUrl } from "@/lib/format";
import { prisma } from "@/lib/prisma";

const menuCardSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  portion: true,
  imageUrl: true,
  isAvailable: true,
} as const;

// Halaman Utama: hero, menu andalan, promo, teaser galeri & cerita, CTA cabang.
export default async function HomePage() {
  const brand = await requireActiveBrand();

  const [sections, featured, promos, photos, branches] = await Promise.all([
    getSections(brand.id, "home"),
    prisma.menuItem.findMany({
      where: { brandId: brand.id, isFeatured: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      take: 8,
      select: menuCardSelect,
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

  const hero = sections.find((s) => s.key === "hero")?.data ?? {};
  const waBranch = branches.find((b) => b.whatsapp);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-primary text-white">
        {hero.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hero.imageUrl} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40" />
        )}
        <div className="mx-auto flex min-h-[60vh] max-w-6xl flex-col justify-center px-4 py-20">
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            {hero.title ?? brand.name}
          </h1>
          {(hero.subtitle ?? brand.tagline) && (
            <p className="mt-4 max-w-2xl text-lg text-white/90 sm:text-xl">{hero.subtitle ?? brand.tagline}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/menu" data-track="cta-lihat-menu" className="rounded-lg bg-white px-6 py-3 font-semibold text-primary hover:bg-white/90">
              Lihat Menu
            </Link>
            <Link href="/cabang" data-track="cta-cari-cabang" className="rounded-lg border border-white/70 px-6 py-3 font-semibold hover:bg-white/10">
              Cari Cabang
            </Link>
          </div>
        </div>
      </section>

      {/* Menu andalan */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14">
          <SectionHeading title="Menu Andalan" href="/menu" linkLabel="Semua menu" />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((item) => (
              <MenuCard key={item.id} item={item} track={`menu-andalan-${slugify(item.name)}`} />
            ))}
          </div>
        </section>
      )}

      {/* Promo */}
      {promos.length > 0 && (
        <section className="bg-primary/5">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <SectionHeading title="Promo" />
            <div className="grid gap-4 md:grid-cols-2">
              {promos.map((promo) => (
                <PromoCard key={promo.id} promo={promo} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Teaser galeri */}
      {photos.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14">
          <SectionHeading title="Galeri" href="/galeri" linkLabel="Lihat galeri" />
          <GalleryGrid photos={photos} />
        </section>
      )}

      {/* Teaser cerita + CTA cabang */}
      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 p-6 sm:p-8">
          <h2 className="text-2xl font-bold">Cerita {brand.name}</h2>
          <p className="mt-2 text-gray-600">Kenali perjalanan, nilai, dan suasana outlet kami.</p>
          <Link href="/cerita" data-track="cta-lihat-cerita" className="mt-6 inline-block font-semibold text-primary hover:underline">
            Lihat Cerita →
          </Link>
        </div>
        <div className="rounded-2xl bg-primary p-6 text-white sm:p-8">
          <h2 className="text-2xl font-bold">Kunjungi Kami</h2>
          <p className="mt-2 text-white/90">
            {branches.length > 0
              ? `${branches.length} cabang: ${branches.map((b) => b.name).join(", ")}.`
              : "Info cabang segera hadir."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/cabang" data-track="cta-lihat-cabang" className="rounded-lg bg-white px-5 py-2.5 font-semibold text-primary hover:bg-white/90">
              Lihat Cabang
            </Link>
            {waBranch?.whatsapp && (
              <a
                href={whatsappUrl(waBranch.whatsapp, `Halo ${brand.name}`)}
                target="_blank"
                rel="noopener noreferrer"
                data-track={`wa-beranda-${slugify(waBranch.name)}`}
                className="rounded-lg border border-white/70 px-5 py-2.5 font-semibold hover:bg-white/10"
              >
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
