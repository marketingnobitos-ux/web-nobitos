// Guard untuk halaman & server action admin.
import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import type { AdminRole } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type AdminIdentity = { id: string; email: string; name: string | null; role: AdminRole };

/** Admin yang sedang login (dicek ulang ke DB), atau null. */
export const getAdmin = cache(async (): Promise<AdminIdentity | null> => {
  const session = await auth();
  if (!session?.user?.id) return null;
  return prisma.adminUser.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, name: true, role: true },
  });
});

export async function requireAdmin(): Promise<AdminIdentity> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export class ForbiddenError extends Error {
  constructor(message = "Anda tidak punya akses untuk aksi ini.") {
    super(message);
  }
}

export function requireSuperAdmin(admin: AdminIdentity): void {
  if (admin.role !== "SUPER_ADMIN") throw new ForbiddenError();
}

/** SUPER_ADMIN boleh semua brand; role lain hanya brand yang ditautkan di AdminBrand. */
export async function hasBrandAccess(admin: AdminIdentity, brandId: string): Promise<boolean> {
  if (admin.role === "SUPER_ADMIN") return true;
  const link = await prisma.adminBrand.findUnique({
    where: { adminId_brandId: { adminId: admin.id, brandId } },
  });
  return !!link;
}

export async function assertBrandAccess(admin: AdminIdentity, brandId: string): Promise<void> {
  if (!(await hasBrandAccess(admin, brandId))) throw new ForbiddenError();
}

/** Admin login + punya akses ke brand. Dipakai di awal setiap server action per brand. */
export async function requireBrandAdmin(brandId: string): Promise<AdminIdentity> {
  const admin = await requireAdmin();
  await assertBrandAccess(admin, brandId);
  return admin;
}

export function listAccessibleBrands(admin: AdminIdentity) {
  return prisma.brand.findMany({
    where: admin.role === "SUPER_ADMIN" ? {} : { admins: { some: { adminId: admin.id } } },
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });
}

/** Brand untuk halaman admin: 404 kalau tidak ada / tidak punya akses. */
export const getBrandForAdmin = cache(async (brandId: string) => {
  const admin = await requireAdmin();
  const brand = await prisma.brand.findUnique({ where: { id: brandId }, include: { domains: true } });
  if (!brand || !(await hasBrandAccess(admin, brand.id))) notFound();
  return brand;
});
