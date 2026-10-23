import type { Brand } from "@prisma/client";
import OpenBadge from "@/components/public/OpenBadge";
import GerabahHero from "@/components/templates/gerabah/GerabahHero";
import { HoursRing, WeekBars } from "@/components/templates/gerabah/HoursViz";
import { Kicker, Photo, Pill, WRAP, formatHarga } from "@/components/templates/gerabah/shared";
import { GR_PHOTOS, GR_SLIDES } from "@/data/brands/apw-gerabah";
import { gerabahText } from "@/lib/template-text";
import { mapsLink } from "@/lib/format";
import { isCompleteWeek, type DayHours } from "@/lib/hours";
import { branchKey, trackName } from "@/lib/track";

type Featured = { id: string; name: string; price: number; portion: string | null; imageUrl: string | null };
type Category = { id: string; name: string; items: { id: string; name: string; price: number; portion: string | null }[] };
type Branch = { name: string; address: string; mapsUrl: string | null; lat: number | null; lng: number | null; hours: DayHours[] };

/**
 * Beranda Gerabah, urutan mengikuti referensi: papan hero berslide → deret menu unggulan → papan data berkartu kaca
 * (harga, jam, status) → tiga langkah proses → papan menu (seperti menu cetak) → suasana → lokasi.
 */
