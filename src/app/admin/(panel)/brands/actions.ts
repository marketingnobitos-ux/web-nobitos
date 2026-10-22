"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { logActivity, requireAdmin, requireBrandAdmin, requireSuperAdmin } from "@/lib/admin";
import { actionError } from "@/lib/admin-action";
import { invalidateBrandCache } from "@/lib/brand";
import { deleteReplacedImage } from "@/lib/media";
import { prisma } from "@/lib/prisma";
import { brandSchema, parseForm, type ActionState } from "@/lib/validation";

export async function createBrand(_prev: ActionState, formData: FormData): Promise<ActionState> {
  let id: string;
  try {
    const admin = await requireAdmin();
    requireSuperAdmin(admin);
    const parsed = parseForm(brandSchema, formData);
    if (!parsed.success) return { error: parsed.error };
    ({ id } = await prisma.brand.create({ data: parsed.data }));
    await logActivity(admin, id, `menambah brand "${parsed.data.name}"`);
    invalidateBrandCache();
    revalidatePath("/admin", "layout");
  } catch (e) {
    return actionError(e);
  }
  redirect(`/admin/brands/${id}`);
}

export async function updateBrand(brandId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const admin = await requireBrandAdmin(brandId, "brand");
    const parsed = parseForm(brandSchema, formData);
    if (!parsed.success) return { error: parsed.error };

    const old = await prisma.brand.findUniqueOrThrow({ where: { id: brandId } });
    await prisma.brand.update({ where: { id: brandId }, data: parsed.data });
    await deleteReplacedImage(old.logoUrl, parsed.data.logoUrl);
    await deleteReplacedImage(old.faviconUrl, parsed.data.faviconUrl);
    await logActivity(admin, brandId, old.isPublished !== parsed.data.isPublished ? (parsed.data.isPublished ? "menayangkan brand" : "menjadikan brand Draft") : "mengubah profil brand");

    invalidateBrandCache();
    revalidatePath("/admin", "layout");
    return { ok: true, message: "Brand disimpan." };
  } catch (e) {
    return actionError(e);
  }
}

export async function deleteBrand(brandId: string): Promise<void> {
  const admin = await requireAdmin();
  requireSuperAdmin(admin);
  const brand = await prisma.brand.findUniqueOrThrow({ where: { id: brandId }, select: { name: true } });
  await logActivity(admin, null, `menghapus brand "${brand.name}"`);
  // Relasi (menu, galeri, cabang, dll) ikut terhapus lewat onDelete: Cascade.
  await prisma.brand.delete({ where: { id: brandId } });
  invalidateBrandCache();
  revalidatePath("/admin", "layout");
  redirect("/admin/brands");
}
