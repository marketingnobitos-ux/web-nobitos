"use client";
// Badge "Buka sekarang / Tutup" per cabang (ROADMAP F0.5), dipakai semua template.
// Dihitung di browser (WIB) supaya tidak basi karena cache, diperbarui tiap menit. Sebelum terpasang dan saat jam
// cabang belum lengkap, tidak ada yang dirender: status tidak pernah ditebak.
import { useEffect, useState } from "react";
import { openStatus, type DayHours } from "@/lib/hours";

type Props = {
  hours: DayHours[];
  /** Tipografi & warna mengikuti template pemakai. */
  className?: string;
};

export default function OpenBadge({ hours, className = "" }: Props) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const status = now ? openStatus(hours, now) : null;
  if (!status) return null;

  return (
    <p className={`flex w-fit items-center gap-2 ${className}`}>
      <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${status.open ? "bg-emerald-500" : "bg-current opacity-40"}`} />
      <span>
        <span className="font-semibold">{status.label}</span>
        {status.detail && ` · ${status.detail}`}
      </span>
    </p>
  );
}
