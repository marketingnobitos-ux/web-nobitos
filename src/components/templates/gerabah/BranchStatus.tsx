"use client";
// Status "buka / tutup" beberapa cabang sekaligus (APW punya Kesambi & Sumber dengan jam berbeda).
// Sama seperti OpenBadge: dihitung di browser (WIB), diperbarui tiap menit, tidak dirender sebelum terpasang.
import { useEffect, useState } from "react";
import { openStatus, type DayHours } from "@/lib/hours";

export type BranchHoursInfo = { name: string; hours: DayHours[] };

type Props = {
  branches: BranchHoursInfo[];
  /** inline = satu baris ringkas (header); stack = satu baris per cabang dengan keterangan jam berikutnya. */
  variant?: "inline" | "stack";
  className?: string;
};

export default function BranchStatus({ branches, variant = "inline", className = "" }: Props) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (!now) return null;
  const rows = branches.flatMap((b) => {
    const status = openStatus(b.hours, now);
    return status ? [{ name: b.name, ...status }] : [];
  });
  if (rows.length === 0) return null;

  const dot = (open: boolean) => <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${open ? "bg-emerald-500" : "bg-current opacity-40"}`} />;

  if (variant === "stack") {
    return (
      <ul className={`space-y-1.5 ${className}`}>
        {rows.map((r) => (
          <li key={r.name} className="flex items-center gap-2">
            {dot(r.open)}
            <span>
              <span className="font-semibold">
                {r.name}: {r.open ? "buka" : "tutup"}
              </span>
              {r.detail && ` · ${r.detail}`}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p className={`flex w-fit flex-wrap items-center gap-x-3 gap-y-1 ${className}`}>
      {rows.map((r) => (
        <span key={r.name} className="flex items-center gap-1.5">
          {dot(r.open)}
          <span>
            <span className="font-semibold">{r.name}</span> {r.open ? "buka" : "tutup"}
          </span>
        </span>
      ))}
    </p>
  );
}
