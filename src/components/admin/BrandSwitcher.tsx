"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SECTION_RE = /^\/admin\/brands\/([^/]+)(?:\/(pages|menu|gallery|promos|branches))?/;

/**
 * Pil "Brand aktif".
 * - Di Ringkasan (/admin): menyaring data ("Semua brand" atau satu brand), rentang tanggal tetap.
 * - Di tempat lain: membuka brand terpilih, tetap di bagian (menu/galeri/...) yang sama.
 */
export default function BrandSwitcher({ brands }: { brands: { id: string; name: string }[] }) {
  const pathname = usePathname();
  const search = useSearchParams();
  const router = useRouter();
  const onDashboard = pathname === "/admin";
  const match = pathname.match(SECTION_RE);
  const currentId = onDashboard ? (search.get("brand") ?? "") : match && match[1] !== "new" ? match[1] : "";

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value;
    if (onDashboard) {
      const qs = new URLSearchParams(search.toString());
      if (id) qs.set("brand", id);
      else qs.delete("brand");
      router.push(`/admin${qs.size ? `?${qs}` : ""}`);
      return;
    }
    if (!id) return;
    const section = match?.[2] ?? (currentId ? "" : "menu");
    router.push(`/admin/brands/${id}${section ? `/${section}` : ""}`);
  }

  return (
    <label className="flex w-full items-center gap-2 self-start rounded-full border border-[rgba(244,243,234,0.45)] py-1.5 pl-4 pr-1.5 text-sm sm:w-auto sm:gap-2.5 sm:py-2 sm:pl-[18px] sm:pr-2">
      <span className="shrink-0 text-[#d4dcc8]">
        <span className="sm:hidden">Brand</span>
        <span className="hidden sm:inline">Brand aktif</span>
      </span>
      <select
        value={currentId}
        onChange={onChange}
        className="min-w-0 flex-1 cursor-pointer rounded-full border-0 bg-[#f4f3ea] px-3.5 py-2 text-sm font-semibold text-[#141414] sm:flex-none"
        aria-label="Pilih brand aktif"
      >
        <option value="">{onDashboard ? "Semua brand" : "— Pilih brand —"}</option>
        {brands.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>
    </label>
  );
}
