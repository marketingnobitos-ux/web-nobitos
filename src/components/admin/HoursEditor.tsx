"use client";

import { useState } from "react";
import { DAY_LABEL, isCompleteWeek, type DayHours } from "@/lib/hours";

type Row = { closed: boolean; opens: string; closes: string };

const toRows = (hours: DayHours[]): Row[] =>
  DAY_LABEL.map((_, i) => {
    const h = hours.find((x) => x.dayOfWeek === i + 1);
    return { closed: !!h?.isClosed, opens: h?.opens ?? "", closes: h?.closes ?? "" };
  });

const timeInput =
  "w-full min-w-0 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm tabular-nums focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100 disabled:text-gray-400";

/** Editor jam buka Senin–Minggu (menulis ke tabel BranchHours). Field: hours.<1-7>.opens|closes|closed. */
export default function HoursEditor({ defaultValue = [] }: { defaultValue?: DayHours[] }) {
  const [rows, setRows] = useState<Row[]>(() => toRows(defaultValue));

  const set = (i: number, patch: Partial<Row>) => setRows((r) => r.map((row, j) => (j === i ? { ...row, ...patch } : row)));
  const copyFirst = () => setRows((r) => r.map((row, j) => (j === 0 || row.closed ? row : { ...row, opens: r[0].opens, closes: r[0].closes })));
  const clearAll = () => setRows(toRows([]));

  const asHours = rows.flatMap((r, i): DayHours[] =>
    r.closed
      ? [{ dayOfWeek: i + 1, isClosed: true, opens: null, closes: null }]
      : r.opens || r.closes
        ? [{ dayOfWeek: i + 1, isClosed: false, opens: r.opens || null, closes: r.closes || null }]
        : [],
  );
  const complete = isCompleteWeek(asHours);
  const empty = asHours.length === 0;

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-gray-700">Jam buka 7 hari (WIB)</span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${complete ? "bg-green-100 text-green-800" : empty ? "bg-gray-100 text-gray-600" : "bg-amber-100 text-amber-800"}`}
        >
          {complete ? "Lengkap" : empty ? "Belum diisi" : "Belum lengkap"}
        </span>
      </div>
      <div className="overflow-hidden rounded-md border border-gray-200">
        <div className="hidden grid-cols-[6rem_1fr_1fr_4.5rem] gap-3 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-500 sm:grid">
          <span>Hari</span>
          <span>Buka</span>
          <span>Tutup</span>
          <span className="text-center">Libur</span>
        </div>
        {rows.map((row, i) => {
          const day = i + 1;
          return (
            <div key={day} className="grid grid-cols-[4.5rem_1fr_1fr_3.5rem] items-center gap-2 border-t border-gray-100 px-3 py-2 first:border-0 sm:grid-cols-[6rem_1fr_1fr_4.5rem] sm:gap-3">
              <span className="text-sm font-medium text-gray-800">{DAY_LABEL[i]}</span>
              <input
                type="time"
                name={`hours.${day}.opens`}
                value={row.closed ? "" : row.opens}
                disabled={row.closed}
                onChange={(e) => set(i, { opens: e.target.value })}
                aria-label={`Jam buka ${DAY_LABEL[i]}`}
                className={timeInput}
              />
              <input
                type="time"
                name={`hours.${day}.closes`}
                value={row.closed ? "" : row.closes}
                disabled={row.closed}
                onChange={(e) => set(i, { closes: e.target.value })}
                aria-label={`Jam tutup ${DAY_LABEL[i]}`}
                className={timeInput}
              />
              <label className="flex justify-center">
                <input
                  type="checkbox"
                  name={`hours.${day}.closed`}
                  checked={row.closed}
                  onChange={(e) => set(i, { closed: e.target.checked })}
                  aria-label={`${DAY_LABEL[i]} libur`}
                  className="h-4 w-4 rounded border-gray-300"
                />
              </label>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <button type="button" onClick={copyFirst} disabled={!rows[0].opens || !rows[0].closes} className="text-gray-700 underline-offset-2 hover:underline disabled:text-gray-400 disabled:no-underline">
          Salin jam Senin ke hari lain
        </button>
        <button type="button" onClick={clearAll} className="text-gray-500 underline-offset-2 hover:underline">
          Kosongkan
        </button>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        Badge &quot;Buka sekarang&quot; dan data Google (JSON-LD) hanya muncul kalau ketujuh hari terisi. Jam tutup lebih kecil dari jam buka = lewat tengah malam.
      </p>
    </div>
  );
}
