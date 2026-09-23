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

// ---- Item menu ----

async function assertCategory(brandId: string, categoryId: string) {
  const cat = await prisma.menuCategory.findFirst({ where: { id: categoryId, brandId }, select: { id: true } });
  return !!cat;
}

export async function createMenuItem(brandId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireBrandAdmin(brandId);
    const parsed = parseForm(menuItemSchema, formData);
    if (!parsed.success) return { error: parsed.error };
    if (!(await assertCategory(brandId, parsed.data.categoryId))) return { error: "Kategori tidak valid." };
    await prisma.menuItem.create({ data: { ...parsed.data, brandId } });
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
    await prisma.menuItem.update({ where: { id: itemId }, data: parsed.data });
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
