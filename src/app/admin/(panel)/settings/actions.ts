"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { ForbiddenError, ROLE_LABEL, logActivity, requireAdmin, requirePermission } from "@/lib/admin";
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
    await logActivity(admin, null, "mengganti kata sandi sendiri");
    return { ok: true, message: "Password diganti." };
  } catch (e) {
    return actionError(e);
  }
}

// ---- Kelola staf (Super Admin saja, F6.13) ----

const ROLES = ["SUPER_ADMIN", "BRAND_ADMIN", "EDITOR", "VIEWER"] as const;

const staffSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi.").max(100),
  email: z.string().trim().toLowerCase().email("Email tidak valid.").max(200),
  role: z.enum(ROLES, { message: "Pilih peran." }),
  password: z.string().max(200).optional(),
});

/** Brand yang dicentang di form (hanya id yang memang ada). */
async function readBrandIds(formData: FormData): Promise<string[]> {
  const ids = formData.getAll("brandIds").map(String).filter(Boolean);
  if (!ids.length) return [];
  const found = await prisma.brand.findMany({ where: { id: { in: ids } }, select: { id: true } });
  return found.map((b) => b.id);
}

function readStaff(formData: FormData) {
  return staffSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
    password: String(formData.get("password") ?? "") || undefined,
  });
}

async function requireSuper() {
  const admin = await requireAdmin();
  requirePermission(admin, "super");
  return admin;
}

export async function createStaff(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const admin = await requireSuper();
    const parsed = readStaff(formData);
    if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
    const { name, email, role, password } = parsed.data;
    if (!password || password.length < 8) return { error: "Kata sandi awal minimal 8 karakter." };
    const brandIds = role === "SUPER_ADMIN" ? [] : await readBrandIds(formData);
    if (role !== "SUPER_ADMIN" && !brandIds.length) return { error: "Centang minimal satu brand." };

    await prisma.adminUser.create({
      data: { name, email, role, passwordHash: await bcrypt.hash(password, 12), brands: { create: brandIds.map((brandId) => ({ brandId })) } },
    });
    await logActivity(admin, null, `menambah akun ${email} (${ROLE_LABEL[role]})`);
    revalidatePath("/admin/settings");
    return { ok: true, message: `Akun ${email} dibuat. Berikan email & kata sandi awal ke staf.` };
  } catch (e) {
    return actionError(e);
  }
}

export async function updateStaff(staffId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const admin = await requireSuper();
    const parsed = readStaff(formData);
    if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
    const { name, email, role, password } = parsed.data;
    if (password && password.length < 8) return { error: "Kata sandi baru minimal 8 karakter." };
    const brandIds = role === "SUPER_ADMIN" ? [] : await readBrandIds(formData);
    if (role !== "SUPER_ADMIN" && !brandIds.length) return { error: "Centang minimal satu brand." };

    const old = await prisma.adminUser.findUniqueOrThrow({ where: { id: staffId }, select: { role: true, email: true } });
    if (old.role === "SUPER_ADMIN" && role !== "SUPER_ADMIN") {
      if (staffId === admin.id) return { error: "Anda tidak bisa menurunkan peran akun sendiri." };
      if ((await prisma.adminUser.count({ where: { role: "SUPER_ADMIN" } })) <= 1) return { error: "Harus ada minimal satu Super Admin." };
    }

    await prisma.$transaction([
      prisma.adminUser.update({
        where: { id: staffId },
        data: { name, email, role, ...(password ? { passwordHash: await bcrypt.hash(password, 12) } : {}) },
      }),
      prisma.adminBrand.deleteMany({ where: { adminId: staffId } }),
      prisma.adminBrand.createMany({ data: brandIds.map((brandId) => ({ adminId: staffId, brandId })) }),
    ]);
    const changes = [old.role !== role ? `peran → ${ROLE_LABEL[role]}` : "", password ? "kata sandi diatur ulang" : ""].filter(Boolean);
    await logActivity(admin, null, `mengubah akun ${email}${changes.length ? ` (${changes.join(", ")})` : ""}`);
    revalidatePath("/admin", "layout");
    return { ok: true, message: password ? "Akun disimpan. Kata sandi baru berlaku sekarang." : "Akun disimpan." };
  } catch (e) {
    return actionError(e);
  }
}

export async function deleteStaff(staffId: string): Promise<void> {
  const admin = await requireSuper();
  if (staffId === admin.id) throw new ForbiddenError("Anda tidak bisa menghapus akun sendiri.");
  const staff = await prisma.adminUser.findUniqueOrThrow({ where: { id: staffId }, select: { email: true, role: true } });
  if (staff.role === "SUPER_ADMIN" && (await prisma.adminUser.count({ where: { role: "SUPER_ADMIN" } })) <= 1) {
    throw new ForbiddenError("Harus ada minimal satu Super Admin.");
  }
  await prisma.adminUser.delete({ where: { id: staffId } });
  await logActivity(admin, null, `menghapus akun ${staff.email}`);
  revalidatePath("/admin/settings");
}
