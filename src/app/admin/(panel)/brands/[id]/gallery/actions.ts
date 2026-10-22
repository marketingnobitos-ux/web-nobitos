"use server";

import { revalidatePath } from "next/cache";
import { logActivity, requireBrandAdmin } from "@/lib/admin";
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
    const admin = await requireBrandAdmin(brandId);
    const parsed = parseForm(albumSchema, formData);
    if (!parsed.success) return { error: parsed.error };
    await prisma.galleryAlbum.create({ data: { ...parsed.data, brandId } });
    await logActivity(admin, brandId, `membuat album "${parsed.data.title}"`);
    revalidatePath(galleryPath(brandId));
    return { ok: true, message: "Album dibuat." };
  } catch (e) {
    return actionError(e);
  }
}

export async function updateAlbum(brandId: string, albumId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const admin = await requireBrandAdmin(brandId);
    const parsed = parseForm(albumSchema, formData);
    if (!parsed.success) return { error: parsed.error };
    await prisma.galleryAlbum.update({ where: { id: albumId, brandId }, data: parsed.data });
    await logActivity(admin, brandId, `mengubah album "${parsed.data.title}"`);
    revalidatePath(galleryPath(brandId));
    return { ok: true };
  } catch (e) {
    return actionError(e);
  }
}

export async function deleteAlbum(brandId: string, albumId: string): Promise<void> {
  const admin = await requireBrandAdmin(brandId);
  const photos = await prisma.galleryPhoto.findMany({ where: { albumId, album: { brandId } }, select: { imageUrl: true } });
  const album = await prisma.galleryAlbum.delete({ where: { id: albumId, brandId } });
  await logActivity(admin, brandId, `menghapus album "${album.title}" (${photos.length} foto)`);
  await Promise.all(photos.map((p) => deleteImage(p.imageUrl)));
  revalidatePath(galleryPath(brandId));
}

/** Dipanggil dari uploader setelah file berhasil diunggah ke /api/upload. */
export async function addPhotos(brandId: string, albumId: string, urls: string[]): Promise<ActionState> {
  try {
    const admin = await requireBrandAdmin(brandId);
    if (!(await findAlbum(brandId, albumId))) return { error: "Album tidak ditemukan." };
    const valid = urls.filter((u) => imageUrl.safeParse(u).success && u.startsWith("/uploads/")).slice(0, 100);
    const last = await prisma.galleryPhoto.aggregate({ where: { albumId }, _max: { order: true } });
    const start = (last._max.order ?? -1) + 1;
    await prisma.galleryPhoto.createMany({
      data: valid.map((url, i) => ({ albumId, imageUrl: url, order: start + i })),
    });
    await logActivity(admin, brandId, `menambah ${valid.length} foto galeri`);
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
  const admin = await requireBrandAdmin(brandId);
  const photo = await prisma.galleryPhoto.delete({ where: { id: photoId, album: { brandId } } });
  await deleteImage(photo.imageUrl);
  await logActivity(admin, brandId, "menghapus 1 foto galeri");
  revalidatePath(galleryPath(brandId));
}

/** Simpan urutan foto satu album hasil seret (drag) di Admin. `ids` = semua id foto album itu, urutan baru. */
export async function reorderPhotos(brandId: string, albumId: string, ids: string[]): Promise<ActionState> {
  try {
    const admin = await requireBrandAdmin(brandId);
    const photos = await prisma.galleryPhoto.findMany({ where: { albumId, album: { brandId } }, select: { id: true } });
    const known = new Set(photos.map((p) => p.id));
    if (ids.length !== known.size || !ids.every((id) => known.has(id))) return { error: "Daftar foto berubah. Muat ulang halaman." };
    await prisma.$transaction(ids.map((id, order) => prisma.galleryPhoto.update({ where: { id }, data: { order } })));
    await logActivity(admin, brandId, "mengubah urutan foto galeri");
    revalidatePath(galleryPath(brandId));
    return { ok: true, message: "Urutan disimpan." };
  } catch (e) {
    return actionError(e);
  }
}
