import GalleryGrid from "@/components/public/GalleryGrid";
import EditorialGallery from "@/components/templates/editorial/EditorialGallery";
import { requireActiveBrand } from "@/lib/active-brand";
import { getSections } from "@/lib/content";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Galeri" };

// Album foto per brand, klik foto untuk lightbox.
export default async function GaleriPage() {
  const brand = await requireActiveBrand();

  const albums = await prisma.galleryAlbum.findMany({
    where: { brandId: brand.id },
    orderBy: { order: "asc" },
    select: {
      id: true,
      title: true,
      photos: { orderBy: { order: "asc" }, select: { id: true, imageUrl: true, caption: true } },
    },
  });
  const filled = albums.filter((a) => a.photos.length > 0);

  if (brand.template === "EDITORIAL") {
    const feature = (await getSections(brand.id, "gallery")).find((s) => s.key === "feature")?.data;
    return (
      <EditorialGallery
        brandName={brand.name}
        photos={filled.flatMap((a) => a.photos)}
        feature={feature && { title: feature.title, imageUrl: feature.imageUrl, videoUrl: feature.videoUrl }}
      />
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <h1 className="text-3xl font-bold sm:text-4xl">Galeri {brand.name}</h1>

      {filled.length ? (
        <div className="mt-8 space-y-12">
          {filled.map((album) => (
            <section key={album.id}>
              <h2 className="mb-4 text-xl font-bold">
                {album.title} <span className="text-sm font-normal text-gray-500">· {album.photos.length} foto</span>
              </h2>
              <GalleryGrid photos={album.photos} />
            </section>
          ))}
        </div>
      ) : (
        <p className="mt-6 text-gray-500">Foto belum tersedia.</p>
      )}
    </section>
  );
}
