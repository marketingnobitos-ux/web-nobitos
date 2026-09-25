import Link from "next/link";
import PhotoArt from "@/components/templates/anglo/PhotoArt";
import StickObserver from "@/components/templates/anglo/StickObserver";
import { AngloStove, WokFlame } from "@/components/templates/anglo/illustrations";
import { Emph, StickerLabels, WRAP } from "@/components/templates/anglo/shared";
import { BAKMI_PAK_JOKO } from "@/data/brands/bakmi-pak-joko";

/** Cerita Anglo (brief 4.4): judul spidol di kertas krem, paragraf mesin ketik di kertas tempel. */
export default function AngloStory() {
  const { story, hero } = BAKMI_PAK_JOKO;
  return (
    <div className="ag-noise bg-paper text-ink">
      <section className={`${WRAP} grid items-center gap-12 py-14 md:py-24 lg:grid-cols-[1.2fr_1fr]`}>
        <div>
          <StickerLabels text={hero.label} />
          <h1 className="ag-marker mt-7 max-w-[12ch] text-[clamp(60px,9vw,136px)]">{story.title}</h1>
        </div>
        <div className="flex items-end justify-center gap-0">
          <div data-stick className="w-[48%] max-w-[220px] -rotate-6">
            <PhotoArt slot="anglo" sticker>
              <AngloStove sticker />
            </PhotoArt>
          </div>
          <div data-stick className="-ml-4 mb-10 w-[44%] max-w-[200px] rotate-6">
            <PhotoArt slot="wajan" sticker>
              <WokFlame sticker />
            </PhotoArt>
          </div>
        </div>
      </section>

      <section className="ag-noise border-y-2 border-ink bg-kunyit py-16 md:py-24">
        <div className={WRAP}>
          <div data-stick className="ag-paper ag-tape relative mx-auto max-w-3xl space-y-6 p-6 pt-10 text-lg leading-relaxed sm:p-10 md:text-xl">
            {story.paragraphs.map((p) => (
              <p key={p}>
                <Emph text={p} />
              </p>
            ))}
            <div className="flex flex-wrap gap-3 pt-4">
              <Link href="/menu" className="ag-pill bg-accent text-ink">
                {hero.ctaMenu}
              </Link>
              <Link href="/cabang" className="ag-pill bg-white text-ink hover:bg-ink hover:text-sheet">
                {hero.ctaLocation}
              </Link>
            </div>
          </div>
        </div>
      </section>
      <StickObserver />
    </div>
  );
}
