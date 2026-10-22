import ActionForm from "@/components/admin/ActionForm";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import GalleryUploader from "@/components/admin/GalleryUploader";
import { Card, Notice, TextField } from "@/components/admin/fields";
import { getBrandForAdmin } from "@/lib/admin";
import { imageVariant } from "@/lib/image";
import { prisma } from "@/lib/prisma";
import { TEMPLATE_FEATURES, TEMPLATE_LABEL } from "@/lib/template-features";
import { addPhotos, createAlbum, deleteAlbum, deletePhoto, updateAlbum, updatePhoto } from "./actions";

export const metadata = { title: "Galeri Foto" };

export default async function BrandGalleryAdmin({ params }: { params: Promise<{ id: string }> }) {
  const brand = await getBrandForAdmin((await params).id);
  const albums = await prisma.galleryAlbum.findMany({
    where: { brandId: brand.id },
    orderBy: { order: "asc" },
    include: { photos: { orderBy: { order: "asc" } } },
  });

  return (
    <div className="space-y-6">
      {!TEMPLATE_FEATURES[brand.template].gallery && (
        <Notice tone="warn" title="Galeri tidak tampil di situs brand ini">
          <p>Template {TEMPLATE_LABEL[brand.template]} tidak punya halaman Galeri. Foto yang diunggah di sini tersimpan, tapi belum dipakai di situs.</p>
        </Notice>
      )}
      <Card title="Buat album">
        <ActionForm action={createAlbum.bind(null, brand.id)} className="flex flex-wrap items-end gap-3" submitLabel="Buat album" resetOnSuccess>
          <div className="min-w-48 flex-1">
            <TextField label="Judul album" name="title" required placeholder="mis. Suasana Outlet" />
          </div>
          <div className="w-24">
            <TextField label="Urutan" name="order" type="number" min={0} defaultValue={albums.length} />
          </div>
        </ActionForm>
      </Card>

      {albums.map((album) => (
        <Card key={album.id}>
          <div className="flex flex-wrap items-end gap-3">
            <ActionForm action={updateAlbum.bind(null, brand.id, album.id)} className="flex flex-1 flex-wrap items-end gap-3">
              <div className="min-w-48 flex-1">
                <TextField label="Judul album" name="title" required defaultValue={album.title} />
              </div>
              <div className="w-24">
                <TextField label="Urutan" name="order" type="number" min={0} defaultValue={album.order} />
              </div>
            </ActionForm>
            <form action={deleteAlbum.bind(null, brand.id, album.id)}>
              <ConfirmSubmit message={`Hapus album "${album.title}" beserta ${album.photos.length} fotonya?`}>Hapus album</ConfirmSubmit>
            </form>
          </div>

          <div className="mt-4">
            <GalleryUploader brandId={brand.id} onUploaded={addPhotos.bind(null, brand.id, album.id)} />
          </div>

          {album.photos.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">Belum ada foto.</p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {album.photos.map((photo) => (
                <div key={photo.id} className="rounded-[20px] bg-white p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageVariant(photo.imageUrl, 400)}
                    alt={photo.caption ?? ""}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full rounded object-cover"
                  />
                  <ActionForm action={updatePhoto.bind(null, brand.id, photo.id)} className="mt-3 space-y-2">
                    <TextField label="Keterangan" name="caption" defaultValue={photo.caption} />
                    <TextField label="Urutan" name="order" type="number" min={0} defaultValue={photo.order} />
                  </ActionForm>
                  <form action={deletePhoto.bind(null, brand.id, photo.id)} className="mt-2">
                    <ConfirmSubmit message="Hapus foto ini?">Hapus foto</ConfirmSubmit>
                  </form>
                </div>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
