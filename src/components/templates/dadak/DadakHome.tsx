import Link from "next/link";
import Reveal from "@/components/animations/Reveal";
import DadakBranchCard, { type DadakBranch } from "@/components/templates/dadak/DadakBranchCard";
import { ArrowIcon, ClockIcon, DkButton, Eyebrow, Marked, Photo, Plate, WRAP, WhatsAppIcon, formatHarga } from "@/components/templates/dadak/shared";
import { AMINOTO, AMINOTO_IMAGES } from "@/data/brands/aminoto";
import { whatsappUrl } from "@/lib/format";
import { trackName } from "@/lib/track";

export type DadakFeatured = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  portion: string | null;
  imageUrl: string | null;
};

type Props = { brandName: string; featured: DadakFeatured[]; branches: DadakBranch[] };

/**
 * Beranda Dadak (referensi Fran: kartu kaca, foto makanan bulat melayang, latar semburat warna):
 * hero + piring, menu andalan, "kenapa sambel dadak", cabang, catering.
 */
export default function DadakHome({ brandName, featured, branches }: Props) {
  const { hero, sambal, catering } = AMINOTO;

  return (
    <div className="pb-8 text-ink">
      {/* 1. Hero */}
      <section aria-labelledby="hero-title" className={`${WRAP} pt-6 md:pt-8`}>
        <div className="dk-glass relative grid items-center gap-10 overflow-hidden px-5 py-10 sm:px-10 md:py-14 lg:grid-cols-[1.05fr_1fr] lg:px-14">
          <div>
            <Eyebrow>{AMINOTO.kicker}</Eyebrow>
            <h1 id="hero-title" className="dk-title mt-4 text-[clamp(40px,6.2vw,78px)]">
              <Marked text={hero.title} />
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/80">{hero.lead}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <DkButton href="/menu" track={trackName("menu")}>
                {hero.primary}
              </DkButton>
              <Link href="/cabang" data-track={trackName("cabang")} className="dk-btn dk-btn-ghost">
                {hero.secondary}
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Pintasan menu">
              {hero.shortcuts.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="dk-chip">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-8 flex items-center gap-2 text-sm font-medium text-ink/75">
              <ClockIcon className="h-4 w-4" /> Buka setiap hari {AMINOTO.hoursShort} · {branches.length} cabang di Cirebon
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[520px] px-4 pb-4 sm:px-8">
            <Plate image={AMINOTO_IMAGES.hero} priority className="w-full" />
            <div className="dk-badge absolute right-0 top-2 h-24 w-24 sm:h-28 sm:w-28" aria-hidden>
              <span className="leading-tight">
                <span className="block text-xs font-medium">{hero.price.label}</span>
                <span className="block text-2xl font-bold sm:text-[1.7rem]">{hero.price.value}</span>
              </span>
            </div>
            <p className="dk-glass absolute bottom-0 left-0 flex items-center gap-2 !rounded-full px-4 py-2.5 text-sm font-semibold">
              <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-accent/30" /> Sambal diulek dadakan
            </p>
          </div>
        </div>
      </section>

      {/* 2. Menu andalan */}
      {featured.length > 0 && (
        <section aria-labelledby="featured-title" className={`${WRAP} mt-20 md:mt-28`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Eyebrow>Menu andalan</Eyebrow>
              <h2 id="featured-title" className="dk-title mt-3 text-[clamp(30px,4vw,48px)]">
                {AMINOTO.featured.title}
              </h2>
              <p className="mt-3 text-ink/75">{AMINOTO.featured.lead}</p>
            </div>
            <Link href="/menu" data-track={trackName("menu")} className="dk-btn dk-btn-ghost self-start sm:self-auto">
              Semua menu <ArrowIcon />
            </Link>
          </div>

          <ul className="mt-20 grid gap-x-6 gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((item, i) => (
              <Reveal as="li" key={item.id} delay={i * 0.08} y={18} className="dk-glass relative flex flex-col px-6 pb-6 pt-0">
                {item.imageUrl && <Plate image={{ src: item.imageUrl, alt: item.name }} className="mx-auto -mt-16 w-44" />}
                <h3 className="mt-5 text-xl font-semibold">{item.name}</h3>
                {item.description && <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink/75">{item.description}</p>}
                {item.portion && <p className="mt-3 text-sm font-medium text-ink/60">{item.portion}</p>}
                <div className="mt-5 flex items-center justify-between">
                  <p className="text-2xl font-bold">
                    <span className="text-base font-semibold">Rp</span> {formatHarga(item.price)}
                  </p>
                  <Link href="/menu" aria-label={`Lihat ${item.name} di menu`} className="grid h-11 w-11 place-items-center rounded-full bg-ink text-accent">
                    <ArrowIcon />
                  </Link>
                </div>
              </Reveal>
            ))}
          </ul>
        </section>
      )}

      {/* 3. Kenapa sambel dadak */}
      <section aria-labelledby="sambal-title" className={`${WRAP} mt-24 md:mt-32`}>
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <Reveal y={18} className="relative mx-auto w-full max-w-[460px] pb-10 pr-10">
            <Plate image={AMINOTO_IMAGES.sambal} className="w-full" />
            <Photo image={AMINOTO_IMAGES.bara} className="absolute bottom-0 right-0 aspect-[4/3] w-[48%] rounded-3xl border-4 border-white shadow-xl" />
            <div className="dk-badge absolute left-0 top-0 h-24 w-24" aria-hidden>
              <span className="text-sm font-bold leading-tight">
                {sambal.badge.top}
                <br />
                {sambal.badge.bottom}
              </span>
            </div>
          </Reveal>
          <Reveal y={18} delay={0.08}>
            <Eyebrow>Sambel dadak</Eyebrow>
            <h2 id="sambal-title" className="dk-title mt-3 text-[clamp(30px,4vw,48px)]">
              <Marked text={sambal.title} />
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink/80">{sambal.body}</p>
            <ul className="mt-7 space-y-3">
              {sambal.points.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span aria-hidden className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent text-ink">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                      <path d="M5 12l4 4 10-10" />
                    </svg>
                  </span>
                  <span className="font-medium">{p}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* 4. Cabang */}
      {branches.length > 0 && (
        <section aria-labelledby="cabang-title" className={`${WRAP} mt-24 md:mt-32`}>
          <Eyebrow>Cabang</Eyebrow>
          <h2 id="cabang-title" className="dk-title mt-3 text-[clamp(30px,4vw,48px)]">
            {AMINOTO.branches.title}
          </h2>
          <p className="mt-3 max-w-xl text-ink/75">{AMINOTO.branches.lead}</p>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {branches.map((b) => (
              <li key={b.id}>
                <DadakBranchCard branch={b} brandName={brandName} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 5. Catering */}
      <section aria-labelledby="catering-title" className={`${WRAP} mt-24 md:mt-32`}>
        <div className="dk-dark relative grid items-center gap-10 overflow-hidden rounded-[2rem] bg-ink px-6 py-10 text-white sm:px-10 md:grid-cols-[1.2fr_1fr] md:py-14 lg:px-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Catering</p>
            <h2 id="catering-title" className="dk-title mt-3 text-[clamp(28px,3.6vw,44px)]">
              <Marked text={catering.title} />
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/80">{catering.body}</p>
            <a
              href={whatsappUrl(catering.whatsapp, catering.message)}
              target="_blank"
              rel="noopener noreferrer"
              data-track={trackName("wa", "catering")}
              className="dk-btn dk-btn-lime mt-8"
            >
              <WhatsAppIcon className="h-5 w-5" /> {catering.cta}
              <span className="dk-btn-arrow !bg-ink !text-accent">
                <ArrowIcon />
              </span>
            </a>
          </div>
          <Photo image={AMINOTO_IMAGES.setMakan} className="aspect-[4/3] w-full rounded-3xl md:aspect-[5/4]" />
        </div>
      </section>
    </div>
  );
}
