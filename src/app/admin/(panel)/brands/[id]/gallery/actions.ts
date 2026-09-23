"use server";

import { revalidatePath } from "next/cache";
import { requireBrandAdmin } from "@/lib/admin";
import { actionError } from "@/lib/admin-action";
import { deleteImage } from "@/lib/media";
import { prisma } from "@/lib/prisma";
import { albumSchema, imageUrl, parseForm, photoSchema, type ActionState } from "@/lib/validation";

const galleryPath = (brandId: string) => `/admin/brands/${brandId}/gallery`;

async function findAlbum(brandId: string, albumId: string) {
  return prisma.galleryAlbum.findFirst({ where: { id: albumId, brandId }, select: { id: true } });
}

export async function createAlbum(brandId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireBrandAdmin(brandId);
    const parsed = parseForm(albumSchema, formData);
    if (!parsed.success) return { error: parsed.error };
    await prisma.galleryAlbum.create({ data: { ...parsed.data, brandId } });
    revalidatePath(galleryPath(brandId));
    return { ok: true, message: "Album dibuat." };
  } catch (e) {
    return actionError(e);
  }
}

export async function updateAlbum(brandId: string, albumId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireBrandAdmin(brandId);
    const parsed = parseForm(albumSchema, formData);
    if (!parsed.success) return { error: parsed.error };
    await prisma.galleryAlbum.update({ where: { id: albumId, brandId }, data: parsed.data });
    revalidatePath(galleryPath(brandId));
    return { ok: true };
  } catch (e) {
    return actionError(e);
  }
}

export async function deleteAlbum(brandId: string, albumId: string): Promise<void> {
  await requireBrandAdmin(brandId);
  const photos = await prisma.galleryPhoto.findMany({ where: { albumId, album: { brandId } }, select: { imageUrl: true } });
  await prisma.galleryAlbum.delete({ where: { id: albumId, brandId } });
  await Promise.all(photos.map((p) => deleteImage(p.imageUrl)));
  revalidatePath(galleryPath(brandId));
}

/** Dipanggil dari uploader setelah file berhasil diunggah ke /api/upload. */
export async function addPhotos(brandId: string, albumId: string, urls: string[]): Promise<ActionState> {
  try {
    await requireBrandAdmin(brandId);
    if (!(await findAlbum(brandId, albumId))) return { error: "Album tidak ditemukan." };
    const valid = urls.filter((u) => imageUrl.safeParse(u).success && u.startsWith("/uploads/")).slice(0, 100);
    const last = await prisma.galleryPhoto.aggregate({ where: { albumId }, _max: { order: true } });
    const start = (last._max.order ?? -1) + 1;
    await prisma.galleryPhoto.createMany({
      data: valid.map((url, i) => ({ albumId, imageUrl: url, order: start + i })),
    });
    revalidatePath(galleryPath(brandId));
    return { ok: true, message: `${valid.length} foto ditambahkan.` };
  } catch (e) {
    return actionError(e);
  }
}

export async function updatePhoto(brandId: string, photoId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireBrandAdmin(brandId);
    const parsed = parseForm(photoSchema, formData);
    if (!parsed.success) return { error: parsed.error };
    await prisma.galleryPhoto.update({ where: { id: photoId, album: { brandId } }, data: parsed.data });
    revalidatePath(galleryPath(brandId));
    return { ok: true };
  } catch (e) {
    return actionError(e);
  }
}

export async function deletePhoto(brandId: string, photoId: string): Promise<void> {
  await requireBrandAdmin(brandId);
  const photo = await prisma.galleryPhoto.delete({ where: { id: photoId, album: { brandId } } });
  await deleteImage(photo.imageUrl);
  revalidatePath(galleryPath(brandId));
}
