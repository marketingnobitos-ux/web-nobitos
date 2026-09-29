import type { Brand } from "@prisma/client";
import Reveal from "@/components/animations/Reveal";
import OpenBadge from "@/components/public/OpenBadge";
import FeaturedCards, { type FeaturedItem } from "@/components/templates/tungku/FeaturedCards";
import HeroParallax from "@/components/templates/tungku/HeroParallax";
import { InstagramIcon, Photo, SectionTitle, TkButton, WRAP, branchArea } from "@/components/templates/tungku/shared";
import { APW, APW_IMAGES } from "@/data/brands/apw";
import type { DayHours } from "@/lib/hours";
import { socialHandle } from "@/lib/site";
import { trackName } from "@/lib/track";

type Branch = { name: string; address: string; openHours: string | null; hours: DayHours[] };

/** Jarak antar-bagian: lega seperti referensi (couvee.co.id). */
const GAP = "mt-28 md:mt-44";

/**
 * Beranda template Tungku (desain Figma "Beranda v2 — Desktop 1440" & "Beranda v2 — HP 375"):
 * hero foto terang + nama brand, Cerita (foto lebar penuh), Menu Unggulan (popup), suasana, Cabang, Ikuti di Instagram.
 */
export default function TungkuHome({ brand, featured, branch }: { brand: Brand; featured: FeaturedItem[]; branch: Branch | null }) {
  const [top, bottom] = APW.hero.lines;

  return (
    <div className="pb-28 md:pb-44">
      {/* Hero terang: foto penuh tanpa overlay, hanya nama brand. */}
      <section className="relative flex min-h-[78svh] items-center justify-center overflow-hidden bg-paper-deep md:min-h-[calc(100svh-3.5rem)]">
        <HeroParallax>
          <Photo image={APW_IMAGES.hero} priority className="h-full w-full" />
        </HeroParallax>
        <h1 className="tk-hero-name tk-caps relative px-4 text-center text-[clamp(26px,7vw,96px)] leading-[1.15] tracking-[0.12em] text-brand md:tracking-[0.18em]">
          <span className="block">{top}</span>
          <span className="block">{bottom}</span>
        </h1>
      </section>

      {/* Cerita: satu foto lebar penuh, lalu judul & paragraf pendek. */}
      <section aria-labelledby="tk-cerita" className={GAP}>
        <Reveal y={16}>
          <Photo image={APW_IMAGES.ceritaLebar} className="aspect-[16/10] w-full md:aspect-[21/9]" />
        </Reveal>
        <Reveal y={16} className={`${WRAP} mt-12 md:mt-20`}>
          <SectionTitle id="tk-cerita">{APW.intro.title}</SectionTitle>
          <p className="mt-6 max-w-[520px] leading-[1.8] text-ink/80">{APW.intro.body}</p>
          <TkButton href="/cerita" track={trackName("cerita")} className="mt-10">
            {APW.intro.cta} <span aria-hidden>→</span>
          </TkButton>
        </Reveal>
      </section>

      {/* Menu Unggulan */}
      {featured.length > 0 && (
        <section aria-labelledby="tk-unggulan" className={`${WRAP} ${GAP}`}>
          <Reveal y={16}>
            <SectionTitle id="tk-unggulan" className="mb-12 md:mb-16">
              {APW.featured.title}
            </SectionTitle>
          </Reveal>
          <Reveal y={16} delay={0.1}>
            <FeaturedCards items={featured} moreLabel={APW.featured.more} menuLabel={APW.featured.cta} />
          </Reveal>
          <div className="mt-14 flex justify-center md:mt-20">
            <TkButton href="/menu" track={trackName("menu")}>
              {APW.featured.cta}
            </TkButton>
          </div>
        </section>
      )}

      {/* Suasana: foto + kutipan, krem hanya aksen kecil. */}
      <section aria-label="Suasana warung" className={`${WRAP} ${GAP} relative`}>
        <div className="relative md:grid md:grid-cols-[1fr_320px] md:items-end md:gap-16">
          <Reveal y={16} className="relative -mx-4 sm:mx-0">
            <Photo image={APW_IMAGES.suasana} className="aspect-[4/3] w-full" />
            <div aria-hidden className="absolute -bottom-10 left-6 h-24 w-4 bg-accent md:-bottom-14 md:left-8 md:h-36 md:w-5" />
          </Reveal>
          <Reveal y={16} delay={0.15} className="relative mt-16 md:mt-0 md:pb-6">
            <div aria-hidden className="bg-paper-deep absolute -right-4 -top-8 h-20 w-24 md:-right-10 md:-top-12 md:h-28 md:w-32" />
            <blockquote className="tk-display relative text-lg leading-[1.6] md:text-xl">“{APW.quote}”</blockquote>
          </Reveal>
        </div>
      </section>

      {/* Cabang */}
      {branch && (
        <section aria-labelledby="tk-cabang" className={`${WRAP} ${GAP} grid items-center gap-14 md:grid-cols-2 md:gap-24`}>
          <Reveal y={16} className="relative md:order-2">
            <div aria-hidden className="bg-paper-deep absolute -bottom-8 -left-4 h-28 w-24 md:-bottom-10 md:-left-10 md:h-40 md:w-36" />
            <Photo image={APW_IMAGES.cabang} className="relative aspect-[4/5] w-full" />
          </Reveal>
          <Reveal y={16} delay={0.1} className="md:order-1">
            <SectionTitle id="tk-cabang">{APW.location.title}</SectionTitle>
            <p className="tk-display mt-6 text-lg text-brand md:text-xl">{branchArea(branch.name)}</p>
            {branch.address && <p className="mt-4 max-w-[470px] leading-[1.8] text-ink/80">{branch.address}</p>}
            {branch.openHours && <p className="mt-1 leading-[1.8] text-ink/80">Buka {branch.openHours}</p>}
            <OpenBadge hours={branch.hours} className="mt-4 text-sm font-normal" />
            <TkButton href="/cabang" track={trackName("cabang")} className="mt-10">
              {APW.location.cta} <span aria-hidden>→</span>
            </TkButton>
          </Reveal>
        </section>
      )}

      {/* Ikuti di Instagram (tautan saja, tanpa embed) */}
      {(brand.instagramUrl || brand.tiktokUrl) && (
        <section aria-labelledby="tk-ig" className={`${WRAP} ${GAP} text-center`}>
          <Reveal y={16}>
            <div aria-hidden className="mx-auto h-0.5 w-12 bg-accent" />
            <InstagramIcon className="mx-auto mt-10 h-6 w-6 text-brand" />
            <SectionTitle id="tk-ig" className="mt-5 text-[clamp(22px,2.6vw,32px)]">
              {APW.instagram.title}
            </SectionTitle>
            {brand.instagramUrl && (
              <a
                href={brand.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-track={trackName("ig")}
                className="mt-5 inline-block text-lg font-normal text-brand underline-offset-4 hover:underline"
              >
                {socialHandle(brand.instagramUrl)}
              </a>
            )}
            {brand.tiktokUrl && (
              <p className="mt-2 text-sm text-ink/65">
                TikTok{" "}
                <a href={brand.tiktokUrl} target="_blank" rel="noopener noreferrer" data-track={trackName("tiktok")} className="underline-offset-4 hover:text-brand hover:underline">
                  {socialHandle(brand.tiktokUrl)}
                </a>
              </p>
            )}
          </Reveal>
        </section>
      )}
    </div>
  );
}
