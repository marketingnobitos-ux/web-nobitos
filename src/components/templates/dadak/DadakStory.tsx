import { ClosingCta, DEEP, Label, PageHero, PhotoStrip, WRAP } from "@/components/templates/dadak/shared";
import { AMINOTO, AMINOTO_IMAGES } from "@/data/brands/aminoto";

/** Halaman Cerita: hero foto, cerita dua kolom, strip foto, empat hal yang dijaga, penutup. */
export default function DadakStory() {
  const { story } = AMINOTO;

  return (
    <>
      <PageHero image={AMINOTO_IMAGES.heroCerita} title={story.title} />

      <section aria-label={story.label} className={`${WRAP} grid gap-8 py-20 md:grid-cols-[1fr_1.25fr] md:py-28`}>
        <Label>{story.label}</Label>
        <div className="space-y-6 text-lg leading-relaxed">
          {story.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>

      <div className="pb-2">
        <PhotoStrip />
      </div>

      <section aria-labelledby="nilai-title" className={`${DEEP} mt-2 py-20 md:py-28`}>
        <div className={WRAP}>
          <h2 id="nilai-title" className="dk-display text-[clamp(40px,5vw,68px)]">
            {story.valuesTitle}
          </h2>
          <ol className="mt-12 grid gap-px bg-white/15 sm:grid-cols-2 lg:grid-cols-4">
            {story.values.map((v, i) => (
              <li key={v.title} className="bg-[var(--dk-deep)] p-6 pt-8">
                <span className="dk-display text-5xl text-accent">0{i + 1}</span>
                <h3 className="dk-display mt-6 text-3xl">{v.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-white/75">{v.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
