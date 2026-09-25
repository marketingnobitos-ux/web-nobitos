// Ilustrasi garis sederhana pengganti foto (brief 6.5), sampai foto asli dari tim konten masuk.
// Semua memakai currentColor, jadi warnanya mengikuti teks induk.
import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & { title?: string };

function Svg({ title, children, viewBox = "0 0 120 120", ...rest }: Props & { children: React.ReactNode }) {
  return (
    <svg
      viewBox={viewBox}
      width="100%"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      {...rest}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}

/** Tungku anglo tanah liat dengan arang membara. */
export function AngloStove(props: Props) {
  return (
    <Svg {...props}>
      <path d="M22 50c1-4 75-5 76 0" />
      <path d="M22 50c2 4 74 5 76 0" />
      <path d="M24 53c3 18 9 35 18 47 11 3 25 3 36 0 9-12 15-29 18-47" />
      <path d="M48 100c0-8 5-14 12-14s12 6 12 14" />
      <path d="M36 101c-3 4-4 8-4 11M84 101c3 4 4 8 4 11" />
      <path d="M31 47c3-5 8-6 11-3 3-5 9-6 12-2 3-4 9-4 12 0 3-4 9-3 11 1 3-3 8-2 10 2" />
      <path d="M50 38c-4-6 2-10 0-16M62 36c-4-7 3-12 0-20M74 38c-3-5 2-9 0-14" strokeWidth={2.5} />
      <path d="M40 66c4 2 8 2 12 0M66 66c4 2 8 2 12 0" strokeWidth={2.5} />
    </Svg>
  );
}

/** Wajan di atas api dengan bakmi. */
export function WokFlame(props: Props) {
  return (
    <Svg {...props}>
      <path d="M18 54c4 20 22 32 44 32s38-12 42-32" />
      <path d="M16 54c30-3 60-3 90 0" />
      <path d="M104 52c6-2 10-5 12-8" />
      <path d="M16 54c-4 0-8-3-9-6" />
      <path d="M30 50c5-8 9 4 14-4s9 4 14-4 9 4 14-4 9 4 14-4 8 3 11-1" strokeWidth={2.5} />
      <path d="M40 38c4 3 8-2 12 1M62 36c4 3 8-2 12 1" strokeWidth={2.5} />
      <path d="M42 98c-2-6 4-8 2-14 6 3 8 8 6 14M58 102c-3-8 5-11 2-19 8 4 10 11 7 19M76 98c-2-6 4-8 2-14 6 3 8 8 6 14" />
      <path d="M34 108h54" />
    </Svg>
  );
}

/** Mangkok bakmi nyemek dengan sumpit & uap. */
export function NoodleBowl(props: Props) {
  return (
    <Svg {...props}>
      <path d="M14 58h92" />
      <path d="M16 58c2 24 20 40 44 40s42-16 44-40" />
      <path d="M44 98c0 5 7 8 16 8s16-3 16-8" />
      <path d="M26 56c4-7 8 3 12-4s8 3 12-4 8 3 12-4 8 3 12-4 8 3 12-4 7 3 8 0" strokeWidth={2.5} />
      <circle cx="74" cy="47" r="6" strokeWidth={2.5} />
      <circle cx="74" cy="47" r="2" fill="currentColor" stroke="none" />
      <path d="M82 20 62 52M92 24 70 54" />
      <path d="M36 40c-4-5 3-8 0-14M48 36c-4-6 3-10 0-17" strokeWidth={2.5} />
    </Svg>
  );
}

/** Gelas es teh dengan es batu & sedotan. */
export function IcedTea(props: Props) {
  return (
    <Svg {...props}>
      <path d="M34 28h52l-7 80H41z" />
      <path d="M36 46h48" strokeWidth={2.5} />
      <rect x="44" y="54" width="12" height="12" rx="2" strokeWidth={2.5} transform="rotate(-10 50 60)" />
      <rect x="62" y="64" width="12" height="12" rx="2" strokeWidth={2.5} transform="rotate(12 68 70)" />
      <path d="M66 42 78 8h10" />
    </Svg>
  );
}

/** Tampak depan warung: tenda, papan nama, meja, bangku, anglo. */
export function WarungFront(props: Props) {
  return (
    <Svg viewBox="0 0 480 250" strokeWidth={2.5} {...props}>
      {/* atap & tenda bergelombang */}
      <path d="M40 58 60 28h360l20 30" />
      <path d="M40 58c10 14 30 14 40 0 10 14 30 14 40 0 10 14 30 14 40 0 10 14 30 14 40 0 10 14 30 14 40 0 10 14 30 14 40 0 10 14 30 14 40 0 10 14 30 14 40 0" />
      <path d="M100 30l-10 28M160 30l-6 28M220 30l-2 28M260 30l2 28M320 30l6 28M380 30l10 28" strokeWidth={2} />
      {/* tiang */}
      <path d="M54 70v168M426 70v168" />
      {/* papan nama */}
      <rect x="240" y="80" width="130" height="36" rx="3" />
      <text x="305" y="104" textAnchor="middle" fontSize="15" fontFamily="var(--font-space-mono), monospace" fontWeight="700" fill="currentColor" stroke="none" letterSpacing="1.5">
        BAKMI JOWO
      </text>
      <path d="M265 80v-10M345 80v-10" strokeWidth={2} />
      {/* lampu gantung */}
      <path d="M110 72v18M100 100c0-8 20-8 20 0z" />
      <path d="M400 72v18M390 100c0-8 20-8 20 0z" />
      {/* rak & gerobak */}
      <path d="M70 150h150v88M70 150v88M70 172h150" />
      <path d="M86 150v-18h20v18M124 150v-26h14v26M150 150v-14h28v14" strokeWidth={2} />
      {/* anglo & wajan di atas gerobak */}
      <path d="M176 150c2-12 6-18 12-20h20c6 2 10 8 12 20" />
      <path d="M172 128c10 8 42 8 52 0M168 128h60" />
      <path d="M190 118c-3-5 2-8 0-13M204 116c-3-6 3-10 0-16" strokeWidth={2} />
      {/* meja & bangku */}
      <path d="M262 184h140M272 184v54M392 184v54" />
      <path d="M252 212h40M258 212v26M286 212v26M372 212h40M378 212v26M406 212v26" />
      <path d="M300 184c0-10 8-16 18-16s18 6 18 16" strokeWidth={2} />
      <path d="M350 184v-18h10v18" strokeWidth={2} />
      {/* tanah */}
      <path d="M20 238h440" />
    </Svg>
  );
}

/** Ilustrasi untuk item menu, dipilih dari namanya. */
export function MenuIllustration({ name, ...props }: Props & { name: string }) {
  const n = name.toLowerCase();
  if (n.includes("nyemek") || n.includes("godog") || n.includes("rebus")) return <NoodleBowl {...props} />;
  if (n.includes("es ") || n.includes("teh") || n.includes("jeruk")) return <IcedTea {...props} />;
  return <WokFlame {...props} />;
}
