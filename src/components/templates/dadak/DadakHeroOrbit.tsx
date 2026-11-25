import { preload } from "react-dom";
import { Btn, Plate, WRAP } from "@/components/templates/dadak/shared";
import { AMINOTO_IMAGES } from "@/data/brands/aminoto";
import { trackName } from "@/lib/track";

type Props = {
  title: string;
  sub: string;
  cta: string;
  orbit: { words: string[]; ring: string; sticker: string; menuCta: string };
};

/**
 * Hero Beranda Dadak: kata "SAMBEL / DADAK" raksasa di belakang, piring lele bakar (dilihat dari atas) berputar di
 * tengah dengan teks melingkar, tiga piring kecil mengambang di sekitarnya. Saat digulir, kata-kata menjauh dan
 * piring membesar (progres gulir dari DadakScrollFx, variabel --p). Semua gerak berhenti untuk
 * pengguna yang memilih kurangi gerakan.
 */
export default function DadakHeroOrbit({ title, sub, cta, orbit }: Props) {
  const { plates } = AMINOTO_IMAGES;
  preload(plates.lele.src, { as: "image", fetchPriority: "high" });
  const [top, bottom] = orbit.words;

  return (
    <section aria-labelledby="page-title" data-dk-fx="top" className="dk-hero relative isolate overflow-hidden bg-[var(--dk-deep)] pb-14 pt-[150px] text-[var(--dk-cream)] md:pb-20 md:pt-32">
      {/* Cahaya bara di belakang piring */}
      <div aria-hidden className="dk-glow absolute left-1/2 top-[44%] -z-10 aspect-square w-[min(150vw,1100px)] -translate-x-1/2 -translate-y-1/2 rounded-full" />

      {/* Kata raksasa */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[84px] -z-10 select-none text-center md:top-[9%]">
        <p className="dk-display dk-word-l whitespace-nowrap text-[27vw] leading-[0.8] text-accent md:text-[22vw]">{top}</p>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[384px] -z-10 select-none text-center md:top-[50%]">
        <p className="dk-display dk-word-r dk-outline whitespace-nowrap text-[27vw] leading-[0.8] md:text-[22vw]">{bottom}</p>
      </div>

      {/* Piring + orbit */}
      <div className="dk-hero-stage relative mx-auto aspect-square w-[min(66vw,58svh,600px)]">
        <svg aria-hidden viewBox="0 0 200 200" className="dk-spin absolute -inset-[11%] h-[122%] w-[122%] text-[var(--dk-cream)] [animation-direction:reverse] [animation-duration:60s]">
          <defs>
            <path id="dk-ring" d="M100,100 m-94,0 a94,94 0 1,1 188,0 a94,94 0 1,1 -188,0" />
          </defs>
          <text className="dk-caps" fontSize="7.4" letterSpacing="2.2" fill="currentColor" style={{ fontFamily: "var(--font-oswald)" }}>
            {/* textLength = keliling lingkaran, supaya teks pas satu putaran penuh. */}
            <textPath href="#dk-ring" textLength="586" lengthAdjust="spacing">
              {orbit.ring}
            </textPath>
          </text>
        </svg>

        <Plate image={plates.lele} priority speed={90} sizes="(min-width: 768px) 600px, 66vw" className="relative h-full w-full" />

        {/* Piring kecil mengambang */}
        <div className="dk-bob absolute -right-[16%] -top-[10%] w-[34%] [animation-delay:-2s] md:-right-[46%] md:top-[4%] md:w-[40%]">
          <Plate image={plates.ayam} speed={45} reverse sizes="(min-width: 768px) 240px, 28vw" className="w-full" />
        </div>
        <div className="dk-bob absolute -bottom-[8%] -left-[16%] w-[36%] [animation-delay:-4s] md:-left-[50%] md:bottom-[2%] md:w-[44%]">
          <Plate image={plates.sate} speed={55} sizes="(min-width: 768px) 260px, 30vw" className="w-full" />
        </div>
        <div className="dk-bob absolute -left-[12%] -top-[12%] hidden w-[24%] md:-left-[30%] md:-top-[6%] md:block">
          <Plate image={plates.kangkung} speed={40} reverse sizes="150px" className="w-full" />
        </div>

        {/* Stiker */}
        <p className="dk-caps dk-sticker absolute -bottom-[4%] -right-[6%] grid aspect-square w-[30%] place-items-center rounded-full bg-accent p-3 text-center text-[clamp(10px,2.6vw,15px)] font-semibold leading-tight text-[var(--dk-deep)] md:-right-[2%] md:w-[24%]">
          {orbit.sticker}
        </p>
      </div>

      {/* Judul */}
      <div className={`${WRAP} relative mt-24 text-center md:mt-16`}>
        <h1 id="page-title" className="dk-display mx-auto max-w-[17ch] text-[clamp(40px,6vw,84px)]">
          {title}
        </h1>
        <p className="dk-caps mx-auto mt-5 max-w-[38ch] text-[15px] font-medium leading-snug text-[var(--dk-cream)]/85 sm:text-base">{sub}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Btn href="/cabang" track={trackName("cabang")} variant="lime">
            {cta}
          </Btn>
          <Btn href="/menu" track={trackName("menu")} variant="line" arrow={false}>
            {orbit.menuCta}
          </Btn>
        </div>
      </div>
    </section>
  );
}
