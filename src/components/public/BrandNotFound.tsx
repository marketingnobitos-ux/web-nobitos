// Isi halaman 404 per brand (ROADMAP F0.5), mengikuti gaya template. Header, footer & tema dari layout publik.
import Link from "next/link";
import type { BrandTemplate } from "@prisma/client";
import EdLink from "@/components/templates/editorial/EdLink";
import { WRAP } from "@/components/templates/anglo/shared";
import { WRAP as TUNGKU_WRAP } from "@/components/templates/tungku/shared";
import { trackName } from "@/lib/track";

const TITLE = "Halaman tidak ditemukan";
const BODY = "Halaman yang kamu cari tidak ada atau sudah pindah. Coba mulai dari Beranda atau lihat menu.";

export default function BrandNotFound({ template }: { template: BrandTemplate }) {
  if (template === "ANGLO") {
    return (
      <div className="ag-noise bg-paper text-ink">
        <section className={`${WRAP} pb-24 pt-14 md:pb-32 md:pt-24`}>
          <p className="font-mono text-sm font-bold uppercase tracking-wider">Error 404</p>
          <h1 className="ag-marker mt-4 text-[clamp(56px,10vw,120px)]">{TITLE}</h1>
          <p className="mt-6 max-w-xl leading-relaxed">{BODY}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/" data-track={trackName("beranda")} className="ag-pill bg-accent text-ink">
              Ke Beranda
            </Link>
            <Link href="/menu" data-track={trackName("menu")} className="ag-pill bg-white text-ink hover:bg-ink hover:text-sheet">
              Lihat Menu
            </Link>
          </div>
        </section>
      </div>
    );
  }

  if (template === "TUNGKU") {
    return (
      <section className={`${TUNGKU_WRAP} pb-24 pt-20 text-center text-ink md:pb-32 md:pt-28`}>
        <p className="tk-caps text-sm tracking-[0.3em] text-brand">404</p>
        <h1 className="tk-caps mt-5 text-[clamp(28px,4vw,44px)] tracking-[0.1em]">{TITLE}</h1>
        <p className="mx-auto mt-6 max-w-md leading-[1.75] text-ink/80">{BODY}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/" data-track={trackName("beranda")} className="tk-btn">
            Ke Beranda
          </Link>
          <Link href="/menu" data-track={trackName("menu")} className="tk-btn tk-btn-ghost">
            Lihat Menu
          </Link>
        </div>
      </section>
    );
  }

  if (template === "DADAK") {
    return (
      <section className="mx-auto w-full max-w-[1200px] px-4 pb-24 pt-40 sm:px-6 md:pb-32 md:pt-48 lg:px-10">
        <p className="dk-caps text-[13px] font-medium">Error 404</p>
        <h1 className="dk-display mt-4 max-w-[12ch] text-[clamp(52px,8vw,112px)]">{TITLE}</h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed">{BODY}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" data-track={trackName("beranda")} className="dk-btn dk-btn-lime">
            Ke Beranda
          </Link>
          <Link href="/menu" data-track={trackName("menu")} className="dk-btn dk-btn-line">
            Lihat Menu
          </Link>
        </div>
      </section>
    );
  }

  if (template === "EDITORIAL") {
    return (
      <section className="bg-paper px-5 pb-24 pt-32 text-ink sm:px-8 md:px-12 md:pb-32 md:pt-44">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-sm text-ink/55">404</p>
          <h1 className="ed-title mt-4 text-[clamp(40px,6vw,96px)]">
            Halaman <em>tidak ditemukan</em>
          </h1>
          <p className="mt-6 max-w-xl text-ink/70">{BODY}</p>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            <EdLink href="/" track={trackName("beranda")}>
              Ke Beranda
            </EdLink>
            <EdLink href="/menu" track={trackName("menu")}>
              Lihat Menu
            </EdLink>
          </div>
        </div>
      </section>
    );
  }

  // BOLD
  return (
    <section className="bg-paper px-4 pb-24 pt-32 text-ink sm:px-6 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-[1400px]">
        <p className="display text-[clamp(96px,18vw,220px)] leading-none text-brand">404</p>
        <h1 className="display mt-4 text-[clamp(28px,4vw,56px)]">{TITLE}</h1>
        <p className="mt-4 max-w-md text-ink/70">{BODY}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            data-track={trackName("beranda")}
            className="inline-flex h-12 items-center rounded-full bg-ink px-6 font-semibold text-paper transition hover:bg-brand"
          >
            Ke Beranda
          </Link>
          <Link
            href="/menu"
            data-track={trackName("menu")}
            className="inline-flex h-12 items-center rounded-full border-2 border-ink px-6 font-semibold transition hover:bg-ink hover:text-paper"
          >
            Lihat Menu
          </Link>
        </div>
      </div>
    </section>
  );
}
