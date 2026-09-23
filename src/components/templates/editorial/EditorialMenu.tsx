import Reveal from "@/components/animations/Reveal";
import { formatRupiah } from "@/lib/format";

type Category = { id: string; name: string; items: { id: string; name: string; price: number; isAvailable: boolean }[] };

/**
 * Menu template Editorial: daftar harga tipografis seperti menu restoran.
 * Per kategori; nama di kiri, garis titik penghubung, harga di kanan. Tanpa foto & tanpa tombol pesan.
 */
export default function EditorialMenu({ brandName, categories }: { brandName: string; categories: Category[] }) {
  const filled = categories.filter((c) => c.items.length > 0);

  return (
    <div className="bg-paper">
      <header className="mx-auto max-w-[1440px] px-5 pb-16 pt-20 sm:px-8 md:px-12 md:pb-24 md:pt-32">
        <Reveal>
          <p className="text-sm text-ink/55">{brandName}</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="ed-title mt-3 text-[clamp(52px,9vw,140px)]">
            <em>Menu</em>
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-6 max-w-md text-lg text-ink/65">
            Dipanggang tiap pagi. Harga bisa berubah sewaktu-waktu; tanyakan ketersediaan di toko.
          </p>
        </Reveal>
      </header>

      <div className="mx-auto max-w-[1440px] px-5 pb-28 sm:px-8 md:px-12 md:pb-40">
        {filled.length === 0 && <p className="text-ink/60">Menu belum tersedia.</p>}
        {filled.map((cat, ci) => (
          <section key={cat.id} aria-labelledby={`cat-${cat.id}`} className="grid gap-8 border-t border-ink/15 py-14 md:grid-cols-12 md:py-20">
            <div className="md:col-span-4">
              <Reveal className="md:sticky md:top-28">
                <p className="text-sm tabular-nums text-ink/45">{String(ci + 1).padStart(2, "0")}</p>
                <h2 id={`cat-${cat.id}`} className="ed-title mt-2 text-[clamp(30px,3.4vw,52px)]">
                  {cat.name}
                </h2>
              </Reveal>
            </div>

            <ul className="md:col-span-8">
              {cat.items.map((item, i) => (
                <Reveal as="li" key={item.id} delay={Math.min(i, 8) * 0.05} y={12}>
                  <div
                    className={`group flex items-baseline gap-4 py-4 md:py-5 ${item.isAvailable ? "" : "opacity-45"}`}
                  >
                    <span className="text-[clamp(20px,2vw,28px)] font-medium tracking-tight transition-[font-style] duration-500 group-hover:italic">
                      {item.name}
                      {!item.isAvailable && <span className="ml-3 align-middle text-sm font-normal text-ink/60">sedang habis</span>}
                    </span>
                    <span className="min-w-8 flex-1 translate-y-[-0.3em] border-b border-dotted border-ink/35" aria-hidden />
                    <span className="text-[clamp(18px,1.7vw,24px)] tabular-nums text-ink/80">{formatRupiah(item.price)}</span>
                  </div>
                </Reveal>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
