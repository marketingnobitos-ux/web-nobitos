"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ActionState } from "@/lib/validation";

type Item = { id: string; node: React.ReactNode };

/**
 * Grid yang urutannya bisa diubah dengan seret (desktop) atau tombol ◀ ▶ (HP/keyboard).
 * Urutan baru baru tersimpan setelah klik "Simpan urutan" (`onSave` = server action dengan daftar id).
 */
export default function SortableGrid({ items, onSave, className }: { items: Item[]; onSave: (ids: string[]) => Promise<ActionState>; className?: string }) {
  const router = useRouter();
  const initial = items.map((i) => i.id).join(",");
  const [order, setOrder] = useState(() => items.map((i) => i.id));
  const [drag, setDrag] = useState<string | null>(null);
  const [msg, setMsg] = useState<ActionState>(undefined);
  const [busy, setBusy] = useState(false);

  // Data dari server berubah (foto baru/dihapus): mulai lagi dari urutan server.
  useEffect(() => setOrder(initial.split(",").filter(Boolean)), [initial]);

  const byId = new Map(items.map((i) => [i.id, i.node]));
  const ids = order.filter((id) => byId.has(id));
  const dirty = ids.join(",") !== initial;

  function move(id: string, to: number) {
    setOrder((prev) => {
      const next = prev.filter((x) => x !== id);
      next.splice(Math.max(0, Math.min(to, next.length)), 0, id);
      return next;
    });
    setMsg(undefined);
  }

  async function save() {
    setBusy(true);
    const result = await onSave(ids);
    setBusy(false);
    setMsg(result);
    if (result?.ok) router.refresh();
  }

  return (
    <div className="space-y-3">
      {items.length > 1 && (
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="text-gray-600">Seret foto (atau pakai ◀ ▶) untuk mengubah urutan.</span>
          {dirty && (
            <>
              <button type="button" onClick={save} disabled={busy} className="adm-btn-dark !min-h-10">
                {busy ? "Menyimpan..." : "Simpan urutan"}
              </button>
              <button type="button" onClick={() => setOrder(initial.split(","))} className="font-semibold text-gray-700 hover:underline">
                Batal
              </button>
            </>
          )}
          {msg?.error && <span role="alert" className="font-semibold text-red-700">{msg.error}</span>}
          {msg?.ok && !dirty && <span role="status" className="font-semibold text-[#2f5a1c]">{msg.message}</span>}
        </div>
      )}
      <ul className={className}>
        {ids.map((id, idx) => (
          <li
            key={id}
            draggable
            onDragStart={(e) => {
              setDrag(id);
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragOver={(e) => {
              e.preventDefault();
              if (drag && drag !== id) move(drag, idx);
            }}
            onDragEnd={() => setDrag(null)}
            className={`relative ${drag === id ? "opacity-40" : ""}`}
          >
            {items.length > 1 && (
              <div className="absolute right-5 top-5 z-10 flex gap-1">
                <button type="button" onClick={() => move(id, idx - 1)} disabled={idx === 0} aria-label="Geser ke kiri" className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-xs text-white disabled:opacity-30">
                  ◀
                </button>
                <button type="button" onClick={() => move(id, idx + 1)} disabled={idx === ids.length - 1} aria-label="Geser ke kanan" className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-xs text-white disabled:opacity-30">
                  ▶
                </button>
              </div>
            )}
            <div className="cursor-grab active:cursor-grabbing">{byId.get(id)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
