"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { ActionState } from "@/lib/validation";

const rupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

/** Harga di daftar menu yang bisa diubah langsung: klik harga → isi angka → Enter/Simpan. */
export default function PriceEdit({ price, label, action }: { price: number; label: string; action: (state: ActionState, formData: FormData) => Promise<ActionState> }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(action, undefined);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) input.current?.select();
  }, [editing]);
  useEffect(() => {
    if (state?.ok) setEditing(false);
  }, [state]);

  if (!editing) {
    return (
      <form onSubmit={(e) => (e.preventDefault(), setEditing(true))} className="inline">
        <button type="submit" title="Ubah harga" aria-label={`Ubah harga ${label}, sekarang ${rupiah(price)}`} className="rounded-md underline decoration-dotted underline-offset-4 hover:text-[#f4f3ea]">
          {rupiah(price)} ✎
        </button>
        {state?.error && (
          <span role="alert" className="ml-2 text-red-300">
            {state.error}
          </span>
        )}
      </form>
    );
  }

  return (
    <form action={formAction} className="inline-flex items-center gap-1.5" onKeyDown={(e) => e.key === "Escape" && setEditing(false)}>
      <span aria-hidden>Rp</span>
      <input
        ref={input}
        name="price"
        inputMode="numeric"
        defaultValue={price}
        aria-label={`Harga baru ${label}`}
        className="h-8 w-24 rounded-lg border border-[#4a4a4a] bg-[#141414] px-2 text-sm text-[#f4f3ea] outline-none focus:border-[#a6d27a]"
      />
      <button type="submit" disabled={pending} className="h-8 rounded-full bg-[#a6d27a] px-3 text-xs font-bold text-[#141414] disabled:opacity-50">
        {pending ? "..." : "Simpan"}
      </button>
      <button type="button" onClick={() => setEditing(false)} aria-label="Batal" className="h-8 px-1 text-xs">
        ✕
      </button>
    </form>
  );
}
