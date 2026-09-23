"use client";

import { useState } from "react";
import type { DailyPoint } from "@/lib/analytics";

// Grafik batang pengunjung unik per hari (1 seri, 1 sumbu) + tooltip hover + tabel.
const W = 720;
const H = 240;
const PAD = { top: 16, right: 12, bottom: 28, left: 40 };
const SERIES = "#2a78d6";
const GAP = 2;

const dayFmt = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", timeZone: "UTC" });
const fullFmt = new Intl.DateTimeFormat("id-ID", { weekday: "short", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const label = (day: string, full = false) => (full ? fullFmt : dayFmt).format(new Date(`${day}T00:00:00Z`));

function niceMax(v: number): number {
  if (v <= 4) return 4;
  const pow = 10 ** Math.floor(Math.log10(v));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => v <= s * 4) ?? pow * 10;
  return step * 4;
}

/** Batang dengan ujung atas membulat 4px, menempel di garis dasar. */
function barPath(x: number, y: number, w: number, h: number): string {
  const r = Math.min(4, w / 2, h);
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
}

export default function TrendChart({ data }: { data: DailyPoint[] }) {
  const [active, setActive] = useState<number | null>(null);
  const max = niceMax(Math.max(0, ...data.map((d) => d.visitors)));
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const slot = innerW / Math.max(data.length, 1);
  const barW = Math.max(1, slot - GAP);
  const y = (v: number) => PAD.top + innerH - (v / max) * innerH;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f));
  const labelEvery = Math.ceil(data.length / 8);
  const point = active === null ? null : data[active];

  return (
    <div>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Pengunjung unik per hari">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="#e5e7eb" strokeWidth={1} />
              <text x={PAD.left - 6} y={y(t)} textAnchor="end" dominantBaseline="middle" fontSize={11} fill="#6b7280">
                {t}
              </text>
            </g>
          ))}
          {data.map((d, i) => {
            const x = PAD.left + i * slot + GAP / 2;
            const h = (d.visitors / max) * innerH;
            return (
              <g key={d.day}>
                {h > 0 && <path d={barPath(x, y(d.visitors), barW, h)} fill={SERIES} opacity={active === null || active === i ? 1 : 0.45} />}
                {i % labelEvery === 0 && (
                  <text x={x + barW / 2} y={H - 8} textAnchor="middle" fontSize={11} fill="#6b7280">
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
            className="pointer-events-none absolute top-2 z-10 -translate-x-1/2 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs shadow-md"
            style={{ left: `${((PAD.left + (active + 0.5) * slot) / W) * 100}%` }}
          >
            <p className="font-medium text-gray-900">{label(point.day, true)}</p>
            <p className="text-gray-700">
              <span className="mr-1 inline-block h-2 w-2 rounded-sm" style={{ background: SERIES }} />
              Pengunjung: <strong>{point.visitors}</strong>
            </p>
            <p className="text-gray-600">Pageview: {point.pageviews}</p>
            <p className="text-gray-600">Klik: {point.clicks}</p>
          </div>
        )}
      </div>

      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-gray-600">Lihat sebagai tabel</summary>
        <div className="mt-2 max-h-72 overflow-auto">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-white text-gray-500">
              <tr>
                <th className="py-1 pr-4">Tanggal</th>
                <th className="py-1 pr-4 text-right">Pengunjung</th>
                <th className="py-1 pr-4 text-right">Pageview</th>
                <th className="py-1 text-right">Klik</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.day} className="border-t border-gray-100">
                  <td className="py-1 pr-4">{label(d.day, true)}</td>
                  <td className="py-1 pr-4 text-right tabular-nums">{d.visitors}</td>
                  <td className="py-1 pr-4 text-right tabular-nums">{d.pageviews}</td>
                  <td className="py-1 text-right tabular-nums">{d.clicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
