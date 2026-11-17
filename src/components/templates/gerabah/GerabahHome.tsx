import type { Brand } from "@prisma/client";
import OpenBadge from "@/components/public/OpenBadge";
import GerabahHero from "@/components/templates/gerabah/GerabahHero";
import { Kicker, Photo, Pill, WRAP, formatHarga, hoursSummary } from "@/components/templates/gerabah/shared";
import { GR_PHOTOS, GR_SLIDES } from "@/data/brands/apw-gerabah";
import { gerabahText } from "@/lib/template-text";
import { mapsLink } from "@/lib/format";
import { imageSrcSet } from "@/lib/image";
import { isCompleteWeek, type DayHours } from "@/lib/hours";
import { branchKey, trackName } from "@/lib/track";

type Featured = { id: string; name: string; price: number; portion: string | null; imageUrl: string | null };
type Category = { id: string; name: string; items: { id: string; name: string; price: number; portion: string | null }[] };
type Branch = { name: string; address: string; mapsUrl: string | null; lat: number | null; lng: number | null; hours: DayHours[] };

/**
 * Beranda Gerabah: papan hero berslide → deret menu unggulan → tiga langkah proses → papan menu (seperti menu cetak)
 * → suasana → lokasi. Ringkas 18 Nov 2026: papan "Sekilas" dihapus karena hanya mengulang harga, jam & jumlah menu.
 */
export default async function GerabahHome({ brand, featured, categories, branches }: { brand: Brand; featured: Featured[]; categories: Category[]; branches: Branch[] }) {
  const GR = await gerabahText();
  // Jam belum lengkap tidak dipakai untuk status & ringkasan (status tidak pernah ditebak).
  const withHours = branches.filter((b) => isCompleteWeek(b.hours));
  const cheapest = [...featured].sort((a, b) => a.price - b.price)[0];

  return (
    <>
      <GerabahHero
        brandName={brand.name}
        kicker={`Ayam panggang tungku gerabah · ${GR.area}`}
        slides={GR_SLIDES}
        dish={GR_PHOTOS.heroPiring}
        startPrice={cheapest ? { price: cheapest.price, name: cheapest.name, portion: cheapest.portion } : null}
        branches={withHours.map((b) => ({ name: b.name, hours: b.hours }))}
      />

      {featured.length > 0 && <FeaturedRow featured={featured} />}

      <Proses />

      {categories.length > 0 && <MenuBoard categories={categories} />}

      <Suasana />

      {branches.length > 0 && <Lokasi branches={branches} />}
    </>
  );
}

/** Deret kartu di bawah hero (seperti baris kartu di bawah papan referensi): foto, nama, porsi, harga. */
function FeaturedRow({ featured }: { featured: Featured[] }) {
  return (
    <section aria-labelledby="unggulan-title" className="border-y border-[var(--gr-line)] bg-[var(--gr-char)]">
      <h2 id="unggulan-title" className="sr-only">
        Menu unggulan
      </h2>
      <ul className="grid divide-y divide-[var(--gr-line)] md:grid-cols-4 md:divide-x md:divide-y-0">
        {featured.map((item, i) => (
          <li key={item.id} className="group flex items-center gap-5 px-4 py-6 sm:px-6 md:flex-col md:items-start md:px-8 md:py-8">
            {item.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.imageUrl}
                srcSet={imageSrcSet(item.imageUrl)}
                sizes="(min-width: 768px) 25vw, 96px"
                alt={`${item.name} Ayam Panggang Wicaksono`}
                width={320}
                height={240}
                loading="lazy"
                decoding="async"
                className="aspect-square w-24 shrink-0 rounded-2xl object-cover transition-transform duration-500 group-hover:scale-[1.03] md:aspect-[4/3] md:w-full"
              />
            )}
            <div className="min-w-0 flex-1 md:w-full">
              <p className="gr-caps text-[var(--gr-cream)]/55">Unggulan {String(i + 1).padStart(2, "0")}</p>
              <h3 className="gr-display mt-2 text-[22px] leading-tight">{item.name}</h3>
              <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                {item.portion && <p className="text-sm text-[var(--gr-cream)]/70">{item.portion}</p>}
                <p className="whitespace-nowrap text-[17px] font-semibold text-[var(--gr-gold)]">Rp {formatHarga(item.price)}</p>
              </div>
            </div>
          </li>
        ))}
        <li className="flex items-center px-4 py-6 sm:px-6 md:px-8">
          <Pill href="/menu" track={trackName("menu")} className="w-full !justify-between">
            Lihat semua menu
          </Pill>
        </li>
      </ul>
    </section>
  );
}

