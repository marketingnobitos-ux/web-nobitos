import { IcedTea, NoodleBowl } from "@/components/templates/anglo/illustrations";
import { WRAP, formatHarga } from "@/components/templates/anglo/shared";

type Category = {
  id: string;
  name: string;
  items: { id: string; name: string; description: string | null; price: number; isFeatured: boolean }[];
};

/**
 * Menu Anglo seperti kertas menu cetak (brief 6.3): judul kategori spidol,
 * baris "Bakmi Goreng ........ 21.000" mesin ketik. Deskripsi hanya untuk menu andalan.
 */
export default function AngloMenu({ brandName, categories }: { brandName: string; categories: Category[] }) {
  return (
    <div className="ag-noise bg-paper py-12 text-ink md:py-20">
      <div className={WRAP}>
        <article className="ag-paper relative mx-auto max-w-5xl px-5 pb-14 pt-12 sm:px-10 md:px-16 md:pb-20 md:pt-16">
          <NoodleBowl className="absolute right-5 top-6 hidden h-24 w-24 -rotate-6 sm:block md:right-12 md:top-10 md:h-28 md:w-28" />

          <header>
            <p className="ag-sticker -rotate-2">{brandName}</p>
            <h1 className="ag-marker mt-6 text-[clamp(72px,12vw,150px)]">Menu</h1>
          </header>

          {categories.length > 0 && (
            <nav aria-label="Kategori menu" className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs font-bold uppercase tracking-wider">
              {categories.map((c) => (
                <a key={c.id} href={`#kategori-${c.id}`} className="underline decoration-2 underline-offset-4 hover:text-accent">
                  {c.name}
                </a>
              ))}
            </nav>
          )}

          <div className="mt-12 grid gap-14 md:mt-16 lg:grid-cols-2 lg:gap-x-16">
            {categories.map((c) => (
              <section key={c.id} id={`kategori-${c.id}`} aria-labelledby={`judul-${c.id}`} className="scroll-mt-24">
                <h2 id={`judul-${c.id}`} className="ag-marker border-b-2 border-ink pb-3 text-[clamp(40px,5vw,60px)]">
                  {c.name}
                </h2>
                <ul className="mt-2">
                  {c.items.map((item) => (
                    <li key={item.id} className="py-2.5">
                      <div className="flex items-end gap-2 font-mono text-[0.9rem] sm:text-base">
                        <span className={item.isFeatured ? "font-bold" : ""}>{item.name}</span>
                        <span aria-hidden className="ag-leader" />
                        <span className="shrink-0 font-bold tabular-nums">{formatHarga(item.price)}</span>
                      </div>
                      {item.isFeatured && item.description && (
                        <p className="mt-1 flex items-start gap-2 text-[0.95rem] italic leading-snug">
                          <span aria-label="Menu andalan" className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-ink bg-accent" />
                          {item.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <IcedTea className="absolute bottom-6 right-6 hidden h-20 w-20 rotate-6 md:block" />
        </article>
      </div>
    </div>
  );
}
