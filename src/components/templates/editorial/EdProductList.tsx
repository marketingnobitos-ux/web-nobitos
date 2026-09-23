import Reveal from "@/components/animations/Reveal";
import EdLink from "@/components/templates/editorial/EdLink";
import { formatRupiah } from "@/lib/format";

type Item = { id: string; name: string; price: number; category: string };

/** Sorotan produk: daftar TEKS besar (nama + harga), tanpa foto. Hover: nama bergeser & miring halus. */
export default function EdProductList({ items }: { items: Item[] }) {
  return (
    <section aria-labelledby="ed-products" className="bg-ink px-5 py-24 text-paper sm:px-8 md:px-12 md:py-36">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-20">
          <Reveal>
            <h2 id="ed-products" className="ed-title max-w-xl text-[clamp(32px,4.2vw,60px)]">
              Yang keluar dari <em>oven</em> hari ini
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <EdLink href="/menu" track="ed-semua-menu" className="text-lg">
              Lihat semua menu
            </EdLink>
          </Reveal>
        </div>

        <ul className="border-t border-paper/20">
          {items.map((item, i) => (
            <Reveal as="li" key={item.id} delay={i * 0.06} y={16} className="group border-b border-paper/20">
              <div className="grid grid-cols-[2rem_1fr_auto] items-baseline gap-4 py-6 md:grid-cols-[4rem_1fr_auto] md:py-8">
                <span className="text-sm tabular-nums text-paper/40">{String(i + 1).padStart(2, "0")}</span>
                <span className="ed-title text-[clamp(26px,3.6vw,52px)] transition-[transform,font-style] duration-700 ease-[cubic-bezier(.16,.8,.2,1)] group-hover:translate-x-3 group-hover:italic">
                  {item.name}
                  <span className="ml-3 align-middle font-sans text-sm not-italic tracking-normal text-paper/45 md:text-base">{item.category}</span>
                </span>
                <span className="text-lg tabular-nums text-paper/75 transition-colors duration-500 group-hover:text-accent md:text-xl">
                  {formatRupiah(item.price)}
                </span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
