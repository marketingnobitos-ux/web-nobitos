"use client";

import { usePathname, useRouter } from "next/navigation";

const SECTION_RE = /^\/admin\/brands\/([^/]+)(?:\/(pages|menu|gallery|promos|branches))?/;

/** Dropdown brand aktif. Saat ganti brand, tetap di bagian (menu/galeri/...) yang sama. */
export default function BrandSwitcher({ brands }: { brands: { id: string; name: string }[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const match = pathname.match(SECTION_RE);
  const currentId = match && match[1] !== "new" ? match[1] : "";

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value;
    if (!id) return;
    const section = match?.[2] ?? (currentId ? "" : "menu");
    router.push(`/admin/brands/${id}${section ? `/${section}` : ""}`);
  }

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="hidden text-gray-600 sm:inline">Brand aktif:</span>
      <select
        value={currentId}
        onChange={onChange}
        className="max-w-[60vw] rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm"
        aria-label="Pilih brand aktif"
      >
        <option value="">— Pilih brand —</option>
        {brands.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>
    </label>
  );
}
