"use client";

import { useFormStatus } from "react-dom";

/** Tombol submit kecil yang meredup saat form-nya sedang dikirim (untuk aksi cepat di daftar). */
export default function PendingButton({ children, className, disabled, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus();
  return (
    <button {...rest} type="submit" disabled={pending || disabled} aria-busy={pending} className={`${className ?? ""} disabled:cursor-not-allowed disabled:opacity-40`}>
      {children}
    </button>
  );
}
