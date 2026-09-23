import Link from "next/link";
import type { Branch } from "@prisma/client";
import Reveal from "@/components/animations/Reveal";
import SectionIntro from "@/components/public/home/SectionIntro";
import { mapsLink, slugify, whatsappUrl } from "@/lib/format";

/** Section penutup berwarna brand: kartu cabang (bisa di-swipe) + tombol ke halaman Cabang. */
export default function BranchCta({ brandName, branches }: { brandName: string; branches: Branch[] }) {
  return (
    <section className="bg-primary py-20 text-white sm:py-28" aria-label="Cabang">
      <div className="mx-auto max-w-6xl px-5">
        <SectionIntro
          align="left"
          tone="light"
          eyebrow="Kunjungi kami"
          title={branches.length ? `${branches.length} cabang ${brandName} siap menyambut Anda` : `Cabang ${brandName}`}
          description="Datang langsung, rasakan hangatnya. Pilih cabang terdekat dari tempat Anda."
        />
      </div>

      {branches.length > 0 && (
        <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 sm:scroll-px-[max(1.25rem,calc((100vw-72rem)/2))] sm:px-[max(1.25rem,calc((100vw-72rem)/2))]">
          {branches.map((b, i) => {
            const key = slugify(b.name);
            return (
              <Reveal key={b.id} delay={Math.min(i, 3) * 0.08} className="w-[82%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]">
                <article className="flex h-full flex-col rounded-3xl bg-white p-6 text-ink shadow-lg">
                  <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">Cabang</span>
                  <h3 className="mt-4 font-display text-xl font-extrabold">{b.name}</h3>
                  <p className="mt-2 text-sm text-ink/70">{b.address}</p>
                  {b.openHours && <p className="mt-1 text-sm text-ink/55">{b.openHours}</p>}
                  <div className="mt-auto flex flex-wrap gap-2 pt-6">
                    <a
                      href={mapsLink(b)}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-track={`maps-beranda-${key}`}
                      className="rounded-full border-2 border-ink/15 px-4 py-2 text-sm font-bold transition hover:border-primary hover:text-primary"
                    >
                      Petunjuk arah
                    </a>
                    {b.whatsapp && (
                      <a
                        href={whatsappUrl(b.whatsapp, `Halo ${brandName} cabang ${b.name}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-track={`wa-beranda-${key}`}
                        className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
                      >
                        WhatsApp
                      </a>
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      )}

      <div className="mx-auto mt-10 max-w-6xl px-5">
        <Link
          href="/cabang"
          data-track="cta-lihat-cabang"
          className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-ink shadow-lg transition hover:-translate-y-0.5"
        >
          Lihat semua cabang <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
