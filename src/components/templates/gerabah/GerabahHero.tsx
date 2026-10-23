"use client";

import { useEffect, useState } from "react";
import OpenBadge from "@/components/public/OpenBadge";
import { Kicker, Pill, formatHarga } from "@/components/templates/gerabah/shared";
import type { GerabahPhoto } from "@/data/brands/apw-gerabah";
import type { DayHours } from "@/lib/hours";
import { trackName } from "@/lib/track";

export type HeroSlide = { title: string[]; body: string; photo: GerabahPhoto; side: { label: string; value: string } };

type Props = {
  brandName: string;
  kicker: string;
  slides: HeroSlide[];
  /** Harga termurah menu unggulan + namanya (blok daun pisang). */
  startPrice: { price: number; name: string; portion: string | null } | null;
  menuCount: number;
  hours: DayHours[] | null;
};

const INTERVAL_MS = 7000;

/** Titik-titik asap: posisi (% dari lebar sajian), ukuran, jeda & arah melayang. */
const SMOKE = [
  { left: "30%", size: 120, delay: "0s", drift: "-30px" },
  { left: "48%", size: 150, delay: "2.2s", drift: "24px" },
  { left: "62%", size: 110, delay: "4.4s", drift: "-12px" },
  { left: "40%", size: 90, delay: "6.1s", drift: "36px" },
];

/**
 * Hero Beranda: papan 2×2 blok warna (gerabah | asap / asap | daun pisang) bergaris grid, sajian bulat melayang
 * di pertemuan blok, judul kapital besar yang berganti tiap slide, kartu kaca status buka & data porsi.
 * Ganti otomatis tiap 7 detik (berhenti saat kursor/fokus di hero atau pengguna memilih kurangi gerakan).
 */
