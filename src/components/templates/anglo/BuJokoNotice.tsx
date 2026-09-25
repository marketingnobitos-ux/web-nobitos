import { BAKMI_PAK_JOKO } from "@/data/brands/bakmi-pak-joko";

/**
 * Strip Dapur Bu Joko (brief 4.6 & 6.3): blok hijau, judul sebagai label stiker.
 * `boxed` = kotak bergaris untuk ditaruh di dalam halaman (Cabang); tanpa itu, isi strip full-width Beranda.
 */
export default function BuJokoNotice({ track, boxed = false }: { track: string; boxed?: boolean }) {
  const { title, body, cta, url } = BAKMI_PAK_JOKO.buJoko;
  return (
    <aside
      className={`flex flex-col gap-5 text-ink md:flex-row md:items-center md:justify-between md:gap-10 ${
        boxed ? "ag-noise border-2 border-ink bg-daun p-5 sm:p-6" : ""
      }`}
    >
      <div className="max-w-2xl">
        <p className="ag-sticker -rotate-1 text-[0.8rem] sm:text-sm">{title}</p>
        <p className="mt-4 leading-relaxed">{body}</p>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        data-track={track}
        className="ag-pill shrink-0 self-start bg-white text-ink hover:bg-ink hover:text-sheet md:self-center"
      >
        {cta}
      </a>
    </aside>
  );
}
