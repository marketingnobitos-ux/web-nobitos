import Link from "next/link";
import BuJokoNotice from "@/components/templates/anglo/BuJokoNotice";
import StickObserver from "@/components/templates/anglo/StickObserver";
import { AngloStove, IcedTea, MenuIllustration, NoodleBowl, WokFlame } from "@/components/templates/anglo/illustrations";
import { Emph, Smoke, StickerLabels, SwipeHint, WRAP, formatHarga } from "@/components/templates/anglo/shared";
import { BAKMI_PAK_JOKO } from "@/data/brands/bakmi-pak-joko";

type FeaturedItem = { id: string; name: string; description: string | null; price: number };

// Ilustrasi kartu "Kenapa Anglo" & putaran kertas tempel (pengganti foto sampai foto asli masuk).
const WHY_ART = [AngloStove, WokFlame, NoodleBowl];
const TILT = ["md:-rotate-2", "md:rotate-1", "md:-rotate-1"];

/**
 * Potongan stiker bebas (ilustrasi dengan tepi putih mengikuti bentuk), opsional dengan label stiker
 * dan asap. `className` wajib memuat posisi (relative/absolute).
 */
function Cutout({
  children,
  className = "",
  sticker,
  stickerAlign = "center",
  stickerTop = false,
  smoke = false,
}: {
  children: React.ReactNode;
  className?: string;
  sticker?: string;
  /** Rata label: "start"/"end" untuk potongan di tepi layar supaya label tidak terpotong. */
  stickerAlign?: "center" | "start" | "end";
  /** Label di atas potongan (bukan di bawah), supaya tidak bertabrakan dengan label tetangga. */
  stickerTop?: boolean;
  smoke?: boolean;
}) {
  const align = { center: "left-1/2 -translate-x-1/2", start: "left-0", end: "right-0" }[stickerAlign];
  return (
    <div data-stick className={className}>
      <div className="relative text-ink">
        {children}
        {smoke && <Smoke />}
      </div>
      {sticker && <span className={`ag-sticker absolute -rotate-3 ${stickerTop ? "-top-4" : "-bottom-3"} ${align}`}>{sticker}</span>}
    </div>
  );
}

