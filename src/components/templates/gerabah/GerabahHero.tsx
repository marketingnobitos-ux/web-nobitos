"use client";

import { useEffect, useState } from "react";
import BranchStatus, { type BranchHoursInfo } from "@/components/templates/gerabah/BranchStatus";
import { Kicker, Pill, formatHarga } from "@/components/templates/gerabah/shared";
import type { GerabahPhoto } from "@/data/brands/apw-gerabah";
import { trackName } from "@/lib/track";

export type HeroSlide = { title: string[]; body: string; side: { label: string; value: string } };

type Props = {
  brandName: string;
  kicker: string;
  slides: HeroSlide[];
  /** Foto piring berlatar transparan, sama untuk semua slide. */
  dish: GerabahPhoto;
  /** Harga termurah menu unggulan + namanya (blok daun pisang). */
  startPrice: { price: number; name: string; portion: string | null } | null;
  menuCount: number;
  /** Cabang dengan jam 7 hari lengkap, untuk kartu "Status hari ini". */
  branches: BranchHoursInfo[];
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
export default function GerabahHero({ brandName, kicker, slides, dish, startPrice, menuCount, branches }: Props) {
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
        <div className="bg-[var(--gr-clay)] px-4 pb-[calc(min(31vw,148px)+1.5rem)] pt-28 sm:px-6 md:px-10 lg:pb-10 lg:pl-14 lg:pr-8 lg:pt-32 xl:pl-20">
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

        {/* HP: piring di antara blok judul & blok kalimat (margin negatif = setengah tinggi piring). */}
        <div className="pointer-events-none relative z-[2] mx-auto -my-[min(31vw,148px)] w-[min(88vw,420px)] lg:hidden">
          <Dish photo={dish} />
        </div>

        {/* Kanan atas: asap — kartu kaca status & data slide. */}
        <div className="hidden flex-col items-end gap-3 px-6 pb-8 pt-32 lg:flex lg:pr-12 xl:pr-20">
          {branches.length > 0 && (
            <div className="gr-glass w-[260px] px-5 py-4">
              <p className="gr-caps text-[var(--gr-cream)]/60">Status hari ini</p>
              <BranchStatus branches={branches} variant="stack" className="mt-2 text-[14px]" />
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
        <div className="px-4 pb-12 pt-[calc(min(31vw,148px)+2rem)] sm:px-6 md:px-10 lg:pb-12 lg:pl-14 lg:pr-[calc(clamp(140px,15vw,270px)+2rem)] lg:pt-10 xl:pl-20">
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
        <div className="flex flex-col justify-end gap-6 bg-[var(--gr-leaf)] px-4 pb-10 pt-10 sm:px-6 md:px-10 lg:items-end lg:pl-[calc(clamp(140px,15vw,270px)+2rem)] lg:pr-12 xl:pr-20">
          {startPrice && (
            <div className="lg:text-right">
              <p className="gr-caps text-[var(--gr-cream)]/70">Mulai dari</p>
              <p className="gr-display mt-2 whitespace-nowrap text-[clamp(36px,3.6vw,64px)]">Rp {formatHarga(startPrice.price)}</p>
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

      {/* Desktop: piring melayang tepat di pertemuan empat blok (seperti referensi); lebar = 2 × ruang yang disisakan sel. */}
      <div className="pointer-events-none absolute left-[48%] top-[60%] z-[2] hidden w-[clamp(280px,30vw,540px)] -translate-x-1/2 -translate-y-1/2 lg:block">
        <Dish photo={dish} />
      </div>
    </section>
  );
}

/**
 * Piring melayang naik-turun pelan dengan asap di atasnya. Tidak diputar: fotonya diambil miring, jadi berputar
 * terlihat janggal. Satu foto untuk semua slide supaya tidak ada kedip saat slide berganti.
 */
function Dish({ photo }: { photo: GerabahPhoto }) {
  return (
    <div className="relative" style={{ aspectRatio: `${photo.width} / ${photo.height}` }}>
      {SMOKE.map((s) => (
        <span
          key={s.left + s.delay}
          aria-hidden
          className="gr-smoke"
          style={{ left: s.left, top: "0%", width: s.size, height: s.size, animationDelay: s.delay, ["--gr-drift" as string]: s.drift }}
        />
      ))}
      <div className="gr-dish gr-dish-in absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} fetchPriority="high" className="gr-float h-full w-full object-contain" />
      </div>
    </div>
  );
}
