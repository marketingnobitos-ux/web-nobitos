"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireBrandAdmin } from "@/lib/admin";
import { actionError } from "@/lib/admin-action";
import { summarizeWeek } from "@/lib/hours";
import { prisma } from "@/lib/prisma";
import { branchSchema, parseForm, parseWeekHours, type ActionState } from "@/lib/validation";

const branchesPath = (brandId: string) => `/admin/brands/${brandId}/branches`;

/** Data cabang + jam 7 hari dari form; teks jam diisi otomatis bila kosong. */
function parseBranch(formData: FormData) {
  const parsed = parseForm(branchSchema, formData);
  if (!parsed.success) return parsed;
  const hours = parseWeekHours(formData);
  if (!hours.success) return hours;
  const data = { ...parsed.data, openHours: parsed.data.openHours ?? summarizeWeek(hours.data) };
  return { success: true as const, data, hours: hours.data };
}

export async function createBranch(brandId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireBrandAdmin(brandId);
    const parsed = parseBranch(formData);
    if (!parsed.success) return { error: parsed.error };
    await prisma.branch.create({ data: { ...parsed.data, brandId, hours: { create: parsed.hours } } });
    revalidatePath(branchesPath(brandId));
  } catch (e) {
    return actionError(e);
  }
  redirect(branchesPath(brandId));
}

export async function updateBranch(brandId: string, branchId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireBrandAdmin(brandId);
    const parsed = parseBranch(formData);
    if (!parsed.success) return { error: parsed.error };
    // Jam diganti utuh: hari yang dikosongkan di form ikut terhapus.
    await prisma.$transaction([
      prisma.branch.update({ where: { id: branchId, brandId }, data: parsed.data }),
      prisma.branchHours.deleteMany({ where: { branchId } }),
      prisma.branchHours.createMany({ data: parsed.hours.map((h) => ({ ...h, branchId })) }),
    ]);
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
