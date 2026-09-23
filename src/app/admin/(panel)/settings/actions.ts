"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { requireAdmin } from "@/lib/admin";
import { actionError } from "@/lib/admin-action";
import { prisma } from "@/lib/prisma";
import { parseForm, passwordSchema, profileSchema, type ActionState } from "@/lib/validation";

export async function updateProfile(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const admin = await requireAdmin();
    const parsed = parseForm(profileSchema, formData);
    if (!parsed.success) return { error: parsed.error };
    await prisma.adminUser.update({ where: { id: admin.id }, data: parsed.data });
    revalidatePath("/admin", "layout");
    return { ok: true, message: "Profil disimpan." };
  } catch (e) {
    return actionError(e);
  }
}

export async function changePassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const admin = await requireAdmin();
    const parsed = parseForm(passwordSchema, formData);
    if (!parsed.success) return { error: parsed.error };

    const user = await prisma.adminUser.findUniqueOrThrow({ where: { id: admin.id } });
    if (!(await bcrypt.compare(parsed.data.currentPassword, user.passwordHash))) {
      return { error: "Password lama salah." };
    }
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { passwordHash: await bcrypt.hash(parsed.data.newPassword, 12) },
    });
    return { ok: true, message: "Password diganti." };
  } catch (e) {
    return actionError(e);
  }
}
