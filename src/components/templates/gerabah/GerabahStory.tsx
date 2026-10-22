import { BoardHero, Kicker, Photo, Pill, WRAP } from "@/components/templates/gerabah/shared";
import { GR_PHOTOS } from "@/data/brands/apw-gerabah";
import { gerabahText } from "@/lib/template-text";
import { trackName } from "@/lib/track";

/** Halaman Cerita Gerabah: papan judul, tiga bab foto & teks berselang-seling, kartu kaca tambahan, penutup. */
export default async function GerabahStory() {
  const GR = await gerabahText();
  const { story } = GR;
  return (
    <>
      <BoardHero kicker={GR.since} title={story.title} lead={story.lead} dish={GR_PHOTOS.ayamTungku} />

      <div className="bg-[var(--gr-char)]">
        {story.chapters.map((ch, i) => (
          <section key={ch.title} aria-labelledby={`bab-${i}`} className="border-b border-[var(--gr-line)] py-16 md:py-24">
            <div className={`${WRAP} grid items-center gap-10 md:grid-cols-2 md:gap-16`}>
              <Photo
                photo={GR_PHOTOS[ch.photo]}
                className={`aspect-[4/5] w-full rounded-[28px] ring-1 ring-[var(--gr-line)] md:max-h-[640px] ${i % 2 === 1 ? "md:order-2" : ""}`}
              />
              <div>
                <p className="gr-display text-[64px] leading-none text-[var(--gr-clay)]">{String(i + 1).padStart(2, "0")}</p>
                <Kicker className="mt-6 text-[var(--gr-cream)]/75">{ch.kicker}</Kicker>
                <h2 id={`bab-${i}`} className="gr-serif mt-4 text-[clamp(34px,4.4vw,56px)]">
                  {ch.title}
                </h2>
                <p className="mt-6 max-w-[52ch] text-[17px] leading-[1.75] text-[var(--gr-cream)]/85">{ch.body}</p>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section aria-labelledby="extras-title" className="gr-lines bg-[var(--gr-leaf)] py-16 md:py-24">
        <div className={WRAP}>
          <h2 id="extras-title" className="gr-display text-[clamp(32px,4vw,56px)]">
            Datang ke sini
          </h2>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {story.extras.map((x) => (
              <li key={x.title} className="gr-glass p-6 md:p-7">
                <h3 className="gr-serif text-[26px]">{x.title}</h3>
                <p className="mt-3 leading-relaxed text-[var(--gr-cream)]/90">{x.body}</p>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <Pill href="/menu" track={trackName("menu")} variant="gold">
              Lihat menu
            </Pill>
            <Pill href="/cabang" track={trackName("cabang")}>
              Lokasi &amp; jam
            </Pill>
          </div>
        </div>
      </section>
    </>
  );
}
