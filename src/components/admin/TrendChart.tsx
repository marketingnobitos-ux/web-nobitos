"use client";

import { useState } from "react";
import type { DailyPoint } from "@/lib/analytics";

// Grafik batang per hari di kartu hitam: satu seri yang bisa dipilih (Pengunjung / Pageview / Klik) + tooltip + tabel.
const W = 720;
const H = 240;
const PAD = { top: 16, right: 8, bottom: 28, left: 36 };
const GAP = 4;
const BAR = "#5e7a50";
const BAR_HI = "#a6d27a";
const AXIS = "#a9aca3";
const GRID = "#2f2f2f";

const SERIES = [
  { key: "visitors", label: "Pengunjung" },
  { key: "pageviews", label: "Pageview" },
  { key: "clicks", label: "Klik" },
] as const;
type SeriesKey = (typeof SERIES)[number]["key"];

const dayFmt = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", timeZone: "UTC" });
const fullFmt = new Intl.DateTimeFormat("id-ID", { weekday: "short", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const label = (day: string, full = false) => (full ? fullFmt : dayFmt).format(new Date(`${day}T00:00:00Z`));

function niceMax(v: number): number {
  if (v <= 4) return 4;
  const pow = 10 ** Math.floor(Math.log10(v));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => v <= s * 4) ?? pow * 10;
  return step * 4;
}

/** Batang dengan ujung atas membulat, menempel di garis dasar. */
function barPath(x: number, y: number, w: number, h: number): string {
  const r = Math.min(6, w / 2, h);
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
}

export default function TrendChart({ data }: { data: DailyPoint[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [series, setSeries] = useState<SeriesKey>("visitors");
  const values = data.map((d) => d[series]);
  const max = niceMax(Math.max(0, ...values));
  const peak = values.indexOf(Math.max(...values));
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const slot = innerW / Math.max(data.length, 1);
  const gap = data.length > 60 ? 1 : GAP;
  const barW = Math.max(1, slot - gap);
  const y = (v: number) => PAD.top + innerH - (v / max) * innerH;
  const ticks = [0, 0.5, 1].map((f) => Math.round(max * f));
  const labelEvery = Math.ceil(data.length / 6);
  const point = active === null ? null : data[active];
  const seriesLabel = SERIES.find((s) => s.key === series)!.label;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-1.5 text-[13px]" role="group" aria-label="Pilih data grafik">
        {SERIES.map((s) => (
          <button
            key={s.key}
            type="button"
            aria-pressed={series === s.key}
            onClick={() => setSeries(s.key)}
            className={`rounded-full border px-3.5 py-1.5 ${series === s.key ? "border-[#a6d27a] bg-[#a6d27a] font-bold text-[#141414]" : "border-[#3a3a3a] text-[#c9ccc2] hover:text-white"}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="relative rounded-3xl bg-[#232323] px-3 pb-2 pt-4 sm:px-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${seriesLabel} per hari`}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke={GRID} strokeWidth={1} />
              <text x={PAD.left - 8} y={y(t)} textAnchor="end" dominantBaseline="middle" fontSize={12} fill={AXIS}>
                {t}
              </text>
            </g>
          ))}
          {data.map((d, i) => {
            const x = PAD.left + i * slot + gap / 2;
            const v = d[series];
            const h = (v / max) * innerH;
            return (
              <g key={d.day}>
                {h > 0 && (
                  <path d={barPath(x, y(v), barW, h)} fill={i === peak || active === i ? BAR_HI : BAR} opacity={active === null || active === i ? 1 : 0.55} />
                )}
                {i % labelEvery === 0 && (
                  <text x={x + barW / 2} y={H - 6} textAnchor="middle" fontSize={12} fill={AXIS}>
                    {label(d.day)}
                  </text>
                )}
                {/* area hover lebih besar dari batang */}
                <rect
                  x={PAD.left + i * slot}
                  y={PAD.top}
                  width={slot}
                  height={innerH}
                  fill="transparent"
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  onClick={() => setActive(i)}
                />
              </g>
            );
          })}
        </svg>
        {point && active !== null && (
          <div
            className="adm-light pointer-events-none absolute top-2 z-10 -translate-x-1/2 rounded-2xl bg-[#f4f3ea] px-3 py-2 text-xs shadow-lg"
            style={{ left: `${Math.min(85, Math.max(15, ((PAD.left + (active + 0.5) * slot) / W) * 100))}%` }}
          >
            <p className="font-bold">{label(point.day, true)}</p>
            <p>
              Pengunjung: <strong>{point.visitors}</strong>
            </p>
            <p className="text-gray-600">Pageview: {point.pageviews}</p>
            <p className="text-gray-600">Klik: {point.clicks}</p>
          </div>
        )}
      </div>

      <details className="text-sm">
        <summary className="cursor-pointer text-[#a9aca3]">Lihat sebagai tabel</summary>
        <div className="mt-2 max-h-72 overflow-auto rounded-2xl bg-[#232323] px-3">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-[#232323] text-[#a9aca3]">
              <tr>
                <th className="py-2 pr-4 font-semibold">Tanggal</th>
                <th className="py-2 pr-4 text-right font-semibold">Pengunjung</th>
                <th className="py-2 pr-4 text-right font-semibold">Pageview</th>
                <th className="py-2 text-right font-semibold">Klik</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.day} className="border-t border-[#3a3a3a]">
                  <td className="py-1.5 pr-4">{label(d.day, true)}</td>
                  <td className="py-1.5 pr-4 text-right tabular-nums">{d.visitors}</td>
                  <td className="py-1.5 pr-4 text-right tabular-nums">{d.pageviews}</td>
                  <td className="py-1.5 text-right tabular-nums">{d.clicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
