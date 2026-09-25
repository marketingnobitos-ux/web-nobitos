// Bagian kecil yang dipakai bersama oleh halaman template Anglo.
import { NAV_ITEMS } from "@/components/public/nav";
import { BAKMI_PAK_JOKO, type AngloBranch } from "@/data/brands/bakmi-pak-joko";
import { whatsappUrl } from "@/lib/format";

/** Navigasi Anglo (brief 6.3): MENU · CERITA · CABANG. Beranda lewat nama brand. */
export const ANGLO_NAV = NAV_ITEMS.filter((item) => ["/menu", "/cerita", "/cabang"].includes(item.href));

/** Lebar konten & gutter (16px di HP). */
export const WRAP = "mx-auto w-full max-w-[1320px] px-4 sm:px-6 md:px-10";

const harga = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });

/** 21000 -> "21.000" (gaya kertas menu cetak, tanpa "Rp"). */
export function formatHarga(value: number): string {
  return harga.format(value);
}

/** "Aroma *smoky*-nya" -> "Aroma <em>smoky</em>-nya". */
export function Emph({ text }: { text: string }) {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith("*") && part.endsWith("*") ? <em key={i}>{part.slice(1, -1)}</em> : part,
  );
}

/** Petunjuk carousel, hanya di HP (mulai md kartu tampil berjajar). */
export function SwipeHint({ className = "" }: { className?: string }) {
  return (
    <p aria-hidden className={`text-center font-mono text-xs font-bold uppercase tracking-wider md:hidden ${className}`}>
      {BAKMI_PAK_JOKO.ui.swipeHint}
    </p>
  );
}

/** Kartu lokasi cabang: alamat, jam, "Petunjuk arah" (Google Maps) & WhatsApp. */
export function LocationCard({ branch, track, className = "" }: { branch: AngloBranch; track: string; className?: string }) {
  const { ui } = BAKMI_PAK_JOKO;
  return (
    <div className={`ag-paper ag-tape relative flex flex-col p-6 pt-8 text-ink ${className}`}>
      <h3 className="ag-marker text-[2.6rem]">{branch.name}</h3>
      <p className="mt-3 leading-relaxed">{branch.address}</p>
      {branch.hours && <p className="mt-3 font-mono text-sm font-bold uppercase">{branch.hours}</p>}
      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={branch.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-track={`${track}-maps-${branch.slug}`}
          className="ag-pill bg-accent text-ink"
        >
          {ui.directions}
        </a>
        <a
          href={whatsappUrl(branch.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          data-track={`${track}-wa-${branch.slug}`}
          className="ag-pill bg-white text-ink hover:bg-ink hover:text-sheet"
        >
          {ui.whatsapp} {branch.whatsapp}
        </a>
      </div>
    </div>
  );
}
