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

/**
 * Beranda template Tungku (desain Figma "Beranda — Desktop 1440" & "Beranda — HP 375"):
 * hero foto penuh + nama brand, Cerita, Menu Unggulan (popup), suasana, Cabang, Ikuti di Instagram.
 */
export default function TungkuHome({ brand, featured, branch }: { brand: Brand; featured: FeaturedItem[]; branch: Branch | null }) {
  const [top, bottom] = APW.hero.lines;

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden bg-ink text-paper">
        <HeroParallax>
          <Photo image={APW_IMAGES.hero} priority className="h-full w-full" />
        </HeroParallax>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/35 to-black/60" />
        <div className="relative px-4 py-24 text-center">
          <p className="tk-caps text-[11px] tracking-[0.3em] md:text-[13px]">{APW.hero.label}</p>
          <h1 className="tk-caps mt-5 text-[clamp(28px,8.4vw,96px)] leading-[1.12] tracking-[0.08em] text-white">
            <span className="block">{top}</span>
            <span className="block">{bottom}</span>
          </h1>
          <p className="mt-6 text-[17px] md:text-xl">{APW.slogan}</p>
        </div>
      </section>

      {/* Cerita */}
      <section aria-labelledby="tk-cerita" className="overflow-hidden py-20 md:py-32">
        <div className={`${WRAP} grid items-center gap-12 md:grid-cols-2 md:gap-20`}>
          <Reveal y={16} className="relative ml-6 md:order-2 md:ml-10">
            <div aria-hidden className="bg-paper-deep absolute -bottom-6 -left-6 top-10 w-full md:-left-10" />
            <Photo image={APW_IMAGES.ceritaMasuk} className="relative aspect-[4/5] w-full" />
            <div aria-hidden className="absolute -right-4 top-8 h-5 w-32 bg-accent md:-right-12 md:top-14 md:h-6 md:w-48" />
          </Reveal>
          <Reveal y={16} delay={0.1} className="md:order-1">
            <SectionTitle id="tk-cerita">{APW.intro.title}</SectionTitle>
            <p className="mt-6 max-w-[470px] leading-[1.75] text-ink/85">{APW.intro.body}</p>
            <TkButton href="/cerita" track={trackName("cerita")} className="mt-9">
              {APW.intro.cta} <span aria-hidden>→</span>
            </TkButton>
          </Reveal>
        </div>
      </section>

      {/* Menu Unggulan */}
      {featured.length > 0 && (
        <section aria-labelledby="tk-unggulan" className="pb-20 md:pb-32">
          <div className={WRAP}>
            <Reveal y={16}>
              <SectionTitle id="tk-unggulan" className="mb-10 md:mb-14">
                {APW.featured.title}
              </SectionTitle>
            </Reveal>
            <Reveal y={16} delay={0.1}>
              <FeaturedCards items={featured} moreLabel={APW.featured.more} menuLabel={APW.featured.cta} />
            </Reveal>
            <div className="mt-12 flex justify-center md:mt-16">
              <TkButton href="/menu" track={trackName("menu")}>
                {APW.featured.cta}
              </TkButton>
            </div>
          </div>
        </section>
      )}

      {/* Suasana */}
      <section aria-label="Suasana warung" className="relative pb-24 md:pb-36">
        <div aria-hidden className="bg-paper-deep absolute inset-x-0 top-24 h-[45%] md:top-28" />
        <div className={`${WRAP} relative`}>
          <Reveal y={16} className="relative -mx-4 sm:mx-0 md:w-[70%]">
            <Photo image={APW_IMAGES.suasana} className="aspect-[4/3] w-full" />
            <div aria-hidden className="absolute -bottom-16 left-6 h-28 w-5 bg-accent md:left-8 md:h-44 md:w-6" />
          </Reveal>
          <figure className="relative -mt-12 ml-6 bg-paper p-6 md:absolute md:bottom-[-4rem] md:right-8 md:ml-0 md:mt-0 md:w-[420px] md:p-9">
            <Reveal y={16} delay={0.15}>
              <blockquote className="tk-display text-base leading-[1.6] md:text-xl">“{APW.quote}”</blockquote>
            </Reveal>
          </figure>
        </div>
      </section>

      {/* Cabang */}
      {branch && (
        <section aria-labelledby="tk-cabang" className="overflow-hidden py-20 md:py-32">
          <div className={`${WRAP} grid items-center gap-12 md:grid-cols-2 md:gap-20`}>
            <Reveal y={16} className="relative ml-6 md:order-2 md:ml-10">
              <div aria-hidden className="bg-paper-deep absolute -bottom-8 -left-6 h-1/3 w-2/5 md:-left-12" />
              <Photo image={APW_IMAGES.cabang} className="relative aspect-[4/5] w-full" />
              <div aria-hidden className="absolute -left-6 top-10 h-5 w-28 bg-accent md:-left-12 md:w-40" />
            </Reveal>
            <Reveal y={16} delay={0.1} className="md:order-1">
              <SectionTitle id="tk-cabang">{APW.location.title}</SectionTitle>
              <p className="tk-display mt-5 text-lg text-brand md:text-xl">{branchArea(branch.name)}</p>
              {branch.address && <p className="mt-4 max-w-[470px] leading-[1.75] text-ink/85">{branch.address}</p>}
              {branch.openHours && <p className="mt-1 leading-[1.75] text-ink/85">Buka {branch.openHours}</p>}
              <OpenBadge hours={branch.hours} className="mt-4 text-sm font-normal" />
              <TkButton href="/cabang" track={trackName("cabang")} className="mt-8">
                {APW.location.cta} <span aria-hidden>→</span>
              </TkButton>
            </Reveal>
          </div>
        </section>
      )}

      {/* Ikuti di Instagram (tautan saja, tanpa embed) */}
      {(brand.instagramUrl || brand.tiktokUrl) && (
        <section aria-labelledby="tk-ig" className="bg-paper-deep py-20 text-center md:py-28">
          <Reveal y={16} className={WRAP}>
            <InstagramIcon className="mx-auto h-7 w-7 text-brand" />
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
    </>
  );
}
