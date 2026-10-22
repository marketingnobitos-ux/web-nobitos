"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { logActivity, requireBrandAdmin } from "@/lib/admin";
import { actionError } from "@/lib/admin-action";
import { deleteImage, deleteReplacedImage } from "@/lib/media";
import { prisma } from "@/lib/prisma";
import { parseForm, promoSchema, type ActionState } from "@/lib/validation";

const promosPath = (brandId: string) => `/admin/brands/${brandId}/promos`;

export async function createPromo(brandId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const admin = await requireBrandAdmin(brandId);
    const parsed = parseForm(promoSchema, formData);
    if (!parsed.success) return { error: parsed.error };
    await prisma.promo.create({ data: { ...parsed.data, brandId } });
    await logActivity(admin, brandId, `menambah promo "${parsed.data.title}"`);
    revalidatePath(promosPath(brandId));
  } catch (e) {
    return actionError(e);
  }
  redirect(promosPath(brandId));
}

export async function updatePromo(brandId: string, promoId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const admin = await requireBrandAdmin(brandId);
    const parsed = parseForm(promoSchema, formData);
    if (!parsed.success) return { error: parsed.error };
    const old = await prisma.promo.findFirstOrThrow({ where: { id: promoId, brandId } });
    await prisma.promo.update({ where: { id: promoId }, data: parsed.data });
    await deleteReplacedImage(old.imageUrl, parsed.data.imageUrl);
    await logActivity(admin, brandId, `mengubah promo "${parsed.data.title}"`);
    revalidatePath(promosPath(brandId));
    return { ok: true, message: "Promo disimpan." };
  } catch (e) {
    return actionError(e);
  }
}

export async function deletePromo(brandId: string, promoId: string): Promise<void> {
  const admin = await requireBrandAdmin(brandId);
  const promo = await prisma.promo.delete({ where: { id: promoId, brandId } });
  await deleteImage(promo.imageUrl);
  await logActivity(admin, brandId, `menghapus promo "${promo.title}"`);
  revalidatePath(promosPath(brandId));
  redirect(promosPath(brandId));
}
