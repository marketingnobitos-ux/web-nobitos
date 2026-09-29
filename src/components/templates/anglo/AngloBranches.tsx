import BuJokoNotice from "@/components/templates/anglo/BuJokoNotice";
import StickObserver from "@/components/templates/anglo/StickObserver";
import { LocationCard, WRAP } from "@/components/templates/anglo/shared";
import { BAKMI_PAK_JOKO } from "@/data/brands/bakmi-pak-joko";
import { trackName } from "@/lib/track";

/** Cabang Anglo (brief 4.5): kartu lokasi per cabang. Strip Dapur Bu Joko di bawah kartu Kartini. */
export default function AngloBranches({ brandName }: { brandName: string }) {
  return (
    <div className="ag-noise bg-paper text-ink">
      <section className={`${WRAP} pb-20 pt-14 md:pb-28 md:pt-24`}>
        <h1 className="ag-marker text-[clamp(72px,12vw,150px)]">Cabang</h1>

        <ul className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-2 lg:items-start">
          {BAKMI_PAK_JOKO.branches.map((b, i) => (
            <li key={b.slug} className="space-y-8">
              <LocationCard branch={b} brandName={brandName} className={i % 2 ? "md:rotate-1" : "md:-rotate-1"} />
              {b.showBuJoko && <BuJokoNotice boxed track={trackName("ig_bujoko", b.slug)} />}
            </li>
          ))}
        </ul>
      </section>
      <StickObserver />
    </div>
  );
}
