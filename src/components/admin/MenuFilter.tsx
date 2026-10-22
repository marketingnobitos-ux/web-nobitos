"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * Filter pil kategori + kotak cari untuk daftar menu Admin.
 * Daftar tetap dirender server; komponen ini hanya menyembunyikan elemen
 * `[data-cat]` (blok kategori) dan `[data-item]` (baris menu, berisi nama huruf kecil).
 */
export default function MenuFilter({
  categories,
  addHref,
  children,
}: {
  categories: { id: string; name: string; count: number }[];
  addHref?: string;
  children: React.ReactNode;
}) {
  const [cat, setCat] = useState<string>(categories[0]?.id ?? "");
  const [q, setQ] = useState("");
  const box = useRef<HTMLDivElement>(null);
  const query = q.trim().toLowerCase();

  useEffect(() => {
    const root = box.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>("[data-cat]").forEach((block) => {
      let shown = 0;
      block.querySelectorAll<HTMLElement>("[data-item]").forEach((row) => {
        const hit = !query || (row.dataset.item ?? "").includes(query);
        row.hidden = !hit;
        if (hit) shown++;
      });
      // Saat mencari: tampilkan semua kategori yang punya hasil. Tanpa cari: hanya kategori terpilih.
      block.hidden = query ? shown === 0 : block.dataset.cat !== cat;
    });
  }, [cat, query]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <div className="adm-scroll-x -mx-3 flex w-[calc(100%+24px)] gap-2 overflow-x-auto px-3 sm:mx-0 sm:w-auto sm:flex-wrap sm:overflow-visible sm:px-0" role="group" aria-label="Kategori">
          {categories.map((c) => (
            <button key={c.id} type="button" aria-pressed={!query && cat === c.id} onClick={() => (setCat(c.id), setQ(""))} className="adm-chip">
              {c.name} · {c.count}
            </button>
          ))}
          <a href="#kategori" aria-label="Kelola kategori" title="Tambah / ubah kategori" className="adm-btn-ghost !h-11 !w-11 shrink-0 !p-0 !text-2xl !font-normal lg:!h-[52px] lg:!w-[52px]">
            +
          </a>
        </div>
        <span className="hidden flex-1 lg:block" />
        <label className="flex h-12 w-full items-center gap-2.5 rounded-full bg-black/30 px-[18px] sm:w-auto sm:min-w-[240px] lg:h-[52px]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
          <span className="sr-only">Cari menu</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari menu…"
            className="w-full bg-transparent text-[15px] font-medium text-[#f4f3ea] outline-none placeholder:text-[#d4dcc8]"
          />
        </label>
        {addHref && (
          <Link href={addHref} className="adm-btn hidden !h-[52px] !px-6 !text-base sm:inline-flex">
            + Tambah menu
          </Link>
        )}
      </div>
      <div ref={box}>{children}</div>
      {addHref && (
        <Link href={addHref} className="adm-btn !h-[52px] !text-base sm:hidden">
          + Tambah menu
        </Link>
      )}
    </div>
  );
}
