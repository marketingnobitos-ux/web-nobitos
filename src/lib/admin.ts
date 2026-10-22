// Guard untuk halaman & server action admin.
import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import type { AdminRole } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type AdminIdentity = { id: string; email: string; name: string | null; role: AdminRole };

export const ROLE_LABEL: Record<AdminRole, string> = {
  SUPER_ADMIN: "Super Admin",
  BRAND_ADMIN: "Admin Brand",
  EDITOR: "Editor",
  VIEWER: "Pemantau",
};

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
  await touchLastSeen(admin.id);
  return admin;
}

const SEEN_EVERY_MS = 5 * 60 * 1000;

/** Catat "terakhir aktif" paling sering tiap 5 menit per akun (untuk daftar Akun & Akses). */
const touchLastSeen = cache(async (adminId: string) => {
  const since = new Date(Date.now() - SEEN_EVERY_MS);
  await prisma.adminUser
    .updateMany({ where: { id: adminId, OR: [{ lastSeenAt: null }, { lastSeenAt: { lt: since } }] }, data: { lastSeenAt: new Date() } })
    .catch(() => {});
});

/**
 * Hak akses per peran (mockup Akun & Akses):
 * - view    : lihat ringkasan & data (semua peran)
 * - content : ubah menu, stok, promo, galeri, isi halaman (Super Admin, Admin Brand, Editor)
 * - brand   : ubah profil brand & lokasi/jam buka (Super Admin, Admin Brand)
 * - super   : domain, akun & akses, tambah/hapus brand (Super Admin)
 */
export type Permission = "view" | "content" | "brand" | "super";

const ROLE_RANK: Record<AdminRole, number> = { VIEWER: 0, EDITOR: 1, BRAND_ADMIN: 2, SUPER_ADMIN: 3 };
const PERMISSION_RANK: Record<Permission, number> = { view: 0, content: 1, brand: 2, super: 3 };

export function can(role: AdminRole, permission: Permission): boolean {
  return ROLE_RANK[role] >= PERMISSION_RANK[permission];
}

export function requirePermission(admin: AdminIdentity, permission: Permission): void {
  if (!can(admin.role, permission)) throw new ForbiddenError("Peran akun Anda tidak boleh melakukan aksi ini.");
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

/**
 * Admin login + punya akses ke brand + perannya boleh `permission` (bawaan: ubah konten).
 * Dipakai di awal setiap server action per brand.
 */
export async function requireBrandAdmin(brandId: string, permission: Permission = "content"): Promise<AdminIdentity> {
  const admin = await requireAdmin();
  requirePermission(admin, permission);
  await assertBrandAccess(admin, brandId);
  return admin;
}

/** Brand yang boleh dikelola admin ini. Di-cache per request (layout & halaman berbagi hasil). */
export const listAccessibleBrands = cache((admin: AdminIdentity) =>
  prisma.brand.findMany({
    where: admin.role === "SUPER_ADMIN" ? {} : { admins: { some: { adminId: admin.id } } },
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true, template: true },
  }),
);

/** Brand untuk halaman admin: 404 kalau tidak ada / tidak punya akses. */
export const getBrandForAdmin = cache(async (brandId: string) => {
  const admin = await requireAdmin();
  const brand = await prisma.brand.findUnique({ where: { id: brandId }, include: { domains: true } });
  if (!brand || !(await hasBrandAccess(admin, brand.id))) notFound();
  return brand;
});

/**
 * Catat perubahan ke log aktivitas staf. Tidak pernah menggagalkan aksi utama.
 * `action` = kalimat pendek tanpa nama pelaku, mis. `mengubah "Tempe" jadi Habis`.
 */
export async function logActivity(admin: AdminIdentity, brandId: string | null, action: string): Promise<void> {
  try {
    const brand = brandId ? await prisma.brand.findUnique({ where: { id: brandId }, select: { name: true } }) : null;
    await prisma.adminActivity.create({
      data: { adminId: admin.id, adminName: admin.name ?? admin.email, brandId, brandName: brand?.name ?? null, action: action.slice(0, 300) },
    });
  } catch (e) {
    console.error("[admin log]", e);
  }
}

/** Inisial untuk avatar bulat: "Super Admin" -> "SA", "budi@x.id" -> "B". */
export function initials(nameOrEmail: string): string {
  const parts = nameOrEmail.replace(/@.*/, "").split(/[\s._-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "A";
}

const WIB = "Asia/Jakarta";
const dayKey = new Intl.DateTimeFormat("en-CA", { timeZone: WIB });
const timeFmt = new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: WIB });
const dateFmt = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", timeZone: WIB });

/** "Hari ini 10.24" / "Kemarin 16.42" / "21 Okt 09.10" (WIB). */
export function whenLabel(date: Date, now = new Date()): string {
  const d = dayKey.format(date);
  const today = dayKey.format(now);
  const yesterday = dayKey.format(new Date(now.getTime() - 86_400_000));
  const prefix = d === today ? "Hari ini" : d === yesterday ? "Kemarin" : dateFmt.format(date);
  return `${prefix} ${timeFmt.format(date)}`;
}
