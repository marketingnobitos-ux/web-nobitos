"use client";

import { useState } from "react";
import MenuCard, { type MenuCardItem } from "@/components/public/MenuCard";

export type MenuCategoryGroup = { id: string; name: string; items: MenuCardItem[] };

// Daftar menu per kategori + chip filter kategori.
export default function MenuFilter({ categories }: { categories: MenuCategoryGroup[] }) {
  const [active, setActive] = useState<string>("all");
  const shown = active === "all" ? categories : categories.filter((c) => c.id === active);

  const chip = (selected: boolean) =>
    `shrink-0 rounded-full border px-4 py-2 text-sm transition ${
      selected ? "border-primary bg-primary text-white" : "border-gray-300 bg-white text-gray-700 hover:border-primary"
    }`;

  return (
    <div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2" role="group" aria-label="Filter kategori">
        <button type="button" aria-pressed={active === "all"} className={chip(active === "all")} onClick={() => setActive("all")}>
          Semua
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={active === c.id}
            className={chip(active === c.id)}
            onClick={() => setActive(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-10">
        {shown.map((c) => (
          <section key={c.id}>
            <h2 className="text-xl font-bold text-gray-900">{c.name}</h2>
            {c.items.length ? (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                {c.items.map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-500">Belum ada menu di kategori ini.</p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
