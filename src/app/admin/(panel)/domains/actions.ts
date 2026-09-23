"use server";

import { revalidatePath } from "next/cache";
import { assertBrandAccess, requireAdmin, type AdminIdentity } from "@/lib/admin";
import { actionError } from "@/lib/admin-action";
import { invalidateBrandCache } from "@/lib/brand";
import { checkDns, cleanHostname, hostnameError, serverIp } from "@/lib/domain";
import { prisma } from "@/lib/prisma";
import type { ActionState } from "@/lib/validation";

const PATH = "/admin/domains";

function done(message?: string): ActionState {
  invalidateBrandCache(); // pemetaan domain -> brand langsung berlaku
  revalidatePath(PATH);
  return { ok: true, message };
}

function readForm(formData: FormData) {
  const hostname = cleanHostname(String(formData.get("hostname") ?? ""));
  const brandId = String(formData.get("brandId") ?? "");
  const isPrimary = formData.get("isPrimary") === "on";
  return { hostname, brandId, isPrimary };
}

async function findDomain(admin: AdminIdentity, domainId: string) {
  const domain = await prisma.domain.findUniqueOrThrow({ where: { id: domainId } });
  await assertBrandAccess(admin, domain.brandId);
  return domain;
}

/** Simpan domain; kalau isPrimary, domain utama lain di brand yang sama dilepas. */
async function saveDomain(domainId: string | null, data: { hostname: string; brandId: string; isPrimary: boolean }) {
  await prisma.$transaction(async (tx) => {
    if (data.isPrimary) {
      await tx.domain.updateMany({
        where: { brandId: data.brandId, isPrimary: true, ...(domainId ? { id: { not: domainId } } : {}) },
        data: { isPrimary: false },
      });
    }
    if (domainId) await tx.domain.update({ where: { id: domainId }, data });
    else await tx.domain.create({ data });
  });
}

export async function createDomain(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const admin = await requireAdmin();
    const data = readForm(formData);
    const invalid = hostnameError(data.hostname);
    if (invalid) return { error: invalid };
    if (!data.brandId) return { error: "Pilih brand." };
    await assertBrandAccess(admin, data.brandId);

    const existing = await prisma.domain.findUnique({ where: { hostname: data.hostname }, include: { brand: true } });
    if (existing) return { error: `${data.hostname} sudah terdaftar untuk ${existing.brand.name}.` };

    // Domain pertama sebuah brand otomatis jadi domain utama.
    const count = await prisma.domain.count({ where: { brandId: data.brandId } });
    await saveDomain(null, { ...data, isPrimary: data.isPrimary || count === 0 });
    return done(`${data.hostname} ditambahkan (status PENDING). Arahkan DNS lalu klik "Cek status".`);
  } catch (e) {
    return actionError(e);
  }
}

export async function updateDomain(domainId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const admin = await requireAdmin();
    const old = await findDomain(admin, domainId);
    const data = readForm(formData);
    const invalid = hostnameError(data.hostname);
    if (invalid) return { error: invalid };
    if (!data.brandId) return { error: "Pilih brand." };
    await assertBrandAccess(admin, data.brandId);

    const clash = await prisma.domain.findFirst({ where: { hostname: data.hostname, id: { not: domainId } } });
    if (clash) return { error: `${data.hostname} sudah terdaftar.` };

    // Hostname berubah = DNS & SSL perlu dicek ulang.
    const reset = old.hostname !== data.hostname ? { status: "PENDING" as const, sslIssued: false } : {};
    await saveDomain(domainId, data);
    if (Object.keys(reset).length) await prisma.domain.update({ where: { id: domainId }, data: reset });
    return done("Domain disimpan.");
  } catch (e) {
    return actionError(e);
  }
}

export async function deleteDomain(domainId: string): Promise<void> {
  const admin = await requireAdmin();
  await findDomain(admin, domainId);
  await prisma.domain.delete({ where: { id: domainId } });
  done();
}

export async function checkDomainStatus(domainId: string, _prev: ActionState): Promise<ActionState> {
  try {
    const admin = await requireAdmin();
    const domain = await findDomain(admin, domainId);
    const ip = serverIp();
    if (!ip) return { error: "SERVER_IP belum diisi di .env." };

    const result = await checkDns(domain.hostname, ip);
    // ACTIVE tetap ACTIVE selama DNS masih mengarah ke server.
    const status = domain.status === "ACTIVE" && result.status === "VERIFIED" ? "ACTIVE" : result.status;
    await prisma.domain.update({
      where: { id: domainId },
      data: { status, ...(status !== "ACTIVE" ? { sslIssued: false } : {}) },
    });
    revalidatePath(PATH);
    return result.status === "ERROR" ? { error: `${status}: ${result.message}` } : { ok: true, message: `${status}: ${result.message}` };
  } catch (e) {
    return actionError(e);
  }
}

/** Tandai ACTIVE (SSL sudah terpasang di server) atau kembalikan ke VERIFIED. */
export async function setDomainActive(domainId: string, active: boolean): Promise<void> {
  const admin = await requireAdmin();
  const domain = await findDomain(admin, domainId);
  if (active && domain.status !== "VERIFIED") return; // harus lolos cek DNS dulu
  await prisma.domain.update({
    where: { id: domainId },
    data: active ? { status: "ACTIVE", sslIssued: true } : { status: "VERIFIED", sslIssued: false },
  });
  done();
}
