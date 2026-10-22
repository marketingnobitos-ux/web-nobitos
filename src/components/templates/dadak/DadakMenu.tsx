import Reveal from "@/components/animations/Reveal";
import { Eyebrow, Plate, WRAP, categoryAnchor, formatHarga } from "@/components/templates/dadak/shared";
import { AMINOTO } from "@/data/brands/aminoto";

type Item = { id: string; name: string; description: string | null; price: number; portion: string | null; imageUrl: string | null; isFeatured: boolean };
type Category = { id: string; name: string; items: Item[] };

/** Halaman Menu: judul kaca + catatan harga, pintasan kategori, lalu daftar harga per kategori (nama ..... harga). */
export default function DadakMenu({ categories }: { categories: Category[] }) {
  const { menu } = AMINOTO;
  const featured = categories.flatMap((c) => c.items).filter((i) => i.isFeatured && i.imageUrl);

  return (
    <div className={`${WRAP} pb-10 pt-6 text-ink md:pt-8`}>
      <section aria-labelledby="menu-title" className="dk-glass px-5 py-10 sm:px-10 md:py-12 lg:px-14">
        <Eyebrow>{AMINOTO.kicker}</Eyebrow>
        <h1 id="menu-title" className="dk-title mt-3 text-[clamp(38px,5.5vw,68px)]">
          {menu.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink/80">{menu.lead}</p>
        <ul className="mt-5 space-y-1 text-[15px] text-ink/70">
          {menu.notes.map((n) => (
            <li key={n}>· {n}</li>
          ))}
        </ul>
        {categories.length > 1 && (
          <nav aria-label="Kategori menu" className="mt-8">
            <ul className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <li key={c.id}>
                  <a href={`#${categoryAnchor(c.name)}`} className="dk-chip">
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </section>

      {featured.length > 0 && (
        <ul aria-label="Menu andalan" className="mt-20 grid gap-x-6 gap-y-16 sm:grid-cols-3">
          {featured.map((item) => (
            <li key={item.id} className="dk-glass flex flex-col items-center px-5 pb-6 text-center">
              <Plate image={{ src: item.imageUrl!, alt: item.name }} className="-mt-12 w-36" />
              <p className="mt-4 text-lg font-semibold">{item.name}</p>
              <p className="mt-1 font-bold">Rp {formatHarga(item.price)}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {categories.map((c) => (
          <Reveal as="section" key={c.id} y={14} className="dk-glass scroll-mt-28 p-6 sm:p-8">
            <h2 id={categoryAnchor(c.name)} className="dk-title scroll-mt-28 text-2xl sm:text-[1.7rem]">
              <span className="dk-mark">{c.name}</span>
            </h2>
            <ul className="mt-5 space-y-3.5">
              {c.items.map((item) => (
                <li key={item.id}>
                  <div className="flex items-baseline gap-3">
                    <span className="font-semibold">{item.name}</span>
                    <span aria-hidden className="dk-dots" />
                    <span className="whitespace-nowrap font-semibold tabular-nums">{formatHarga(item.price)}</span>
                  </div>
                  {item.portion && <p className="mt-0.5 text-sm text-ink/60">{item.portion}</p>}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
      {categories.length === 0 && <p className="mt-10 text-ink/70">Menu belum tersedia.</p>}
    </div>
  );
}
