"use client";
// Visual data jam buka dari tabel BranchHours (bukan angka karangan): cincin 24 jam & batang per hari.
import { useEffect, useState } from "react";
import type { DayHours } from "@/lib/hours";

const DAY_SHORT = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

const toHours = (t: string) => Number(t.slice(0, 2)) + Number(t.slice(3)) / 60;

/** Lama buka satu hari dalam jam; tutup <= buka dianggap lewat tengah malam (16:00–00:00 = 8 jam). */
function openLength(d: DayHours): number {
  if (d.isClosed || !d.opens || !d.closes) return 0;
  const open = toHours(d.opens);
  const close = toHours(d.closes);
  return close <= open ? close + 24 - open : close - open;
}

/** Hari ISO (1 = Senin) sekarang dalam WIB. */
function wibDay(now: Date): number {
  const wib = new Date(now.getTime() + 7 * 3600_000);
  return ((wib.getUTCDay() + 6) % 7) + 1;
}

/** Cincin 24 jam: busur emas = rentang buka (diambil dari hari buka pertama). */
export function HoursRing({ hours, size = 112 }: { hours: DayHours[]; size?: number }) {
  const day = hours.find((h) => !h.isClosed && h.opens && h.closes);
  if (!day) return null;
  const r = 42;
  const c = 2 * Math.PI * r;
  const len = openLength(day);
  const start = toHours(day.opens!);
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={`Buka ${len} jam sehari, ${day.opens!.replace(":", ".")} sampai ${day.closes!.replace(":", ".")}`}>
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgb(255 255 255 / 0.16)" strokeWidth="7" />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="var(--gr-gold)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={`${(len / 24) * c} ${c}`}
        transform={`rotate(${(start / 24) * 360 - 90} 50 50)`}
      />
      {[0, 6, 12, 18].map((h) => (
        <text key={h} x={50 + 31 * Math.sin((h / 24) * 2 * Math.PI)} y={50 - 31 * Math.cos((h / 24) * 2 * Math.PI) + 2.5} textAnchor="middle" fontSize="7" fill="rgb(244 235 223 / 0.55)">
          {String(h).padStart(2, "0")}
        </text>
      ))}
      <text x="50" y="52" textAnchor="middle" fontSize="15" fontWeight="600" fill="currentColor">
        {len} jam
      </text>
      <text x="50" y="63" textAnchor="middle" fontSize="6.5" letterSpacing="0.8" fill="rgb(244 235 223 / 0.65)">
        SEHARI
      </text>
    </svg>
  );
}

/** Batang jam buka Senin–Minggu; hari ini (WIB) disorot setelah terpasang di browser. */
export function WeekBars({ hours }: { hours: DayHours[] }) {
  const [today, setToday] = useState<number | null>(null);
  useEffect(() => setToday(wibDay(new Date())), []);

  const days = [1, 2, 3, 4, 5, 6, 7].map((d) => hours.find((h) => h.dayOfWeek === d));
  const max = Math.max(1, ...days.map((d) => (d ? openLength(d) : 0)));
  return (
    <ul className="flex h-24 items-end gap-2" aria-label="Jam buka per hari">
      {days.map((d, i) => {
        const len = d ? openLength(d) : 0;
        const isToday = today === i + 1;
        const label = d?.isClosed ? `${DAY_SHORT[i]}: libur` : `${DAY_SHORT[i]}: ${len} jam`;
        return (
          <li key={DAY_SHORT[i]} className="flex flex-1 flex-col items-center gap-1.5" aria-label={label}>
            <span className={`relative flex h-16 w-full items-end overflow-hidden rounded-full ${len ? "bg-white/10" : "border border-dashed border-white/30"}`}>
              <span
                className={`block w-full rounded-full ${isToday ? "bg-[var(--gr-gold)]" : len ? "bg-[var(--gr-cream)]/70" : ""}`}
                style={{ height: `${(len / max) * 100}%` }}
              />
            </span>
            <span className={`text-[10px] font-semibold ${isToday ? "text-[var(--gr-gold)]" : "text-[var(--gr-cream)]/60"}`} aria-hidden>
              {DAY_SHORT[i]}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

const DAY_LONG = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

/** Tabel jam Senin–Minggu; baris hari ini (WIB) disorot setelah terpasang di browser. */
export function HoursTable({ hours }: { hours: DayHours[] }) {
  const [today, setToday] = useState<number | null>(null);
  useEffect(() => setToday(wibDay(new Date())), []);

  return (
    <table className="w-full text-[15px]">
      <caption className="sr-only">Jam buka per hari (WIB)</caption>
      <tbody>
        {[1, 2, 3, 4, 5, 6, 7].map((dow) => {
          const d = hours.find((h) => h.dayOfWeek === dow);
          const isToday = today === dow;
          return (
            <tr key={dow} className={`border-b border-[var(--gr-line)] last:border-0 ${isToday ? "text-[var(--gr-gold)]" : ""}`}>
              <th scope="row" className="py-3 text-left font-medium">
                {DAY_LONG[dow - 1]}
                {isToday && <span className="gr-caps ml-2 text-[10px]">Hari ini</span>}
              </th>
              <td className={`py-3 text-right tabular-nums ${d?.isClosed ? "text-[var(--gr-cream)]/55" : ""}`}>
                {!d ? "–" : d.isClosed ? "Libur" : `${d.opens!.replace(":", ".")} – ${d.closes!.replace(":", ".")}`}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
