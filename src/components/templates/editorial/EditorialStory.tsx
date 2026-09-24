import Reveal from "@/components/animations/Reveal";
import EdLink from "@/components/templates/editorial/EdLink";
import EdRevealImage from "@/components/templates/editorial/EdRevealImage";
import type { Section } from "@/lib/content";
import { realPhoto } from "@/lib/placeholder";

/**
 * Cerita template Editorial: bab-bab bernomor. Bab bergambar tampil dua kolom bergantian
 * (foto terbuka dari bawah saat di-scroll); nilai tampil sebagai daftar bernomor bergaris.
 */
export default function EditorialStory({ brandName, tagline, sections }: { brandName: string; tagline: string | null; sections: Section[] }) {
  return (
    <div className="bg-paper">
      <header className="mx-auto max-w-[1440px] px-5 pb-16 pt-20 sm:px-8 md:px-12 md:pb-24 md:pt-32">
        <Reveal>
          <p className="text-sm text-ink/55">{brandName}</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="ed-title mt-3 text-[clamp(52px,9vw,140px)]">
            <em>Cerita</em>
          </h1>
        </Reveal>
        {tagline && (
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-md text-lg text-ink/65">{tagline}</p>
          </Reveal>
        )}
      </header>

      <div className="mx-auto max-w-[1440px] px-5 pb-28 sm:px-8 md:px-12 md:pb-40">
        {sections.length === 0 && <p className="text-ink/60">Cerita belum tersedia.</p>}
        {sections.map((section, i) => {
          const { title, subtitle, body, items } = section.data;
          const image = realPhoto(section.data.imageUrl);
          // Bab bergambar bergantian: foto kanan, lalu kiri, dst.
          const flip = sections.slice(0, i).filter((s) => realPhoto(s.data.imageUrl)).length % 2 === 1;
          return (
            <section
              key={section.key}
              className={`grid gap-10 border-t border-ink/15 py-16 md:grid-cols-12 md:gap-12 md:py-24 ${image ? "md:items-center" : ""}`}
            >
              <div className={image ? `md:col-span-5 ${flip ? "md:order-2 md:col-start-8" : ""}` : "md:col-span-4"}>
                <Reveal>
                  <p className="text-sm tabular-nums text-ink/45">{String(i + 1).padStart(2, "0")}</p>
                  {title && <h2 className="ed-title mt-2 text-[clamp(30px,3.4vw,52px)]">{title}</h2>}
                  {subtitle && <p className="mt-3 text-lg italic text-ink/60">{subtitle}</p>}
                </Reveal>
                {image && body && (
                  <Reveal delay={0.08}>
                    <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-ink/75">{body}</p>
                  </Reveal>
                )}
              </div>

              {image ? (
                <div className={`md:col-span-7 ${flip ? "md:order-1 md:col-start-1" : ""}`}>
                  <EdRevealImage src={image} alt={title ?? brandName} className="aspect-[4/3]" />
                </div>
              ) : (
                <div className="md:col-span-8">
                  {body && (
                    <Reveal delay={0.08}>
                      <p className="max-w-2xl whitespace-pre-line text-[clamp(20px,1.8vw,26px)] leading-snug text-ink/80">{body}</p>
                    </Reveal>
                  )}
                  {items && items.length > 0 && (
                    <ul className="mt-2 border-t border-ink/15">
                      {items.map((item, n) => (
                        <Reveal as="li" key={item} delay={n * 0.06} y={12} className="flex items-baseline gap-6 border-b border-ink/15 py-5">
                          <span className="text-sm tabular-nums text-ink/40">{String(n + 1).padStart(2, "0")}</span>
                          <span className="text-[clamp(20px,2vw,28px)] font-medium tracking-tight">{item}</span>
                        </Reveal>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </section>
          );
        })}

        <Reveal className="border-t border-ink/15 pt-16 md:pt-24">
          <EdLink href="/cabang" track="ed-cerita-cabang" className="ed-title text-[clamp(32px,4.5vw,64px)]">
            Kunjungi outlet kami
          </EdLink>
        </Reveal>
      </div>
    </div>
  );
}
