// Blok Promo & Galeri di Beranda untuk template yang aslinya tidak punya (ANGLO, DADAK, GERABAH; EDITORIAL hanya promo).
// Isi dari Admin > Promo & Event dan Galeri Foto. Tidak ada data = blok tidak dirender, jadi situs tetap sama seperti sebelumnya.
import { getActivePromos } from "@/lib/content";
import { imageSrcSet, imageVariant } from "@/lib/image";
import { prisma } from "@/lib/prisma";

export type ExtrasVariant = "anglo" | "dadak" | "gerabah" | "editorial";

const STYLE: Record<ExtrasVariant, { section: string; wrap: string; title: string; card: string; muted: string; photo: string }> = {
  anglo: {
    section: "ag-noise border-t-2 border-ink bg-paper py-20 text-ink md:py-28",
    wrap: "mx-auto w-full max-w-[1320px] px-4 sm:px-6 md:px-10",
    title: "ag-marker text-[clamp(52px,8vw,104px)] leading-none",
    card: "ag-paper flex flex-col overflow-hidden p-5",
    muted: "font-mono text-sm font-bold uppercase",
    photo: "border-2 border-ink",
  },
  dadak: {
    section: "bg-[var(--dk-deep)] py-20 text-white md:py-28",
    wrap: "mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-10",
    title: "dk-display text-[clamp(44px,7vw,84px)] uppercase leading-none",
    card: "flex flex-col overflow-hidden bg-white/[0.06] p-5",
    muted: "dk-caps text-sm text-white/70",
    photo: "",
  },
  gerabah: {
    section: "border-t border-[var(--gr-line)] bg-[var(--gr-char)] py-20 text-[var(--gr-cream)] md:py-28",
    wrap: "mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-10",
    title: "gr-display text-[clamp(44px,7vw,88px)] leading-none",
    card: "flex flex-col overflow-hidden rounded-[22px] border border-[var(--gr-line)] p-5",
    muted: "gr-caps text-sm text-[var(--gr-cream)]/70",
    photo: "rounded-[16px]",
  },
  editorial: {
    section: "py-20 md:py-28",
    wrap: "mx-auto w-full max-w-[1200px] px-5 sm:px-8",
    title: "text-[clamp(40px,6vw,72px)] leading-none tracking-tight",
    card: "flex flex-col overflow-hidden border-t border-current pt-5",
    muted: "text-sm opacity-70",
    photo: "",
  },
};

const dateFmt = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" });

function period(startsAt: Date | null, endsAt: Date | null): string | null {
  if (startsAt && endsAt) return `${dateFmt.format(startsAt)} – ${dateFmt.format(endsAt)}`;
  if (endsAt) return `Sampai ${dateFmt.format(endsAt)}`;
  if (startsAt) return `Mulai ${dateFmt.format(startsAt)}`;
  return null;
}

const GALLERY_MAX = 8;

export default async function TemplateExtras({ brandId, brandName, variant, gallery = true }: { brandId: string; brandName: string; variant: ExtrasVariant; gallery?: boolean }) {
  const [promos, photos] = await Promise.all([
    getActivePromos(brandId),
    gallery
      ? prisma.galleryPhoto.findMany({
          where: { album: { brandId } },
          orderBy: [{ album: { order: "asc" } }, { order: "asc" }],
          take: GALLERY_MAX,
          select: { id: true, imageUrl: true, caption: true },
        })
      : Promise.resolve([]),
  ]);
  if (!promos.length && !photos.length) return null;
  const s = STYLE[variant];

  return (
    <>
      {promos.length > 0 && (
        <section aria-labelledby="promo-title" className={s.section}>
          <div className={s.wrap}>
            <h2 id="promo-title" className={s.title}>
              Promo & event
            </h2>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:mt-14">
              {promos.map((p) => {
                const when = period(p.startsAt, p.endsAt);
                return (
                  <li key={p.id} className={s.card}>
                    {p.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageVariant(p.imageUrl, 1000)}
                        srcSet={imageSrcSet(p.imageUrl)}
                        sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                        alt={p.title}
                        loading="lazy"
                        decoding="async"
                        className={`mb-5 aspect-[4/3] w-full object-cover ${s.photo}`}
                      />
                    )}
                    {when && <p className={s.muted}>{when}</p>}
                    <h3 className="mt-2 text-2xl font-bold leading-tight">{p.title}</h3>
                    {p.description && <p className="mt-3 leading-relaxed opacity-90">{p.description}</p>}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {photos.length > 0 && (
        <section aria-labelledby="galeri-title" className={s.section}>
          <div className={s.wrap}>
            <h2 id="galeri-title" className={s.title}>
              Galeri
            </h2>
            <ul className="mt-10 grid grid-cols-2 gap-3 md:mt-14 md:grid-cols-4 md:gap-4">
              {photos.map((ph) => (
                <li key={ph.id}>
                  <figure>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageVariant(ph.imageUrl, 400)}
                      srcSet={imageSrcSet(ph.imageUrl)}
                      sizes="(min-width: 768px) 25vw, 50vw"
                      alt={ph.caption ?? `Foto ${brandName}`}
                      loading="lazy"
                      decoding="async"
                      className={`aspect-square w-full object-cover ${s.photo}`}
                    />
                    {ph.caption && <figcaption className={`mt-2 ${s.muted}`}>{ph.caption}</figcaption>}
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
