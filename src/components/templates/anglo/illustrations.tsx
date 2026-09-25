// Ilustrasi garis sederhana pengganti foto (brief 6.5), sampai foto asli dari tim konten masuk.
// Semua memakai currentColor, jadi warnanya mengikuti teks induk. Badan utama diisi putih (BODY)
// supaya siluetnya penuh saat dipakai sebagai stiker potongan.
import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & {
  title?: string;
  /** Efek stiker potongan: garis tepi putih tebal mengikuti bentuk + bayangan tipis. */
  sticker?: boolean;
};

const BODY = { fill: "#fff" };
const STICKER_FILTER = "ag-sticker-outline";

function Svg({ title, sticker, children, viewBox = "0 0 120 120", ...rest }: Props & { children: React.ReactNode }) {
  return (
    <svg
      viewBox={viewBox}
      width="100%"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      overflow="visible"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      {...rest}
    >
      {title && <title>{title}</title>}
      {sticker ? <g filter={`url(#${STICKER_FILTER})`}>{children}</g> : children}
    </svg>
  );
}

/** Pasang sekali per halaman (layout Anglo): filter SVG untuk efek stiker potongan. */
export function StickerDefs() {
  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      <defs>
        <filter id={STICKER_FILTER} x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          {/* Silhouet ditebalkan jadi tepi putih, lalu bayangan tipis di bawahnya. */}
          <feMorphology in="SourceAlpha" operator="dilate" radius="7" result="fat" />
          <feFlood floodColor="#ffffff" />
          <feComposite in2="fat" operator="in" result="outline" />
          <feGaussianBlur in="fat" stdDeviation="3" />
          <feOffset dx="2" dy="5" result="blur" />
          <feFlood floodColor="#161412" floodOpacity="0.28" />
          <feComposite in2="blur" operator="in" result="shadow" />
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="outline" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

/** Tungku anglo tanah liat: bibir, badan meruncing, lubang angin berjeruji, arang & bara. */
export function AngloStove(props: Props) {
  return (
    <Svg {...props}>
      <path d="M24 50 33 100h54l9-50z" {...BODY} />
      <path d="M22 48c0-6 76-6 76 0s-76 6-76 0z" {...BODY} />
      <path d="M27 66h66" strokeWidth={2.5} />
      <path d="M31 88h58" strokeWidth={2.5} />
      <rect x="49" y="72" width="22" height="16" rx="2" strokeWidth={2.5} />
      <path d="M56 72v16M64 72v16" strokeWidth={2} />
      <path d="M30 100h60" />
      <path d="M34 45c2-6 9-7 12-3 2-5 10-6 13-1 3-5 10-5 13 0 3-4 9-3 11 2" strokeWidth={2.5} />
      <path d="M52 34c-2-4 2-7 0-11M62 32c-3-5 3-9 0-14M72 34c-2-4 2-7 0-11" strokeWidth={2.5} />
    </Svg>
  );
}

/** Wajan di atas api dengan bakmi. */
export function WokFlame(props: Props) {
  return (
    <Svg {...props}>
      <path d="M18 54c4 20 22 32 44 32s38-12 42-32z" {...BODY} />
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

/** Mangkok bakmi nyemek: mie diangkat sumpit, kuah, kaki mangkok, uap. */
export function NoodleBowl(props: Props) {
  return (
    <Svg {...props}>
      <path d="M12 62c3 24 22 38 48 38s45-14 48-38z" {...BODY} />
      <path d="M44 99l-2 9h36l-2-9" {...BODY} />
      <path d="M12 62c0-5 96-5 96 0" />
      <path d="M22 80c14 5 62 5 76 0" strokeWidth={2} />
      <path d="M22 60c6-3 10 1 16-1s10 1 16-1 10 1 16-1 10 1 16-1 8 1 12 0" strokeWidth={2} />
      <path d="M100 12 70 56M110 18 76 58" />
      <path d="M72 55c-4-7 4-11 0-18s4-11 1-16M79 57c-4-7 4-11 0-18s3-10 1-14" strokeWidth={2.5} />
      <path d="M32 50c-4-5 3-9 0-15M44 46c-4-6 3-10 0-17" strokeWidth={2.5} />
    </Svg>
  );
}

/** Gelas es teh dengan es batu & sedotan. */
export function IcedTea(props: Props) {
  return (
    <Svg {...props}>
      <path d="M34 28h52l-7 80H41z" {...BODY} />
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