/** Tiga langkah proses (dari video TikTok resmi): bumbu → tungku → matang. */
async function Proses() {
  const GR = await gerabahText();
  const { proses } = GR.home;
  return (
    <section aria-labelledby="proses-title" className="gr-lines bg-[var(--gr-slate)] py-20 md:py-28">
      <div className={WRAP}>
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <Kicker className="text-[var(--gr-cream)]/75">{proses.kicker}</Kicker>
            <h2 id="proses-title" className="gr-display mt-5 text-[clamp(36px,5vw,72px)]">
              {proses.title.map((line) => (
                <span key={line} className="block">
                  {line}{" "}
                </span>
              ))}
            </h2>
          </div>
          <p className="max-w-md text-[17px] leading-relaxed text-[var(--gr-cream)]/80 md:justify-self-end">{proses.lead}</p>
        </div>

        <ol className="mt-14 grid gap-px overflow-hidden rounded-[28px] bg-[var(--gr-line)] md:grid-cols-3">
          {proses.steps.map((step) => (
            <li key={step.no} className="flex flex-col bg-[var(--gr-slate)] p-5 md:p-7">
              <div className="flex items-center justify-between">
                <span className="gr-display text-[44px] text-[var(--gr-gold)]">{step.no}</span>
                <span aria-hidden className="ml-4 h-px flex-1 translate-y-1 bg-[var(--gr-line)]" />
              </div>
              <Photo photo={GR_PHOTOS[step.photo]} className="mt-5 aspect-[4/3] w-full rounded-2xl" />
              <h3 className="gr-display mt-6 text-[24px] leading-tight">{step.title}</h3>
              <p className="mt-3 leading-relaxed text-[var(--gr-cream)]/80">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Papan menu krem: tiga kolom seperti menu cetak resmi, harga dengan titik-titik penuntun. */
async function MenuBoard({ categories }: { categories: Category[] }) {
  const GR = await gerabahText();
  const { menu } = GR.home;
  return (
    <section aria-labelledby="menu-board-title" className="gr-lines gr-lines-dark bg-[var(--gr-paper)] py-20 text-[var(--gr-char)] md:py-28">
      <div className={WRAP}>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Kicker className="text-[var(--gr-char)]/70">{menu.kicker}</Kicker>
            <h2 id="menu-board-title" className="gr-serif mt-4 max-w-[16ch] text-[clamp(36px,5vw,64px)]">
              {menu.title}
            </h2>
          </div>
          <Pill href="/menu" track={trackName("menu")} variant="dark" className="self-start md:self-auto">
            {menu.cta}
          </Pill>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {categories.map((c) => (
            <div key={c.id} className="rounded-[24px] bg-white/55 p-6 ring-1 ring-[var(--gr-line-dark)] md:p-7">
              <h3 className="gr-display text-[22px] text-[var(--gr-maroon)]">{c.name}</h3>
              <ul className="mt-5 space-y-3">
                {c.items.map((item) => (
                  <li key={item.id} className="text-[15px]">
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium">{item.name}</span>
                      <span aria-hidden className="gr-leader" />
                      <span className="font-semibold tabular-nums">{formatHarga(item.price)}</span>
                    </div>
                    {item.portion && <p className="text-[13px] text-[var(--gr-char)]/60">{item.portion}</p>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-8 inline-flex items-center gap-3 rounded-full bg-[var(--gr-maroon)] px-5 py-3 text-sm font-semibold text-[var(--gr-cream)]">
          <span aria-hidden>✦</span> {GR.menu.note}
        </p>
      </div>
    </section>
  );
}

/** Suasana: teks di kiri, mosaik foto malam di kanan. */
async function Suasana() {
  const GR = await gerabahText();
  const { suasana } = GR.home;
  const p = GR_PHOTOS;
  return (
    <section aria-labelledby="suasana-title" className="bg-[var(--gr-char)] py-20 md:py-28">
      <div className={`${WRAP} grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center`}>
        <div>
          <Kicker className="text-[var(--gr-cream)]/75">{suasana.kicker}</Kicker>
          <h2 id="suasana-title" className="gr-serif mt-4 text-[clamp(36px,4.6vw,60px)]">
            {suasana.title}
          </h2>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-[var(--gr-cream)]/80">{suasana.body}</p>
          <p className="gr-caps mt-8 text-[var(--gr-gold)]">{GR.since}</p>
        </div>
        <div className="grid grid-cols-6 gap-3 md:grid-rows-[300px_220px] md:gap-4">
          <Photo photo={p.malamMinggu} className="col-span-6 aspect-[16/9] w-full rounded-[24px] md:col-span-4 md:aspect-auto md:h-full" />
          <Photo photo={p.nampan} sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw" className="col-span-3 aspect-square w-full rounded-[24px] md:col-span-2 md:aspect-auto md:h-full" />
          <Photo photo={p.deretan} sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw" className="col-span-3 aspect-square w-full rounded-[24px] md:col-span-2 md:aspect-auto md:h-full" />
          <Photo photo={p.senja} className="col-span-6 aspect-[16/9] w-full rounded-[24px] md:col-span-4 md:aspect-auto md:h-full" />
        </div>
      </div>
    </section>
  );
}

/** Lokasi: blok daun pisang, satu kartu per cabang (alamat, patokan, jam, status buka, tombol Maps). */
async function Lokasi({ branches }: { branches: Branch[] }) {
  const GR = await gerabahText();
  const { lokasi } = GR.home;
  return (
    <section aria-labelledby="lokasi-title" className="gr-lines bg-[var(--gr-leaf)] py-20 md:py-24">
      <div className={WRAP}>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Kicker className="text-[var(--gr-cream)]/80">{lokasi.kicker}</Kicker>
            <h2 id="lokasi-title" className="gr-display mt-5 text-[clamp(40px,6vw,88px)]">
              {branches.length > 1 ? `${branches.length} cabang` : branches[0].name}
            </h2>
          </div>
          <Pill href="/cabang" track={trackName("cabang")} className="self-start md:self-auto">
            {lokasi.more}
          </Pill>
        </div>

        <ul className={`mt-10 grid gap-5 ${branches.length > 1 ? "md:grid-cols-2" : ""}`}>
          {branches.map((b) => {
            const info = GR.branchInfo[b.name];
            const photo = GR_PHOTOS[info?.photo ?? "sajian"];
            const sum = hoursSummary(b.hours);
            const hours = isCompleteWeek(b.hours) ? b.hours : null;
            return (
              <li key={b.name} className="grid overflow-hidden rounded-[28px] bg-[rgb(22_19_17/0.28)] ring-1 ring-white/20 sm:grid-cols-[0.9fr_1.1fr]">
                <Photo
                  photo={photo}
                  sizes="(min-width: 768px) 22vw, (min-width: 640px) 45vw, 100vw"
                  className={`aspect-[4/3] h-full w-full sm:aspect-auto ${info?.photo ? "" : "bg-[var(--gr-char)] !object-contain p-6"}`}
                />
                <div className="flex flex-col p-6 md:p-7">
                  <h3 className="gr-display text-[clamp(30px,3.4vw,44px)]">{b.name}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed">{b.address}</p>
                  {info?.landmark && <p className="mt-2 text-sm text-[var(--gr-cream)]/80">{info.landmark}</p>}
                  {sum && (
                    <p className="mt-4 text-[15px] font-semibold">
                      {sum.range} WIB · <span className="font-normal text-[var(--gr-cream)]/85">{sum.days}</span>
                    </p>
                  )}
                  {hours && <OpenBadge hours={hours} className="gr-glass mt-3 !rounded-full px-4 py-2 text-sm" />}
                  <div className="mt-auto pt-6">
                    <Pill href={mapsLink(b)} external track={trackName("maps", branchKey(b.name))} variant="gold">
                      {lokasi.cta}
                    </Pill>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
