import Reveal from "@/components/animations/Reveal";
import { DkButton, Eyebrow, Photo, Plate, WRAP } from "@/components/templates/dadak/shared";
import { AMINOTO, AMINOTO_IMAGES } from "@/data/brands/aminoto";
import { trackName } from "@/lib/track";

/** Halaman Cerita: judul + piring, tiga paragraf, empat nilai dalam kartu kaca, foto suasana. */
export default function DadakStory() {
  const { story } = AMINOTO;

  return (
    <div className={`${WRAP} pb-10 pt-6 text-ink md:pt-8`}>
      <section aria-labelledby="cerita-title" className="dk-glass grid items-center gap-10 overflow-hidden px-5 py-10 sm:px-10 md:py-14 lg:grid-cols-[1.2fr_1fr] lg:px-14">
        <div>
          <Eyebrow>Cerita kami</Eyebrow>
          <h1 id="cerita-title" className="dk-title mt-3 text-[clamp(36px,5vw,62px)]">
            {story.title}
          </h1>
          <div className="mt-7 space-y-5 text-lg leading-relaxed text-ink/80">
            {story.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <div className="mx-auto w-full max-w-[440px] px-4">
          <Plate image={AMINOTO_IMAGES.pecelLele} priority className="w-full" />
        </div>
      </section>

      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {story.values.map((v, i) => (
          <Reveal as="li" key={v.title} delay={i * 0.06} y={14} className="dk-glass p-6">
            <span aria-hidden className="grid h-10 w-10 place-items-center rounded-full bg-accent text-sm font-bold">
              0{i + 1}
            </span>
            <h2 className="mt-4 text-xl font-semibold">{v.title}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/75">{v.body}</p>
          </Reveal>
        ))}
      </ul>

      <section aria-label="Suasana warung" className="mt-6 grid gap-5 md:grid-cols-[1.4fr_1fr]">
        <Photo image={AMINOTO_IMAGES.suasana} className="aspect-[4/3] w-full rounded-[2rem]" />
        <div className="dk-glass flex flex-col justify-between gap-8 p-7">
          <p className="dk-title text-[clamp(24px,2.6vw,32px)]">Lebih enak dimakan di tempat, selagi sambalnya masih segar.</p>
          <DkButton href="/cabang" track={trackName("cabang")} className="self-start">
            Cari cabang terdekat
          </DkButton>
        </div>
      </section>
    </div>
  );
}
