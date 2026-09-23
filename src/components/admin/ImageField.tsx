"use client";

import { useState } from "react";
import { imageVariant } from "@/lib/image";

type Props = { name: string; label: string; brandId: string; defaultValue?: string | null; hint?: string };

/** Upload satu gambar ke /api/upload lalu simpan URL-nya di hidden input `name`. */
export default function ImageField({ name, label, brandId, defaultValue, hint }: Props) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setStatus("Mengunggah & mengoptimasi...");
    try {
      setUrl(await uploadImage(file, brandId));
      setStatus(null);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Upload gagal.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      <input type="hidden" name={name} value={url} />
      <div className="flex flex-wrap items-center gap-3">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageVariant(url, 400)} alt="" className="h-20 w-20 rounded border border-gray-200 object-cover" />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded border border-dashed border-gray-300 text-xs text-gray-400">
            Kosong
          </div>
        )}
        <label className="cursor-pointer rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50">
          {busy ? "Mengunggah..." : url ? "Ganti gambar" : "Pilih gambar"}
          <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={onFile} disabled={busy} />
        </label>
        {url && !busy && (
          <button type="button" onClick={() => setUrl("")} className="text-sm text-red-600 hover:underline">
            Hapus
          </button>
        )}
      </div>
      {status && <p className="mt-1 text-xs text-gray-600">{status}</p>}
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

export async function uploadImage(file: File, brandId: string): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  body.append("brandId", brandId);
  const res = await fetch("/api/upload", { method: "POST", body });
  const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!res.ok || !json.url) throw new Error(json.error ?? `Upload gagal (${res.status}).`);
  return json.url;
}