export default async function GerabahHome({ brand, featured, categories, branch }: { brand: Brand; featured: Featured[]; categories: Category[]; branch: Branch | null }) {
  const GR = await gerabahText();
  const hours = branch && isCompleteWeek(branch.hours) ? branch.hours : null;
  const cheapest = [...featured].sort((a, b) => a.price - b.price)[0];
  const menuCount = categories.reduce((n, c) => n + c.items.length, 0);
  const slides = GR_SLIDES.map((s) => ({ ...s, photo: GR_PHOTOS[s.photo] }));

  return (
    <>
      <GerabahHero
        brandName={brand.name}
        kicker={`Ayam panggang tungku gerabah · ${GR.area}`}
        slides={slides}
        startPrice={cheapest ? { price: cheapest.price, name: cheapest.name, portion: cheapest.portion } : null}
        menuCount={menuCount}
        hours={hours}
      />

      {featured.length > 0 && <FeaturedRow featured={featured} />}

      <DataBoard hours={hours} cheapest={cheapest} categories={categories} />

      <Proses />

      {categories.length > 0 && <MenuBoard categories={categories} />}

      <Suasana />

      {branch && <Lokasi branch={branch} hours={hours} />}
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

/** Papan data: foto sajian di tengah latar buram, kartu kaca berisi angka asli (harga, jumlah menu, jam, status). */
async function DataBoard({ hours, cheapest, categories }: { hours: DayHours[] | null; cheapest?: Featured; categories: Category[] }) {
  const GR = await gerabahText();
  const total = categories.reduce((n, c) => n + c.items.length, 0);
  return (
    <section aria-labelledby="data-title" className="relative isolate overflow-hidden bg-[var(--gr-char-2)] py-20 md:py-28">
      {/* Latar: foto yang sama, diperbesar & dibuat buram (resolusi rendah tidak terlihat). */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <Photo photo={GR_PHOTOS.piringLengkap} className="h-full w-full scale-125 opacity-45 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(22_19_17/0.2),rgb(22_19_17/0.85)_75%)]" />
      </div>

      <div className={WRAP}>
        <div className="mx-auto max-w-2xl text-center">
          <Kicker className="justify-center text-[var(--gr-cream)]/75">Sekilas</Kicker>
          <h2 id="data-title" className="gr-serif mt-4 text-[clamp(36px,5vw,64px)]">
            Yang perlu kamu tahu <em>sebelum datang</em>
          </h2>
        </div>

        <div className="mt-12 grid items-center gap-4 md:mt-16 lg:grid-cols-[1fr_minmax(0,1.25fr)_1fr] lg:gap-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:order-1 lg:grid-cols-1">
            {cheapest && (
              <div className="gr-glass p-6">
                <p className="gr-caps text-[var(--gr-cream)]/60">Harga mulai</p>
                <p className="gr-display mt-3 text-[44px]">
                  <span className="mr-2 text-[0.5em] align-[0.35em]">Rp</span>
                  {formatHarga(cheapest.price)}
                </p>
                <p className="mt-1 text-sm text-[var(--gr-cream)]/75">
                  {cheapest.name}
                  {cheapest.portion && `, ${cheapest.portion}`}
                </p>
              </div>
            )}
            <div className="gr-glass p-6">
              <p className="gr-caps text-[var(--gr-cream)]/60">Pilihan menu</p>
              <p className="gr-display mt-3 text-[44px]">{total}</p>
              {/* Batang bertumpuk: porsi tiap kategori dari jumlah item sebenarnya. */}
              <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-white/10">
                {categories.map((c, i) => (
                  <span key={c.id} className={["bg-[var(--gr-gold)]", "bg-[var(--gr-cream)]/80", "bg-[var(--gr-clay)]"][i % 3]} style={{ width: `${(c.items.length / Math.max(total, 1)) * 100}%` }} />
                ))}
              </div>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-[var(--gr-cream)]/75">
                {categories.map((c, i) => (
                  <li key={c.id} className="flex items-center gap-1.5">
                    <span aria-hidden className={`h-2 w-2 rounded-full ${["bg-[var(--gr-gold)]", "bg-[var(--gr-cream)]/80", "bg-[var(--gr-clay)]"][i % 3]}`} />
                    {c.name} {c.items.length}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[560px] lg:order-2">
            <Photo photo={GR_PHOTOS.piringLengkap} className="aspect-[16/10] w-full rounded-[28px] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)] ring-1 ring-white/15" />
            <div className="absolute inset-x-0 -bottom-5 flex justify-center gap-2">
              <Pill href="/menu" track={trackName("menu")} variant="gold" className="!min-h-0 !py-2.5 shadow-lg">
                Lihat menu
              </Pill>
              <Pill href="/cabang" track={trackName("cabang")} className="!min-h-0 bg-[rgb(22_19_17/0.7)] !py-2.5 shadow-lg backdrop-blur">
                Cara ke sana
              </Pill>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:order-3 lg:mt-0 lg:grid-cols-1">
            {hours && (
              <div className="gr-glass flex items-center gap-5 p-6">
                <HoursRing hours={hours} />
                <div>
                  <p className="gr-caps text-[var(--gr-cream)]/60">Jam buka</p>
                  <p className="gr-display mt-2 whitespace-nowrap text-[22px] sm:text-[26px]">{GR.hoursShort}</p>
                  <OpenBadge hours={hours} className="mt-2 text-[13px] text-[var(--gr-cream)]/85" />
                </div>
              </div>
            )}
            {hours && (
              <div className="gr-glass p-6">
                <div className="flex items-baseline justify-between">
                  <p className="gr-caps text-[var(--gr-cream)]/60">Seminggu</p>
                  <p className="text-[13px] text-[var(--gr-cream)]/75">{GR.closedDay}</p>
                </div>
                <div className="mt-4">
                  <WeekBars hours={hours} />
                </div>
              </div>
            )}
            <div className="gr-glass p-6">
              <p className="gr-caps text-[var(--gr-cream)]/60">Cara panggang</p>
              <p className="gr-display mt-2 text-[26px]">Tungku gerabah</p>
              <p className="mt-1 text-sm text-[var(--gr-cream)]/75">Api kompor di bawah tungku, bukan arang terbuka.</p>
            </div>
          </div>
        </div>
      </div>
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
          <Photo photo={p.nampan} className="col-span-3 aspect-square w-full rounded-[24px] md:col-span-2 md:aspect-auto md:h-full" />
          <Photo photo={p.deretan} className="col-span-3 aspect-square w-full rounded-[24px] md:col-span-2 md:aspect-auto md:h-full" />
          <Photo photo={p.senja} className="col-span-6 aspect-[16/9] w-full rounded-[24px] md:col-span-4 md:aspect-auto md:h-full" />
        </div>
      </div>
    </section>
  );
}

/** Lokasi: blok daun pisang dengan alamat, patokan, status buka, tombol Maps. */
async function Lokasi({ branch, hours }: { branch: Branch; hours: DayHours[] | null }) {
  const GR = await gerabahText();
  const { lokasi } = GR.home;
  return (
    <section aria-labelledby="lokasi-title" className="gr-lines bg-[var(--gr-leaf)] py-20 md:py-24">
      <div className={`${WRAP} grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center`}>
        <div>
          <Kicker className="text-[var(--gr-cream)]/80">{lokasi.kicker}</Kicker>
          <h2 id="lokasi-title" className="gr-display mt-5 text-[clamp(40px,6vw,88px)]">
            {branch.name}
          </h2>
          <p className="mt-5 max-w-lg text-[17px] leading-relaxed">{branch.address}</p>
          <p className="mt-2 text-[var(--gr-cream)]/80">{GR.landmark}</p>
          {hours && <OpenBadge hours={hours} className="gr-glass mt-6 !rounded-full px-4 py-2 text-sm" />}
          <div className="mt-8 flex flex-wrap gap-3">
            <Pill href={mapsLink(branch)} external track={trackName("maps", branchKey(branch.name))} variant="gold">
              {lokasi.cta}
            </Pill>
            <Pill href="/cabang" track={trackName("cabang")}>
              {lokasi.more}
            </Pill>
          </div>
        </div>
        <Photo photo={GR_PHOTOS.depan} className="aspect-[4/3] w-full rounded-[28px] ring-1 ring-white/20 md:aspect-square" />
      </div>
    </section>
  );
}
