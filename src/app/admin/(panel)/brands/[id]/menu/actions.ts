"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireBrandAdmin } from "@/lib/admin";
import { actionError } from "@/lib/admin-action";
import { deleteImage, deleteReplacedImage } from "@/lib/media";
import { prisma } from "@/lib/prisma";
import { categorySchema, menuItemSchema, parseForm, type ActionState } from "@/lib/validation";

const menuPath = (brandId: string) => `/admin/brands/${brandId}/menu`;

// ---- Kategori ----

export async function createCategory(brandId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireBrandAdmin(brandId);
    const parsed = parseForm(categorySchema, formData);
    if (!parsed.success) return { error: parsed.error };
    await prisma.menuCategory.create({ data: { ...parsed.data, brandId } });
    revalidatePath(menuPath(brandId));
    return { ok: true, message: "Kategori ditambahkan." };
  } catch (e) {
    return actionError(e);
  }
}

export async function updateCategory(
  brandId: string,
  categoryId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requireBrandAdmin(brandId);
    const parsed = parseForm(categorySchema, formData);
    if (!parsed.success) return { error: parsed.error };
    await prisma.menuCategory.update({ where: { id: categoryId, brandId }, data: parsed.data });
    revalidatePath(menuPath(brandId));
    return { ok: true };
  } catch (e) {
    return actionError(e);
  }
}

export async function deleteCategory(brandId: string, categoryId: string): Promise<void> {
  await requireBrandAdmin(brandId);
  const items = await prisma.menuItem.findMany({ where: { categoryId, brandId }, select: { imageUrl: true } });
  await prisma.menuCategory.delete({ where: { id: categoryId, brandId } }); // item ikut terhapus (Cascade)
  await Promise.all(items.map((i) => deleteImage(i.imageUrl)));
  revalidatePath(menuPath(brandId));
}

/** Urutan baru setelah `id` digeser satu langkah (-1 naik, 1 turun), dinomori ulang 0..n. Null kalau tidak bisa digeser. */
function reorder(ids: string[], id: string, dir: -1 | 1): string[] | null {
  const i = ids.indexOf(id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= ids.length) return null;
  const next = [...ids];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

export async function moveCategory(brandId: string, categoryId: string, dir: -1 | 1): Promise<void> {
  await requireBrandAdmin(brandId);
  const cats = await prisma.menuCategory.findMany({ where: { brandId }, orderBy: [{ order: "asc" }, { name: "asc" }], select: { id: true } });
  const ids = reorder(
    cats.map((c) => c.id),
    categoryId,
    dir,
  );
  if (!ids) return;
  await prisma.$transaction(ids.map((id, order) => prisma.menuCategory.update({ where: { id, brandId }, data: { order } })));
  revalidatePath(menuPath(brandId));
}

// ---- Item menu ----

/** Ubah cepat dari daftar menu: Tersedia/Habis atau Andalan. */
export async function toggleMenuItem(brandId: string, itemId: string, field: "isAvailable" | "isFeatured"): Promise<void> {
  await requireBrandAdmin(brandId);
  const item = await prisma.menuItem.findFirstOrThrow({ where: { id: itemId, brandId }, select: { isAvailable: true, isFeatured: true } });
  await prisma.menuItem.update({ where: { id: itemId }, data: { [field]: !item[field] } });
  revalidatePath(menuPath(brandId));
}

/** Geser item satu langkah di dalam kategorinya. */
export async function moveMenuItem(brandId: string, itemId: string, dir: -1 | 1): Promise<void> {
  await requireBrandAdmin(brandId);
  const item = await prisma.menuItem.findFirstOrThrow({ where: { id: itemId, brandId }, select: { categoryId: true } });
  const items = await prisma.menuItem.findMany({
    where: { brandId, categoryId: item.categoryId },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    select: { id: true },
  });
  const ids = reorder(
    items.map((i) => i.id),
    itemId,
    dir,
  );
  if (!ids) return;
  await prisma.$transaction(ids.map((id, order) => prisma.menuItem.update({ where: { id }, data: { order } })));
  revalidatePath(menuPath(brandId));
}

async function assertCategory(brandId: string, categoryId: string) {
  const cat = await prisma.menuCategory.findFirst({ where: { id: categoryId, brandId }, select: { id: true } });
  return !!cat;
}

/** Urutan untuk item yang baru masuk kategori: paling bawah. */
async function nextItemOrder(categoryId: string): Promise<number> {
  const last = await prisma.menuItem.aggregate({ where: { categoryId }, _max: { order: true } });
  return (last._max.order ?? -1) + 1;
}

export async function createMenuItem(brandId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireBrandAdmin(brandId);
    const parsed = parseForm(menuItemSchema, formData);
    if (!parsed.success) return { error: parsed.error };
    if (!(await assertCategory(brandId, parsed.data.categoryId))) return { error: "Kategori tidak valid." };
    await prisma.menuItem.create({ data: { ...parsed.data, order: await nextItemOrder(parsed.data.categoryId), brandId } });
    revalidatePath(menuPath(brandId));
  } catch (e) {
    return actionError(e);
  }
  redirect(menuPath(brandId));
}

export async function updateMenuItem(
  brandId: string,
  itemId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requireBrandAdmin(brandId);
    const parsed = parseForm(menuItemSchema, formData);
    if (!parsed.success) return { error: parsed.error };
    if (!(await assertCategory(brandId, parsed.data.categoryId))) return { error: "Kategori tidak valid." };

    const old = await prisma.menuItem.findFirstOrThrow({ where: { id: itemId, brandId } });
    // Urutan tetap; pindah kategori = taruh paling bawah di kategori baru.
    const order = old.categoryId === parsed.data.categoryId ? old.order : await nextItemOrder(parsed.data.categoryId);
    await prisma.menuItem.update({ where: { id: itemId }, data: { ...parsed.data, order } });
    await deleteReplacedImage(old.imageUrl, parsed.data.imageUrl);

    revalidatePath(menuPath(brandId));
    return { ok: true, message: "Menu disimpan." };
  } catch (e) {
    return actionError(e);
  }
}

export async function deleteMenuItem(brandId: string, itemId: string): Promise<void> {
  await requireBrandAdmin(brandId);
  const item = await prisma.menuItem.delete({ where: { id: itemId, brandId } });
  await deleteImage(item.imageUrl);
  revalidatePath(menuPath(brandId));
  redirect(menuPath(brandId));
}
