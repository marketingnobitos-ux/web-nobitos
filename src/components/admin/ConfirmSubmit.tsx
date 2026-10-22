"use client";

import { useFormStatus } from "react-dom";

/** Tombol submit yang minta konfirmasi dulu (untuk aksi hapus). */
export default function ConfirmSubmit({ message, children = "Hapus" }: { message: string; children?: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
      className="inline-flex min-h-10 items-center rounded-full border border-red-300 px-4 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
    >
      {pending ? "Menghapus..." : children}
    </button>
  );
}
