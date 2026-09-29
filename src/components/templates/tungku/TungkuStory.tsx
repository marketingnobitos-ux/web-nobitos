import Reveal from "@/components/animations/Reveal";
import { Photo, TkButton, WRAP } from "@/components/templates/tungku/shared";
import { APW, APW_IMAGES } from "@/data/brands/apw";
import { trackName } from "@/lib/track";

const num = (i: number) => String(i + 1).padStart(2, "0");

/** Halaman Cerita (desain Figma "Cerita — Desktop 1440"): babak bernomor dengan foto berselang-seling, lalu penutup. */
export default function TungkuStory() {
  const { story } = APW;

  return (
    <div className="overflow-hidden pb-24 pt-16 md:pb-32 md:pt-24">
      <Reveal y={16} className={`${WRAP} text-center`}>
        <h1 className="tk-caps text-[clamp(34px,4vw,48px)] tracking-[0.12em]">{story.title}</h1>
        <p className="tk-display mt-5 text-xl text-brand md:text-[22px]">{APW.slogan}</p>
      </Reveal>

      <div className={`${WRAP} mt-16 space-y-20 md:mt-24 md:space-y-32`}>
        {story.chapters.map((ch, i) => {
          const imageLeft = i % 2 === 0;
          return (
            <section key={ch.title} aria-labelledby={`bab-${i}`} className="grid items-center gap-10 md:grid-cols-2 md:gap-20">
              <Reveal y={16} className={`relative ${imageLeft ? "mr-6 md:mr-0" : "ml-6 md:order-2 md:ml-0"}`}>
                <div aria-hidden className={`bg-paper-deep absolute -bottom-6 top-10 w-full ${imageLeft ? "-left-6 md:-left-10" : "-right-6 md:-right-10"}`} />
                <Photo image={APW_IMAGES[ch.image as "ceritaMasuk" | "ceritaDeretan"]} className="relative aspect-[4/5] w-full" />
              </Reveal>
              <Reveal y={16} delay={0.1}>
                <p className="tk-caps text-sm tracking-[0.2em] text-brand">{num(i)}</p>
                <h2 id={`bab-${i}`} className="tk-caps mt-3 text-[clamp(24px,2.4vw,30px)] tracking-[0.08em]">
                  {ch.title}
                </h2>
                <p className="mt-5 max-w-[480px] text-[17px] leading-[1.75] text-ink/85">{ch.body}</p>
              </Reveal>
            </section>
          );
        })}

        <div className="grid gap-14 md:grid-cols-2 md:gap-20">
          {story.extras.map((ex, i) => (
            <Reveal y={16} delay={i * 0.1} as="section" key={ex.title}>
              <p className="tk-caps text-sm tracking-[0.2em] text-brand">{num(story.chapters.length + i)}</p>
              <h2 id={`bab-x-${i}`} className="tk-caps mt-3 text-[clamp(24px,2.4vw,30px)] tracking-[0.08em]">
                {ex.title}
              </h2>
              <p className="mt-5 max-w-[500px] text-[17px] leading-[1.75] text-ink/85">{ex.body}</p>
            </Reveal>
          ))}
        </div>

        <section aria-labelledby="bab-penutup" className="relative">
          <Reveal y={16}>
            <Photo image={APW_IMAGES.suasana} className="-mx-4 aspect-[4/3] w-[calc(100%+2rem)] max-w-none sm:mx-0 sm:w-full md:aspect-[16/9]" />
          </Reveal>
          <div className="relative -mt-12 ml-6 bg-paper p-6 md:absolute md:-bottom-16 md:right-8 md:ml-0 md:mt-0 md:w-[460px] md:p-9">
            <h2 id="bab-penutup" className="tk-caps text-xl tracking-[0.08em] md:text-[22px]">
              {story.closing.title}
            </h2>
            <p className="mt-4 leading-[1.7] text-ink/85">{story.closing.body}</p>
          </div>
        </section>

        <div className="flex flex-wrap justify-center gap-4 pt-4 md:pt-16">
          <TkButton href="/menu" track={trackName("menu")}>
            {APW.featured.cta}
          </TkButton>
          <TkButton href="/cabang" track={trackName("cabang")} ghost>
            {APW.location.cta} <span aria-hidden>→</span>
          </TkButton>
        </div>
      </div>
    </div>
  );
}
