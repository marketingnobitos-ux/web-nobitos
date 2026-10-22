import { BoardHero, Kicker, Pill, WRAP, categoryAnchor, formatHarga } from "@/components/templates/gerabah/shared";
import { GR_PHOTOS } from "@/data/brands/apw-gerabah";
import { gerabahText } from "@/lib/template-text";
import { trackName } from "@/lib/track";

type Item = { id: string; name: string; description: string | null; price: number; portion: string | null; imageUrl: string | null };
type Category = { id: string; name: string; items: Item[] };

/**
 * Halaman Menu Gerabah: papan judul, pil lompat kategori (lengket di atas), lalu tiap kategori:
 * menu berfoto jadi kartu, sisanya baris harga bertitik penuntun. Katalog saja, tanpa tombol pesan.
 */
export default async function GerabahMenu({ tagline, categories }: { tagline: string | null; categories: Category[] }) {
  const GR = await gerabahText();
  return (
    <>
      <BoardHero
        kicker="Menu & harga"
        title={GR.menu.title}
        lead={tagline ?? undefined}
        dish={GR_PHOTOS.sajian}
        aside={
          <p className="gr-glass max-w-[300px] px-5 py-4 text-sm leading-relaxed">
            <span className="gr-caps block text-[var(--gr-gold)]">Catatan</span>
            <span className="mt-1.5 block">{GR.menu.note}</span>
          </p>
        }
      />

      {categories.length > 0 ? (
        <>
          <nav aria-label="Kategori menu" className="sticky top-0 z-20 border-b border-[var(--gr-line)] bg-[rgb(22_19_17/0.88)] backdrop-blur-md">
            <ul className={`${WRAP} gr-scroll flex gap-2 overflow-x-auto py-3`}>
              {categories.map((c) => (
                <li key={c.id} className="shrink-0">
                  <a href={`#${categoryAnchor(c.name)}`} className="gr-pill !min-h-0 !py-2 !text-[13px]">
                    {c.name}
                    <span className="text-[var(--gr-cream)]/55">{c.items.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="bg-[var(--gr-char)]">
            {categories.map((c, i) => {
              const withPhoto = c.items.filter((item) => item.imageUrl);
              const rows = c.items.filter((item) => !item.imageUrl);
              return (
                <section
                  key={c.id}
                  id={categoryAnchor(c.name)}
                  aria-labelledby={`${categoryAnchor(c.name)}-title`}
                  className="scroll-mt-20 border-b border-[var(--gr-line)] py-16 md:py-20"
                >
                  <div className={WRAP}>
                    <div className="flex items-end justify-between gap-6 border-b border-[var(--gr-line)] pb-6">
                      <div>
                        <p className="gr-caps text-[var(--gr-gold)]">{String(i + 1).padStart(2, "0")}</p>
                        <h2 id={`${categoryAnchor(c.name)}-title`} className="gr-display mt-3 text-[clamp(36px,5vw,64px)]">
                          {c.name}
                        </h2>
                      </div>
                      <p className="gr-caps shrink-0 text-[var(--gr-cream)]/60">{c.items.length} menu</p>
                    </div>

                    {withPhoto.length > 0 && (
                      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {withPhoto.map((item) => (
                          <li key={item.id} className="flex flex-col overflow-hidden rounded-[24px] bg-[var(--gr-slate)] ring-1 ring-[var(--gr-line)]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.imageUrl!} alt={`${item.name} Ayam Panggang Wicaksono`} width={576} height={432} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
                            <div className="flex flex-1 flex-col p-6">
                              <div className="flex items-start justify-between gap-4">
                                <h3 className="gr-display text-[22px] leading-tight">{item.name}</h3>
                                <p className="shrink-0 rounded-full bg-[var(--gr-gold)] px-3 py-1 text-sm font-bold text-[var(--gr-char)]">{formatHarga(item.price)}</p>
                              </div>
                              {item.portion && <p className="gr-caps mt-3 text-[var(--gr-cream)]/60">{item.portion}</p>}
                              {item.description && <p className="mt-3 text-[15px] leading-relaxed text-[var(--gr-cream)]/80">{item.description}</p>}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}

                    {rows.length > 0 && (
                      <ul className={`grid gap-x-12 sm:grid-cols-2 ${withPhoto.length ? "mt-8" : "mt-6"}`}>
                        {rows.map((item) => (
                          <li key={item.id} className="border-b border-[var(--gr-line)] py-4">
                            <div className="flex items-baseline gap-3 text-[17px]">
                              <h3 className="font-medium">{item.name}</h3>
                              <span aria-hidden className="gr-leader" />
                              <p className="font-semibold tabular-nums text-[var(--gr-gold)]">{formatHarga(item.price)}</p>
                            </div>
                            {(item.portion || item.description) && (
                              <p className="mt-1 text-sm text-[var(--gr-cream)]/65">{[item.portion, item.description].filter(Boolean).join(" · ")}</p>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              );
            })}
          </div>

          <section className="gr-lines bg-[var(--gr-clay)] py-16 md:py-20">
            <div className={`${WRAP} flex flex-col gap-6 md:flex-row md:items-center md:justify-between`}>
              <div>
                <Kicker className="text-[var(--gr-cream)]/80">{GR.menu.lead}</Kicker>
                <p className="gr-serif mt-4 text-[clamp(30px,4vw,48px)]">Pesan langsung di tempat, ya.</p>
              </div>
              <Pill href="/cabang" track={trackName("cabang")} variant="gold">
                Lokasi &amp; jam buka
              </Pill>
            </div>
          </section>
        </>
      ) : (
        <p className={`${WRAP} py-20 text-[var(--gr-cream)]/70`}>Menu belum tersedia.</p>
      )}
    </>
  );
}
