import Reveal from "@/components/animations/Reveal";
import { Sticker } from "@/components/public/home/HeroSection";
import { imageSrcSet } from "@/lib/image";
import { formatDate } from "@/lib/format";

type Promo = { id: string; title: string; description: string | null; imageUrl: string | null; endsAt: Date | null };

/**
 * Promo sebagai poster: blok warna penuh, judul raksasa, foto miring seperti ditempel.
 * Promo pertama pakai warna aksen, berikutnya warna brand, supaya ritmenya beda.
 */
export default function PromoPoster({ promos, fallbackPhoto }: { promos: Promo[]; fallbackPhoto: string }) {
  return (
    <section aria-label="Promo">
      {promos.map((p, i) => {
        const photo = p.imageUrl ?? fallbackPhoto;
        const flip = i % 2 === 1;
        return (
          <article
            key={p.id}
            className={`grain relative isolate overflow-hidden text-paper ${i % 2 === 0 ? "bg-ink-deep" : "bg-ink"}`}
          >
            <div
              className={`mx-auto grid max-w-[1400px] items-center gap-10 px-4 py-20 sm:px-6 md:grid-cols-[1.25fr_1fr] md:py-28 ${
                flip ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div>
                <Reveal>
                  <p className="inline-flex rounded-full bg-accent px-4 py-1.5 text-sm font-bold">Lagi ada promo, nih</p>
                </Reveal>
                <Reveal delay={0.05}>
                  <h2 className="display mt-5 max-w-2xl text-[clamp(32px,5vw,64px)] leading-[1.05] [overflow-wrap:anywhere]">{p.title}</h2>
                </Reveal>
                {p.description && (
                  <Reveal delay={0.1}>
                    <p className="mt-6 max-w-lg text-lg text-paper/90 md:text-xl">{p.description}</p>
                  </Reveal>
                )}
                <Reveal delay={0.15} className="mt-8 flex flex-wrap items-center gap-4">
                  {p.endsAt && (
                    <span className="rounded-full border-2 border-paper px-5 py-2 text-sm font-semibold">
                      Sampai {formatDate(p.endsAt)}
                    </span>
                  )}
                  <a
                    href="/cabang"
                    data-track={`promo-${i + 1}`}
                    className="inline-flex h-13 items-center rounded-full bg-paper px-7 font-semibold text-ink transition hover:bg-paper/85"
                  >
                    Serbu ke cabang →
                  </a>
                </Reveal>
              </div>

              <Reveal y={60} className="relative mx-auto w-full max-w-md">
                <div className={`overflow-hidden rounded-[1.5rem] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)] ${flip ? "rotate-3" : "-rotate-3"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo}
                    srcSet={imageSrcSet(photo)}
                    sizes="(min-width: 768px) 420px, 90vw"
                    alt={p.title}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
                <div className={`absolute -bottom-6 w-28 md:w-36 ${flip ? "-left-4" : "-right-4"}`}>
                  <Sticker text="Promo terbatas" />
                </div>
              </Reveal>
            </div>
          </article>
        );
      })}
    </section>
  );
}
