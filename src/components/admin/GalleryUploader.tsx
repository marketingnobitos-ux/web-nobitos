"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/components/admin/ImageField";
import type { ActionState } from "@/lib/validation";

type Props = {
  brandId: string;
  onUploaded: (urls: string[]) => Promise<ActionState>;
};

/** Upload banyak foto sekaligus, lalu simpan ke album lewat server action. */
export default function GalleryUploader({ brandId, onUploaded }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;

    setBusy(true);
    const urls: string[] = [];
    const failed: string[] = [];
    for (const [i, file] of files.entries()) {
      setStatus(`Mengunggah ${i + 1} / ${files.length}...`);
      try {
        urls.push(await uploadImage(file, brandId));
      } catch (err) {
        failed.push(`${file.name}: ${err instanceof Error ? err.message : "gagal"}`);
      }
    }

    const result = urls.length ? await onUploaded(urls) : undefined;
    setBusy(false);
    setStatus(
      [result?.error ?? result?.message, failed.length ? `Gagal: ${failed.join("; ")}` : null].filter(Boolean).join(" ") || null,
    );
    router.refresh();
  }

  return (
    <div>
      <label className={`inline-block cursor-pointer rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold hover:border-gray-900 ${busy ? "opacity-50" : ""}`}>
        {busy ? "Mengunggah..." : "+ Upload foto (bisa banyak)"}
        <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" onChange={onFiles} disabled={busy} />
      </label>
      {status && <p className="mt-2 text-sm text-gray-700">{status}</p>}
    </div>
  );
}
