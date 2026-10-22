import DadakBranchCard, { type DadakBranch } from "@/components/templates/dadak/DadakBranchCard";
import { ClosingCta, InstagramIcon, Label, PageHero, TikTokIcon, WRAP } from "@/components/templates/dadak/shared";
import { AMINOTO, AMINOTO_IMAGES } from "@/data/brands/aminoto";
import { trackName } from "@/lib/track";

type Props = { brandName: string; branches: DadakBranch[]; instagramUrl: string | null; tiktokUrl: string | null };

/** Halaman Cabang: hero foto, satu baris besar per cabang, tautan sosial media, penutup. */
export default function DadakBranches({ brandName, branches, instagramUrl, tiktokUrl }: Props) {
  return (
    <>
      <PageHero image={AMINOTO_IMAGES.heroCabang} title={AMINOTO.branches.pageTitle} sub={AMINOTO.branches.pageSub} />

      <div className={`${WRAP} py-16 md:py-24`}>
        {branches.length ? (
          <div className="border-b border-current/20">
            {branches.map((b) => (
              <DadakBranchCard key={b.id} branch={b} brandName={brandName} headingLevel="h2" large />
            ))}
          </div>
        ) : (
          <p className="opacity-70">Info cabang belum tersedia.</p>
        )}

        {(instagramUrl || tiktokUrl) && (
          <div className="mt-14 grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:gap-10">
            <Label>Ikuti kami</Label>
            <div className="flex flex-wrap gap-2">
              {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" data-track={trackName("ig")} className="dk-btn dk-btn-line">
                  <InstagramIcon className="h-4 w-4" /> Instagram
                </a>
              )}
              {tiktokUrl && (
                <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" data-track={trackName("tiktok")} className="dk-btn dk-btn-line">
                  <TikTokIcon className="h-4 w-4" /> TikTok
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      <ClosingCta />
    </>
  );
}
