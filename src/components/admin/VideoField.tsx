"use client";

import { useState } from "react";
import { uploadImage } from "@/components/admin/ImageField";

type Props = { name: string; label: string; brandId: string; defaultValue?: string | null; hint?: string };

/** Upload satu video MP4 ke /api/upload lalu simpan URL-nya di hidden input `name`. */
export default function VideoField({ name, label, brandId, defaultValue, hint }: Props) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setStatus(`Mengunggah ${(file.size / 1024 / 1024).toFixed(1)} MB...`);
    try {
      // Endpoint yang sama dengan gambar; server membedakan dari tipe file.
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
          <video src={url} muted playsInline preload="metadata" className="h-20 w-32 rounded border border-gray-200 bg-black object-cover" />
        ) : (
          <div className="flex h-20 w-32 items-center justify-center rounded border border-dashed border-gray-300 text-xs text-gray-400">
            Belum ada video
          </div>
        )}
        <label className="cursor-pointer rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold hover:border-gray-900">
          {busy ? "Mengunggah..." : url ? "Ganti video" : "Pilih video MP4"}
          <input type="file" accept="video/mp4" className="sr-only" onChange={onFile} disabled={busy} />
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
