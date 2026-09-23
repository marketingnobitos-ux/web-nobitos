import Reveal from "@/components/animations/Reveal";
import EdAmbientVideo from "@/components/templates/editorial/EdAmbientVideo";
import { imageSrcSet } from "@/lib/image";

type Photo = { id: string; imageUrl: string; caption: string | null };
type Feature = { title?: string; imageUrl?: string; videoUrl?: string } | undefined;

// Masker gradasi: tepi media memudar sungguhan ke warna latar (bukan sekadar digelapkan).
const FEATURE_MASK: React.CSSProperties = {
  maskImage: "linear-gradient(to bottom, transparent, #000 22%, #000 70%, transparent), linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
  WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 22%, #000 70%, transparent), linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
};
const PHOTO_MASK: React.CSSProperties = {
  maskImage: "linear-gradient(to bottom, transparent, #000 14%, #000 82%, transparent)",
  WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 14%, #000 82%, transparent)",
};

// Pola letak foto berulang tiap 3 foto: kiri tinggi, kanan turun, tengah.
const LAYOUT = [
  { cell: "md:col-span-5", ratio: "aspect-[3/4]" },
  { cell: "md:col-span-6 md:col-start-7 md:mt-40", ratio: "aspect-[4/5]" },
  { cell: "md:col-span-6 md:col-start-3 md:-mt-10", ratio: "aspect-[3/4]" },
];

/**
 * Galeri template Editorial: latar maroon gelap, satu video/foto utama lebar yang memudar halus
 * ke latar, lalu foto-foto besar tersusun asimetris dengan gradasi lembut dan keterangan di atasnya.
 */
export default function EditorialGallery({ brandName, photos, feature }: { brandName: string; photos: Photo[]; feature: Feature }) {
  const featureMedia = feature?.videoUrl || feature?.imageUrl;

  return (
    <div className="bg-ink text-paper">
      <header className="mx-auto max-w-[1440px] px-5 pb-14 pt-20 sm:px-8 md:px-12 md:pb-20 md:pt-32">
        <Reveal>
          <p className="text-sm text-paper/55">{brandName}</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="ed-title mt-3 text-[clamp(52px,9vw,140px)]">
            <em>Galeri</em>
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-6 max-w-md text-lg text-paper/65">Sudut-sudut toko kami, dari etalase sampai pintu depan.</p>
        </Reveal>
      </header>

      {featureMedia && (
        <Reveal as="section" y={32} className="relative mx-auto max-w-[1600px] overflow-hidden md:px-12">
          <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[4/3] md:aspect-[21/10]" style={FEATURE_MASK}>
            {feature?.videoUrl ? (
              <EdAmbientVideo src={feature.videoUrl} poster={feature.imageUrl} className="h-full w-full object-cover" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={feature?.imageUrl} srcSet={imageSrcSet(feature?.imageUrl ?? "")} sizes="100vw" alt="" className="h-full w-full object-cover" />
            )}
            <div className="pointer-events-none absolute inset-0 bg-ink/15" />
          </div>
          {feature?.title && (
            <p className="mt-2 px-5 text-sm text-paper/60 sm:px-8 md:px-0 md:text-center md:text-base">{feature.title}</p>
          )}
        </Reveal>
      )}

      <div className="mx-auto max-w-[1440px] px-5 pb-28 pt-16 sm:px-8 md:px-12 md:pb-40 md:pt-24">
        {photos.length === 0 ? (
          <p className="text-paper/60">Foto belum tersedia.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-12 md:gap-x-10 md:gap-y-16">
            {photos.map((p, i) => (
              <Reveal key={p.id} y={40} delay={(i % 2) * 0.08} className={LAYOUT[i % LAYOUT.length].cell}>
                <figure className={`group relative overflow-hidden ${LAYOUT[i % LAYOUT.length].ratio}`} style={PHOTO_MASK}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.imageUrl}
                    srcSet={imageSrcSet(p.imageUrl)}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    alt={p.caption ?? `Foto ${brandName}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(.16,.8,.2,1)] group-hover:scale-[1.04]"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                  {p.caption && (
                    <figcaption className="absolute bottom-[12%] left-5 right-5 flex items-baseline gap-3 text-paper md:left-7">
                      <span className="text-sm tabular-nums text-paper/50">{String(i + 1).padStart(2, "0")}</span>
                      <span className="ed-title text-[clamp(20px,2vw,28px)]">{p.caption}</span>
                    </figcaption>
                  )}
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
