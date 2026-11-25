import { AMINOTO_IMAGES } from "@/data/brands/aminoto";

/**
 * Adegan "zoom ke cobek": saat digulir, lingkaran kecil berisi sambal melebar sampai memenuhi layar, lalu kata-kata
 * muncul satu per satu. Progres gulir ditulis DadakScrollFx ke variabel --p (jalan juga di Safari iPhone); sebelum JS jalan dan
 * untuk pengguna "kurangi gerakan", adegan langsung di keadaan akhir.
 */
export default function DadakCobekZoom({ lines, body }: { lines: string[]; body: string }) {
  const img = AMINOTO_IMAGES.sambal;
  return (
    <section aria-labelledby="cobek-title" data-dk-fx="sticky" className="dk-zoom relative h-[230svh] bg-[var(--dk-deep)] text-[var(--dk-cream)]">
      <div className="sticky top-0 grid h-[100svh] place-items-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img.src} alt={img.alt} width={1600} height={1600} loading="lazy" decoding="async" className="dk-zoom-photo absolute inset-0 h-full w-full object-cover" />
        <div aria-hidden className="dk-zoom-shade absolute inset-0 bg-[rgb(10_34_25/0.62)]" />
        <div className="relative px-4 text-center">
          <h2 id="cobek-title" className="dk-display text-[clamp(48px,min(12vw,14svh),150px)] leading-[1.02]">
            {lines.map((line, i) => (
              <span key={line} className={`dk-zoom-line block pb-[0.06em] ${i === lines.length - 1 ? "text-accent" : ""}`} style={{ "--i": i } as React.CSSProperties}>
                {line}
              </span>
            ))}
          </h2>
          <p className="dk-caps dk-zoom-line mx-auto mt-10 max-w-[36ch] text-[15px] font-medium leading-relaxed sm:text-base" style={{ "--i": lines.length } as React.CSSProperties}>
            {body}
          </p>
        </div>
      </div>
    </section>
  );
}
