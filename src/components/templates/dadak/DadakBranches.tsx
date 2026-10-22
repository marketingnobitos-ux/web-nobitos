import DadakBranchCard, { type DadakBranch } from "@/components/templates/dadak/DadakBranchCard";
import { Eyebrow, InstagramIcon, Photo, TikTokIcon, WRAP } from "@/components/templates/dadak/shared";
import { AMINOTO, AMINOTO_IMAGES } from "@/data/brands/aminoto";
import { trackName } from "@/lib/track";

type Props = { brandName: string; branches: DadakBranch[]; instagramUrl: string | null; tiktokUrl: string | null };

/** Halaman Cabang: judul kaca + foto suasana, kartu tiap cabang, tautan sosial media. */
export default function DadakBranches({ brandName, branches, instagramUrl, tiktokUrl }: Props) {
  return (
    <div className={`${WRAP} pb-10 pt-6 text-ink md:pt-8`}>
      <section aria-labelledby="cabang-title" className="dk-glass grid items-center gap-8 overflow-hidden px-5 py-10 sm:px-10 md:grid-cols-[1.2fr_1fr] md:py-12 lg:px-14">
        <div>
          <Eyebrow>{AMINOTO.kicker}</Eyebrow>
          <h1 id="cabang-title" className="dk-title mt-3 text-[clamp(38px,5.5vw,68px)]">
            {AMINOTO.branches.pageTitle}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-ink/80">{AMINOTO.branches.pageLead}</p>
          {(instagramUrl || tiktokUrl) && (
            <div className="mt-7 flex flex-wrap gap-2">
              {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" data-track={trackName("ig")} className="dk-chip">
                  <InstagramIcon className="h-4 w-4" /> Instagram
                </a>
              )}
              {tiktokUrl && (
                <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" data-track={trackName("tiktok")} className="dk-chip">
                  <TikTokIcon className="h-4 w-4" /> TikTok
                </a>
              )}
            </div>
          )}
        </div>
        <Photo image={AMINOTO_IMAGES.suasana} priority className="aspect-[4/3] w-full rounded-3xl" />
      </section>

      {branches.length ? (
        <ul className="mt-6 grid gap-5 md:grid-cols-3">
          {branches.map((b) => (
            <li key={b.id}>
              <DadakBranchCard branch={b} brandName={brandName} headingLevel="h2" />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-ink/70">Info cabang belum tersedia.</p>
      )}
    </div>
  );
}