/** Beranda Anglo (brief 6.3): hero kolase, "Kenapa Anglo", papan Menu Andalan, strip Dapur Bu Joko. */
export default function AngloHome({ featured }: { featured: FeaturedItem[] }) {
  const { hero, whyAnglo, featured: featuredCopy, ui } = BAKMI_PAK_JOKO;
  const [stickerAnglo, stickerHours] = hero.stickers;

  return (
    <>
      {/* 1. Hero kolase di atas kertas krem */}
      <section aria-labelledby="hero-title" className="ag-noise relative overflow-hidden bg-paper text-ink">
        <div className={`${WRAP} relative flex flex-col items-center py-14 text-center md:py-20 lg:min-h-[calc(100svh-4rem)] lg:justify-center`}>
          <Cutout className="absolute left-10 top-16 hidden w-[190px] -rotate-6 lg:block xl:left-16" sticker={stickerAnglo}>
            <WokFlame sticker />
          </Cutout>
          <Cutout className="absolute right-10 top-20 hidden w-[200px] rotate-6 lg:block xl:right-16">
            <NoodleBowl sticker />
          </Cutout>
          <Cutout className="absolute bottom-20 left-16 hidden w-[170px] rotate-3 lg:block xl:left-28" sticker={stickerHours} smoke>
            <AngloStove sticker />
          </Cutout>
          <Cutout className="absolute bottom-24 right-20 hidden w-[140px] -rotate-6 lg:block xl:right-28">
            <IcedTea sticker />
          </Cutout>

          <StickerLabels text={hero.label} className="justify-center" />
          <h1 id="hero-title" className="ag-marker mt-8 max-w-[11ch] text-[clamp(64px,10vw,150px)]">
            <Emph text={hero.title} />
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed md:text-xl">
            <Emph text={hero.subtitle} />
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/menu" data-track="cta-lihat-menu" className="ag-pill bg-accent text-ink">
              {hero.ctaMenu}
            </Link>
            <Link href="/cabang" data-track="cta-cari-lokasi" className="ag-pill bg-white text-ink hover:bg-ink hover:text-sheet">
              {hero.ctaLocation}
            </Link>
          </div>
          <p className="mt-5 font-mono text-xs font-bold uppercase tracking-wider">{hero.hours}</p>

          {/* Kolase di HP & tablet: potongan ditumpuk di bawah teks. */}
          <div className="mt-14 flex w-full max-w-md items-end justify-center lg:hidden">
            <Cutout className="relative w-[34%] max-w-[170px] -rotate-6" sticker={stickerAnglo} stickerAlign="start" stickerTop>
              <WokFlame sticker />
            </Cutout>
            <Cutout className="relative z-10 -mx-3 mb-6 w-[36%] max-w-[180px] rotate-3">
              <NoodleBowl sticker />
            </Cutout>
            <Cutout className="relative w-[30%] max-w-[150px] rotate-6" sticker={stickerHours} stickerAlign="end" smoke>
              <AngloStove sticker />
            </Cutout>
          </div>
        </div>
      </section>

      {/* 2. "Pelan, karena pakai arang." — kertas tempel di blok kunyit */}
      <section aria-labelledby="why-title" className="ag-noise border-y-2 border-ink bg-kunyit py-20 text-ink md:py-28">
        <div className={WRAP}>
          <h2 id="why-title" className="ag-marker max-w-[14ch] text-[clamp(52px,7vw,104px)]">
            {whyAnglo.title}
          </h2>
        </div>
        <ul aria-label={whyAnglo.title} className="ag-rail mt-8 md:mx-auto md:mt-14 md:grid md:max-w-[1320px] md:grid-cols-3 md:gap-8 md:overflow-visible md:px-10">
          {whyAnglo.cards.map((card, i) => {
            const Art = WHY_ART[i % WHY_ART.length];
            return (
              <li key={card.title} data-stick className={`ag-paper ag-tape relative flex flex-col p-6 pt-9 ${TILT[i % TILT.length]}`}>
                <div className="flex items-start justify-between gap-4">
                  <span className="ag-sticker rotate-2">0{i + 1}</span>
                  <Art className="h-24 w-24 shrink-0" />
                </div>
                <h3 className="ag-marker mt-4 text-[2.6rem]">{card.title}</h3>
                <p className="mt-3 leading-relaxed">{card.body}</p>
              </li>
            );
          })}
        </ul>
        <SwipeHint className="mt-2" />
      </section>

      {/* 3. Menu Andalan — papan pengumuman di atas rak kayu, blok biru enamel */}
      {featured.length > 0 && (
        <section aria-labelledby="featured-title" className="ag-noise bg-enamel py-20 text-ink md:py-28">
          <div className={`${WRAP} flex flex-col gap-6 md:flex-row md:items-end md:justify-between`}>
            <div>
              <p data-stick className="ag-sticker ag-sticker-light -rotate-2">{ui.featuredSticker}</p>
              <h2 id="featured-title" className="ag-marker mt-5 max-w-[16ch] text-[clamp(48px,6.5vw,96px)]">
                {featuredCopy.title}
              </h2>
            </div>
            <Link href="/menu" data-track="cta-andalan-lihat-menu" className="ag-pill self-start bg-accent text-ink md:self-end">
              {hero.ctaMenu}
            </Link>
          </div>

          <div className={`${WRAP} mt-12 md:mt-16`}>
            {/* Papan */}
            <div className="ag-noise relative border-2 border-ink bg-paper px-0 py-6 md:px-12 md:py-14">
              <ul aria-label={featuredCopy.title} className="ag-rail md:mx-auto md:grid md:max-w-4xl md:grid-cols-2 md:gap-12 md:overflow-visible md:p-0">
                {featured.map((item, i) => (
                  <li key={item.id} data-stick className={`flex ${i % 2 ? "rotate-1" : "-rotate-1"}`}>
                    {/* Poster: goyang tipis saat hover (desktop), berporos di paku. */}
                    <div className="ag-poster relative w-full border-2 border-ink bg-white p-6 pt-10 text-center">
                      <span aria-hidden className="absolute left-1/2 top-3 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-ink bg-accent" />
                      <MenuIllustration name={item.name} className="mx-auto h-28 w-28" />
                      <h3 className="ag-marker mt-4 text-[clamp(2.4rem,4vw,3.4rem)]">{item.name}</h3>
                      <p className="ag-sticker mt-4 text-sm">{formatHarga(item.price)}</p>
                      {item.description && <p className="mx-auto mt-4 max-w-xs leading-relaxed">{item.description}</p>}
                    </div>
                  </li>
                ))}
              </ul>
              <SwipeHint />
            </div>
            {/* Rak kayu */}
            <div aria-hidden className="relative -mx-2 h-5 border-2 border-ink bg-wood md:-mx-6">
              <span className="absolute left-[12%] top-full h-8 w-3 border-2 border-t-0 border-ink bg-wood" />
              <span className="absolute right-[12%] top-full h-8 w-3 border-2 border-t-0 border-ink bg-wood" />
            </div>
          </div>
        </section>
      )}

      {/* 4. Strip Dapur Bu Joko — blok hijau */}
      <section aria-label="Dapur Bu Joko" className="ag-noise border-y-2 border-ink bg-daun py-12 md:py-14">
        <div className={WRAP}>
          <BuJokoNotice track="ig-bujoko-beranda" />
        </div>
      </section>

      <StickObserver />
    </>
  );
}
