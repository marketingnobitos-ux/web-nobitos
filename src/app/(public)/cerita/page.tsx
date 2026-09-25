import Link from "next/link";
import AngloStory from "@/components/templates/anglo/AngloStory";
import EditorialStory from "@/components/templates/editorial/EditorialStory";
import { requireActiveBrand } from "@/lib/active-brand";
import { getSections, type Section } from "@/lib/content";

export const metadata = { title: "Cerita" };

// Cerita brand: profil, sejarah, nilai, suasana outlet (dari PageContent pageKey "story").
export default async function CeritaPage() {
  const brand = await requireActiveBrand();
  if (brand.template === "ANGLO") return <AngloStory />;
  const sections = await getSections(brand.id, "story");

  if (brand.template === "EDITORIAL") {
    return <EditorialStory brandName={brand.name} tagline={brand.tagline} sections={sections} />;
  }

  return (
    <>
      <section className="bg-primary text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <p className="text-sm font-medium uppercase tracking-widest text-white/80">Cerita Kami</p>
          <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">{brand.name}</h1>
          {brand.tagline && <p className="mt-4 max-w-2xl text-lg text-white/90">{brand.tagline}</p>}
        </div>
      </section>

      {sections.length ? (
        <div className="mx-auto max-w-6xl divide-y divide-gray-200 px-4">
          {sections.map((section, i) => (
            <StorySection key={section.key} section={section} reverse={i % 2 === 1} />
          ))}
        </div>
      ) : (
        <p className="mx-auto max-w-6xl px-4 py-14 text-gray-500">Cerita belum tersedia.</p>
      )}

      <div className="mx-auto max-w-6xl px-4 pt-6">
        <Link href="/cabang" className="inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:opacity-90">
          Kunjungi Cabang Kami
        </Link>
      </div>
    </>
  );
}

function StorySection({ section, reverse }: { section: Section; reverse: boolean }) {
  const { title, subtitle, body, imageUrl, items } = section.data;

  return (
    <section className={`grid items-center gap-8 py-12 sm:py-16 ${imageUrl ? "md:grid-cols-2" : ""}`}>
      <div className={reverse && imageUrl ? "md:order-2" : ""}>
        {title && <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>}
        {subtitle && <p className="mt-2 text-lg text-primary">{subtitle}</p>}
        {body && <p className="mt-4 whitespace-pre-line leading-relaxed text-gray-700">{body}</p>}
        {items && items.length > 0 && (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-lg bg-primary/5 p-4">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span className="text-gray-800">{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={title ?? ""} loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover" />
      )}
    </section>
  );
}
