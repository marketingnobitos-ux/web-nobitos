import Reveal from "@/components/animations/Reveal";
import { TkButton, WRAP, formatHarga } from "@/components/templates/tungku/shared";
import { APW } from "@/data/brands/apw";
import { trackName } from "@/lib/track";

type Category = { id: string; name: string; items: { id: string; name: string; price: number; portion: string | null }[] };

/** Halaman Menu: daftar teks per kategori, nama kiri, harga kanan, garis tipis di antaranya (seperti menu cetak). */
export default function TungkuMenu({ tagline, categories }: { tagline: string | null; categories: Category[] }) {
  return (
    <div className={`${WRAP} pb-24 pt-16 md:pb-32 md:pt-24`}>
      <Reveal y={16} className="text-center">
        <h1 className="tk-caps text-[clamp(34px,4vw,48px)] tracking-[0.12em]">{APW.menu.title}</h1>
        {tagline && <p className="mx-auto mt-5 max-w-xl text-lg text-ink/80">{tagline}</p>}
        <p className="mt-2 text-sm text-ink/55">{APW.menu.lead}</p>
      </Reveal>

      <div className="mx-auto mt-14 max-w-[640px] space-y-14 md:mt-20">
        {categories.map((cat) => (
          <Reveal y={16} as="section" key={cat.id}>
            <h2 id={`kat-${cat.id}`} className="tk-caps text-lg tracking-[0.16em] text-brand md:text-xl">
              {cat.name}
            </h2>
            <ul className="mt-6 space-y-4">
              {cat.items.map((item) => (
                <li key={item.id}>
                  <div className="flex items-baseline gap-3 text-[17px] font-normal">
                    <span>{item.name}</span>
                    <span aria-hidden className="min-w-6 flex-1 translate-y-[-0.3em] border-b border-ink/20" />
                    <span className="tabular-nums">{formatHarga(item.price)}</span>
                  </div>
                  {item.portion && <p className="mt-0.5 text-[13px] text-ink/60">{item.portion}</p>}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}

        <Reveal y={16}>
          <p className="border-l-4 border-accent bg-paper-deep px-6 py-5 font-normal">{APW.menu.note}</p>
        </Reveal>
      </div>

      <div className="mt-14 flex justify-center">
        <TkButton href="/cabang" track={trackName("cabang")}>
          {APW.location.cta} <span aria-hidden>→</span>
        </TkButton>
      </div>
    </div>
  );
}
