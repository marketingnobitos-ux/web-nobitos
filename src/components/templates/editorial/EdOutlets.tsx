import Reveal from "@/components/animations/Reveal";
import EdLink from "@/components/templates/editorial/EdLink";

export type Outlet = { id: string; name: string; address: string; hours: string | null; mapsUrl: string };

/**
 * Outlet: satu nama brand raksasa selebar layar, lalu semua outlet dalam grid kolom teks
 * (tanpa geser). Satu layar, tanpa foto.
 */
export default function EdOutlets({ brandName, outlets }: { brandName: string; outlets: Outlet[] }) {
  const [first, ...rest] = brandName.split(" ");

  return (
    <section aria-labelledby="ed-outlets" className="overflow-hidden bg-ink-deep px-5 py-24 text-paper sm:px-8 md:px-12 md:py-28">
      <div className="mx-auto max-w-[1440px]">
        <Reveal>
          <h2 id="ed-outlets" className="ed-title text-[clamp(24px,2.4vw,36px)] text-paper/70">
            Mampir ke <em>outlet</em> kami
          </h2>
        </Reveal>

        <Reveal y={40} delay={0.08}>
          <p aria-hidden className="ed-title mt-6 whitespace-nowrap text-[min(12.4vw,180px)] leading-[0.9] md:mt-8">
            {first}
            {rest.length > 0 && <em> {rest.join(" ")}</em>}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-x-10 gap-y-10 border-t border-paper/15 pt-10 sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
          {outlets.map((o, i) => (
            <Reveal as="article" key={o.id} delay={0.12 + (i % 3) * 0.08}>
              <p className="text-sm tabular-nums text-paper/40">{String(i + 1).padStart(2, "0")}</p>
              <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="ed-title text-[clamp(24px,2.2vw,32px)]">{o.name}</h3>
                {o.hours && <p className="tabular-nums text-paper/70">{o.hours}</p>}
              </div>
              <p className="mt-2 max-w-sm text-paper/65">{o.address}</p>
              <EdLink href={o.mapsUrl} external track={`ed-maps-${o.id}`} className="mt-5">
                Buka di Maps
              </EdLink>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
