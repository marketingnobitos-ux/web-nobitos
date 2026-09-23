import type { Promo } from "@prisma/client";
import Reveal from "@/components/animations/Reveal";
import { formatDate } from "@/lib/format";
import { imageSrcSet, imageVariant } from "@/lib/image";

/**
 * Sorotan promo: gambar lebar dengan kartu putih yang "menimpa" bagian bawahnya.
 * Promo tambahan tampil sebagai kartu kecil di bawahnya.
 */
export default function PromoSpotlight({ promos }: { promos: Promo[] }) {
  const [main, ...rest] = promos;

  return (
    <section className="py-16 sm:py-24" aria-labelledby="promo-title">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="relative overflow-hidden rounded-[2rem] bg-primary">
          {main.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageVariant(main.imageUrl, 1000)}
              srcSet={imageSrcSet(main.imageUrl)}
              sizes="(min-width: 1152px) 1152px, 100vw"
              alt={main.title}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover sm:aspect-[21/9]"
            />
          ) : (
            <div className="relative aspect-[4/3] w-full sm:aspect-[21/9]" aria-hidden>
              <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent_0_22px,color-mix(in_oklab,white_10%,transparent)_22px_24px)]" />
              <span className="absolute -right-6 -top-10 font-display text-[12rem] font-extrabold leading-none text-white/10 sm:text-[18rem]">%</span>
            </div>
          )}
        </Reveal>

        <Reveal delay={0.1} className="relative z-10 mx-4 -mt-24 rounded-3xl bg-white p-6 text-center shadow-xl sm:mx-auto sm:-mt-32 sm:max-w-2xl sm:p-10">
          <span className="inline-block rounded-full bg-primary px-4 py-1 text-xs font-bold uppercase tracking-widest text-white">Promo</span>
          <h2 id="promo-title" className="mt-4 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {main.title}
          </h2>
          {main.description && <p className="mt-3 text-ink/70 sm:text-lg">{main.description}</p>}
          {main.endsAt && <p className="mt-4 text-sm font-semibold text-primary">Berlaku sampai {formatDate(main.endsAt)}</p>}
        </Reveal>

        {rest.length > 0 && (
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {rest.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
                {p.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageVariant(p.imageUrl, 400)} alt="" loading="lazy" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                )}
                <div>
                  <h3 className="font-display font-bold text-ink">{p.title}</h3>
                  {p.description && <p className="line-clamp-2 text-sm text-ink/65">{p.description}</p>}
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
