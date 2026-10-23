import Link from "next/link";
import DadakBranchCard, { type DadakBranch } from "@/components/templates/dadak/DadakBranchCard";
import { ArrowUpRight, Btn, ClosingCta, DEEP, Img, Label, PageHero, PhotoStrip, WRAP, formatHarga } from "@/components/templates/dadak/shared";
import { AMINOTO_IMAGES } from "@/data/brands/aminoto";
import { dadakText } from "@/lib/template-text";
import { whatsappUrl } from "@/lib/format";
import { trackName } from "@/lib/track";

export type DadakFeatured = {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
};

type Props = { brandName: string; featured: DadakFeatured[]; branches: DadakBranch[] };

/**
 * Beranda Dadak (referensi Fran "kado"): hero foto penuh, sambutan dua kolom, strip foto, menu andalan di hijau tua,
 * panel catering + "bisa dibakar", cabang, rating Google di atas foto, penutup.
 */
export default async function DadakHome({ brandName, featured, branches }: Props) {
  const AMINOTO = await dadakText();
  const { hero, intro, catering, bakar, ratings } = AMINOTO;

  return (
    <>
      {/* 1. Hero */}
      <PageHero image={AMINOTO_IMAGES.hero} title={hero.title} sub={hero.sub} tall>
        <Btn href="/cabang" track={trackName("cabang")} variant="cream" arrow={false}>
          {hero.cta}
        </Btn>
      </PageHero>

      {/* 2. Sambutan */}
      <section aria-labelledby="intro-title" className={`${WRAP} grid gap-8 py-20 md:grid-cols-[1fr_1.25fr] md:py-28`}>
        <Label>
          {intro.label} <span className="font-bold">{AMINOTO.shortName}</span>
        </Label>
        <div>
          <h2 id="intro-title" className="dk-display text-[clamp(38px,4.6vw,62px)]">
            {intro.title}
          </h2>
          <p className="dk-caps mt-6 max-w-[52ch] text-[15px] font-medium leading-relaxed">{intro.body}</p>
          <Btn href="/cerita" track={trackName("cerita")} variant="line" className="mt-8">
            {intro.cta}
          </Btn>
        </div>
      </section>

      {/* 3. Strip foto */}
      <div className="pb-2">
        <PhotoStrip />
      </div>

      {/* 4. Menu andalan */}
      {featured.length > 0 && (
        <section aria-labelledby="featured-title" className={`${DEEP} mt-2 py-20 md:py-28`}>
          <div className={WRAP}>
            <Label className="text-center text-accent">{AMINOTO.featured.label}</Label>
            <h2 id="featured-title" className="dk-display mx-auto mt-4 max-w-[16ch] text-center text-[clamp(40px,5.4vw,72px)]">
              {AMINOTO.featured.title}
            </h2>
            <ul className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {featured.map((item) => (
                <li key={item.id}>
                  <Link href="/menu" data-track={trackName("menu")} className="dk-frame group block overflow-hidden">
                    {item.imageUrl && (
                      <Img image={{ src: item.imageUrl, alt: item.name }} sizes="(min-width: 768px) 25vw, 50vw" className="aspect-[3/4] w-full transition-transform duration-500 group-hover:scale-[1.03]" />
                    )}
                    <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgb(10_34_25/0.65)_0%,transparent_30%,transparent_65%,rgb(10_34_25/0.75)_100%)]" />
                    <p className="dk-display absolute left-6 right-6 top-6 text-lg leading-tight md:text-xl">{item.name}</p>
                    <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                      <p className="dk-caps text-[15px] font-semibold">Rp {formatHarga(item.price)}</p>
                      <span className="grid h-7 w-7 place-items-center bg-accent text-[var(--dk-deep)]">
                        <ArrowUpRight />
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-12 text-center">
              <Btn href="/menu" track={trackName("menu")} variant="line">
                {AMINOTO.featured.cta}
              </Btn>
            </div>
          </div>
        </section>
      )}

      {/* 5. Catering + bisa dibakar */}
      <section aria-label="Catering dan menu bakar" className="grid md:grid-cols-2">
        <div className="dk-wash-lime flex flex-col items-center justify-center px-6 py-20 text-center md:py-24">
          <h2 className="dk-display max-w-[13ch] text-[clamp(36px,4.2vw,56px)]">{catering.title}</h2>
          <Img image={AMINOTO_IMAGES.strip[1]} sizes="128px" className="mt-8 aspect-[3/4] w-32" />
          <p className="dk-caps mt-8 max-w-[34ch] text-[14px] font-medium leading-relaxed">{catering.body}</p>
          <a href={whatsappUrl(catering.whatsapp, catering.message)} target="_blank" rel="noopener noreferrer" data-track={trackName("wa", "catering")} className="dk-btn dk-btn-line mt-8">
            {catering.cta}
          </a>
        </div>
        <div className={`relative isolate flex min-h-[520px] items-end ${DEEP}`}>
          <Img image={AMINOTO_IMAGES.panelBara} sizes="(min-width: 768px) 50vw, 100vw" className="absolute inset-0 -z-20 h-full w-full" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(10_34_25/0.2)_0%,rgb(10_34_25/0.92)_78%)]" />
          <div className="p-6 sm:p-10">
            <p className="dk-caps text-[13px] font-medium text-accent">{bakar.label}</p>
            <h2 className="dk-display mt-3 text-[clamp(44px,5vw,68px)]">{bakar.title}</h2>
            <p className="dk-caps mt-2 text-[15px] font-medium">{bakar.sub}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="dk-btn dk-btn-cream pointer-events-none">{bakar.price}</span>
              <Btn href="/menu" track={trackName("menu")} variant="lime">
                {bakar.cta}
              </Btn>
            </div>
            <p className="mt-5 max-w-[42ch] text-sm leading-relaxed text-white/75">{bakar.body}</p>
          </div>
        </div>
      </section>

      {/* 6. Cabang */}
      {branches.length > 0 && (
        <section aria-labelledby="cabang-title" className={`${WRAP} grid gap-10 py-20 md:grid-cols-[0.8fr_1.2fr] md:py-28`}>
          <div>
            <h2 id="cabang-title" className="dk-display max-w-[10ch] text-[clamp(40px,5vw,68px)]">
              {AMINOTO.branches.title}
            </h2>
            <p className="dk-caps mt-5 max-w-[36ch] text-[14px] font-medium leading-relaxed">{AMINOTO.branches.lead}</p>
            <Btn href="/cabang" track={trackName("cabang")} variant="line" className="mt-7">
              {AMINOTO.branches.cta}
            </Btn>
          </div>
          <div className="border-b border-current/20">
            {branches.map((b) => (
              <DadakBranchCard key={b.id} branch={b} brandName={brandName} />
            ))}
          </div>
        </section>
      )}

      {/* 7. Rating Google */}
      <section aria-labelledby="rating-title" className={`relative isolate overflow-hidden ${DEEP}`}>
        <Img image={AMINOTO_IMAGES.latar} width={1080} height={720} className="absolute inset-0 -z-20 h-full w-full" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[rgb(10_34_25/0.78)]" />
        <div className={`${WRAP} py-20 md:py-28`}>
          <h2 id="rating-title" className="dk-display max-w-[12ch] text-[clamp(40px,5vw,68px)]">
            {ratings.title}
          </h2>
          <ul className="mt-12 grid gap-4 sm:grid-cols-3 md:gap-6">
            {ratings.items.map((r, i) => (
              <li key={r.branch} className={`${i === 1 ? "dk-wash-cream md:mt-14" : "dk-wash-lime"} ${i === 2 ? "md:mt-6" : ""} p-6 text-[var(--dk-deep)]`}>
                <p className="dk-caps text-[13px] font-semibold">Aminoto {r.branch}</p>
                <p className="dk-display mt-6 text-7xl">
                  {r.rating}
                  <span className="ml-1 text-2xl">/5</span>
                </p>
                <p className="dk-caps mt-6 border-t border-current/20 pt-3 text-[13px] font-medium">{r.count} di Google Maps</p>
              </li>
            ))}
          </ul>
          <p className="dk-caps mt-6 text-xs text-white/60">{ratings.note}</p>
        </div>
      </section>

      {/* 8. Penutup */}
      <ClosingCta />
    </>
  );
}
