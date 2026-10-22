import { ClosingCta, Label, PageHero, WRAP, categoryAnchor, formatHarga } from "@/components/templates/dadak/shared";
import { AMINOTO_IMAGES } from "@/data/brands/aminoto";
import { dadakText } from "@/lib/template-text";

type Item = { id: string; name: string; description: string | null; price: number; portion: string | null; imageUrl: string | null; isFeatured: boolean };
type Category = { id: string; name: string; items: Item[] };

/** Halaman Menu: hero foto, catatan harga, pintasan kategori, lalu daftar harga per kategori (nama ..... harga). */
export default async function DadakMenu({ categories }: { categories: Category[] }) {
  const AMINOTO = await dadakText();
  const { menu } = AMINOTO;

  return (
    <>
      <PageHero image={AMINOTO_IMAGES.heroMenu} title={menu.title} sub={menu.sub} />

      <div className={`${WRAP} py-16 md:py-24`}>
        <div className="grid gap-8 border-b border-current/20 pb-10 md:grid-cols-[1fr_1.4fr]">
          <Label>Catatan</Label>
          <ul className="space-y-2">
            {menu.notes.map((n) => (
              <li key={n} className="flex gap-3 text-[15px] leading-relaxed">
                <span aria-hidden className="mt-2 h-2 w-2 shrink-0 bg-accent ring-1 ring-current/30" />
                {n}
              </li>
            ))}
          </ul>
        </div>

        {categories.length > 1 && (
          <nav aria-label="Kategori menu" className="mt-10">
            <ul className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <li key={c.id}>
                  <a href={`#${categoryAnchor(c.name)}`} className="dk-btn dk-btn-line !px-4 !py-2 !text-xs">
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="mt-14 grid gap-x-16 gap-y-14 lg:grid-cols-2">
          {categories.map((c) => (
            <section key={c.id} aria-labelledby={categoryAnchor(c.name)} className="scroll-mt-8">
              <h2 id={categoryAnchor(c.name)} className="dk-display scroll-mt-8 border-b-2 border-current pb-3 text-[clamp(32px,3.4vw,44px)]">
                {c.name}
              </h2>
              <ul className="mt-5 space-y-4">
                {c.items.map((item) => (
                  <li key={item.id}>
                    <div className="flex items-baseline gap-3">
                      <span className="dk-caps text-[17px] font-semibold">{item.name}</span>
                      <span aria-hidden className="dk-leader" />
                      <span className="whitespace-nowrap text-[17px] font-semibold tabular-nums">{formatHarga(item.price)}</span>
                    </div>
                    {item.portion && <p className="mt-0.5 text-sm opacity-65">{item.portion}</p>}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        {categories.length === 0 && <p className="mt-10 opacity-70">Menu belum tersedia.</p>}
      </div>

      <ClosingCta />
    </>
  );
}