export default function GerabahHero({ brandName, kicker, slides, startPrice, menuCount, hours }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (paused || reduced || slides.length < 2) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % slides.length), INTERVAL_MS);
    return () => clearTimeout(id);
  }, [index, paused, reduced, slides.length]);

  const slide = slides[index];
  const counter = (n: number) => String(n).padStart(2, "0");

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Sorotan Ayam Panggang Wicaksono"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative overflow-hidden bg-[var(--gr-slate)] lg:h-[100svh] lg:max-h-[920px] lg:min-h-[680px]"
    >
      {/* Papan 2×2 mulai lg (1024 px); di bawahnya blok ditumpuk dengan sajian di antara judul & kalimat. */}
      <div className="grid lg:h-full lg:grid-cols-[48fr_52fr] lg:grid-rows-[60fr_40fr]">
        {/* Kiri atas: gerabah — nama brand & judul slide. */}
        <div className="bg-[var(--gr-clay)] px-4 pb-[calc(min(39vw,180px)+1.5rem)] pt-28 sm:px-6 md:px-10 lg:pb-10 lg:pl-14 lg:pr-8 lg:pt-32 xl:pl-20">
          <Kicker className="text-[var(--gr-cream)]/85">{kicker}</Kicker>
          <h1 className="gr-caps mt-3 text-[13px] text-[var(--gr-cream)]">{brandName}</h1>
          <p key={index} className="gr-display gr-slide-in relative z-[3] mt-6 text-[clamp(38px,10.5vw,64px)] lg:text-[clamp(44px,5vw,80px)]">
            {slide.title.map((line) => (
              <span key={line} className="block">
                {line}{" "}
              </span>
            ))}
          </p>
        </div>

        {/* HP: sajian di antara blok judul & blok kalimat (margin negatif = setengah tinggi sajian). */}
        <div className="pointer-events-none relative z-[2] mx-auto -my-[min(39vw,180px)] w-[min(78vw,360px)] lg:hidden">
          <Dish slides={slides} index={index} />
        </div>

        {/* Kanan atas: asap — kartu kaca status & data slide. */}
        <div className="hidden flex-col items-end gap-3 px-6 pb-8 pt-32 lg:flex lg:pr-12 xl:pr-20">
          {hours && (
            <div className="gr-glass w-[260px] px-5 py-4">
              <p className="gr-caps text-[var(--gr-cream)]/60">Status hari ini</p>
              <OpenBadge hours={hours} className="mt-2 text-[15px]" />
            </div>
          )}
          <div key={index} className="gr-glass gr-slide-in w-[260px] px-5 py-4">
            <p className="gr-caps text-[var(--gr-cream)]/60">{slide.side.label}</p>
            <p className="gr-display mt-2 text-[26px]">{slide.side.value}</p>
          </div>
          <div className="gr-glass flex w-[260px] items-center justify-between px-5 py-4">
            <div>
              <p className="gr-caps text-[var(--gr-cream)]/60">Pilihan menu</p>
              <p className="gr-display mt-2 text-[26px]">{menuCount} menu</p>
            </div>
            <Pill href="/menu" track={trackName("menu")} arrow className="!min-h-0 !px-3 !py-2 !text-[11px]">
              Lihat
            </Pill>
          </div>
        </div>

        {/* Kiri bawah: asap — kalimat slide & tombol. Desktop: ruang kanan = setengah sajian supaya teks tidak tertutup. */}
        <div className="px-4 pb-12 pt-[calc(min(39vw,180px)+2rem)] sm:px-6 md:px-10 lg:pb-12 lg:pl-14 lg:pr-[calc(clamp(130px,14vw,250px)+2rem)] lg:pt-10 xl:pl-20">
          <p key={index} className="gr-slide-in max-w-[40ch] text-[17px] leading-relaxed text-[var(--gr-cream)]/85">
            {slide.body}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Pill href="/menu" track={trackName("menu")} variant="gold">
              Lihat menu
            </Pill>
            <Pill href="/cabang" track={trackName("cabang")}>
              Lokasi &amp; jam
            </Pill>
          </div>
        </div>

        {/* Kanan bawah: daun pisang — harga mulai & navigasi slide (ruang kiri = setengah sajian). */}
        <div className="flex flex-col justify-end gap-6 bg-[var(--gr-leaf)] px-4 pb-10 pt-10 sm:px-6 md:px-10 lg:items-end lg:pl-[calc(clamp(130px,14vw,250px)+2rem)] lg:pr-12 xl:pr-20">
          {startPrice && (
            <div className="lg:text-right">
              <p className="gr-caps text-[var(--gr-cream)]/70">Mulai dari</p>
              <p className="gr-display mt-2 text-[clamp(40px,4.4vw,64px)]">Rp {formatHarga(startPrice.price)}</p>
              <p className="mt-1 text-sm text-[var(--gr-cream)]/80">
                {startPrice.name}
                {startPrice.portion && ` · ${startPrice.portion}`}
              </p>
            </div>
          )}
          {slides.length > 1 && (
            <div className="flex items-center gap-4">
              <p className="gr-caps tabular-nums text-[var(--gr-cream)]/80" aria-hidden>
                {counter(index + 1)} / {counter(slides.length)}
              </p>
              <div className="flex gap-2">
                {slides.map((s, i) => (
                  <button
                    key={s.title.join(" ")}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Slide ${i + 1}: ${s.title.join(" ")}`}
                    aria-current={i === index ? "true" : undefined}
                    className="group grid h-11 place-items-center"
                  >
                    <span className={`block h-[3px] overflow-hidden rounded-full bg-white/25 transition-[width] ${i === index ? "w-14" : "w-6 group-hover:bg-white/50"}`}>
                      {i === index && (
                        <span
                          key={`${index}-${paused || reduced}`}
                          className="block h-full bg-[var(--gr-gold)]"
                          style={
                            paused || reduced
                              ? { width: "100%" }
                              : { width: "100%", transformOrigin: "left", animation: `gr-progress ${INTERVAL_MS}ms linear both` }
                          }
                        />
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop: sajian melayang tepat di pertemuan empat blok (seperti referensi); lebar = 2 × ruang yang disisakan sel. */}
      <div className="pointer-events-none absolute left-[48%] top-[60%] z-[2] hidden w-[clamp(260px,28vw,500px)] -translate-x-1/2 -translate-y-1/2 lg:block">
        <Dish slides={slides} index={index} />
      </div>
    </section>
  );
}

function Dish({ slides, index }: { slides: HeroSlide[]; index: number }) {
  return (
    <div className="relative aspect-square">
      {SMOKE.map((s) => (
        <span
          key={s.left + s.delay}
          aria-hidden
          className="gr-smoke"
          style={{ left: s.left, top: "18%", width: s.size, height: s.size, animationDelay: s.delay, ["--gr-drift" as string]: s.drift }}
        />
      ))}
      {slides.map((s, i) => (
        <div
          key={s.photo.src}
          aria-hidden={i !== index}
          className={`gr-dish absolute inset-0 transition-[opacity,translate,scale] duration-[900ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
            i === index ? "opacity-100" : "translate-y-6 scale-95 opacity-0"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s.photo.src}
            alt={i === index ? s.photo.alt : ""}
            width={s.photo.width}
            height={s.photo.height}
            fetchPriority={i === 0 ? "high" : undefined}
            loading={i === 0 ? "eager" : "lazy"}
            className="gr-spin h-full w-full rounded-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
