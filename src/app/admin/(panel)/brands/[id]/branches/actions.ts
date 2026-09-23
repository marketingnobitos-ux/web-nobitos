"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireBrandAdmin } from "@/lib/admin";
import { actionError } from "@/lib/admin-action";
import { prisma } from "@/lib/prisma";
import { branchSchema, parseForm, type ActionState } from "@/lib/validation";

const branchesPath = (brandId: string) => `/admin/brands/${brandId}/branches`;

export async function createBranch(brandId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireBrandAdmin(brandId);
    const parsed = parseForm(branchSchema, formData);
    if (!parsed.success) return { error: parsed.error };
    await prisma.branch.create({ data: { ...parsed.data, brandId } });
    revalidatePath(branchesPath(brandId));
  } catch (e) {
    return actionError(e);
  }
  redirect(branchesPath(brandId));
}

export async function updateBranch(brandId: string, branchId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireBrandAdmin(brandId);
    const parsed = parseForm(branchSchema, formData);
    if (!parsed.success) return { error: parsed.error };
    await prisma.branch.update({ where: { id: branchId, brandId }, data: parsed.data });
    revalidatePath(branchesPath(brandId));
    return { ok: true, message: "Cabang disimpan." };
  } catch (e) {
    return actionError(e);
  }
}

export async function deleteBranch(brandId: string, branchId: string): Promise<void> {
  await requireBrandAdmin(brandId);
  await prisma.branch.delete({ where: { id: branchId, brandId } });
  revalidatePath(branchesPath(brandId));
  redirect(branchesPath(brandId));
}
