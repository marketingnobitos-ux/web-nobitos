"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { logActivity, requireBrandAdmin } from "@/lib/admin";
import { actionError } from "@/lib/admin-action";
import { PAGE_SECTIONS, type SectionData } from "@/lib/content";
import { deleteReplacedImage } from "@/lib/media";
import { prisma } from "@/lib/prisma";
import { TEMPLATE_TEXT_FIELDS, TEXT_PAGE_KEY, defaultText, hasTemplateText, readTextOverrides } from "@/lib/template-text";
import { parseForm, sectionSchema, type ActionState } from "@/lib/validation";

export async function saveSection(
  brandId: string,
  pageKey: string,
  sectionKey: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const admin = await requireBrandAdmin(brandId);
    const index = PAGE_SECTIONS.findIndex((s) => s.pageKey === pageKey && s.sectionKey === sectionKey);
    if (index < 0) return { error: "Section tidak dikenal." };

    const parsed = parseForm(sectionSchema, formData);
    if (!parsed.success) return { error: parsed.error };
    const { isVisible, items, ...fields } = parsed.data;

    // Simpan hanya field yang diisi.
    const data: SectionData = {};
    for (const [key, value] of Object.entries(fields)) {
      if (value) data[key as Exclude<keyof SectionData, "items">] = value;
    }
    if (items.length) data.items = items;

    const where = { brandId_pageKey_sectionKey: { brandId, pageKey, sectionKey } };
    const old = await prisma.pageContent.findUnique({ where });
    await prisma.pageContent.upsert({
      where,
      update: { data: data as Prisma.InputJsonObject, isVisible },
      create: { brandId, pageKey, sectionKey, data: data as Prisma.InputJsonObject, isVisible, order: index },
    });

    const oldImage = (old?.data as SectionData | null)?.imageUrl;
    await deleteReplacedImage(oldImage, data.imageUrl);
    await deleteReplacedImage((old?.data as SectionData | null)?.videoUrl, data.videoUrl);
    await logActivity(admin, brandId, `mengubah isi halaman "${PAGE_SECTIONS[index].label}"`);

    revalidatePath(`/admin/brands/${brandId}/pages`);
    return { ok: true, message: "Section disimpan." };
  } catch (e) {
    return actionError(e);
  }
}

/**
 * Simpan teks satu kelompok template (Anglo/Dadak/Gerabah). Hanya teks yang berbeda dari bawaan yang disimpan;
 * field kosong / sama dengan bawaan = kembali ke teks bawaan di kode.
 */
export async function saveTemplateText(brandId: string, groupIndex: number, _prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const admin = await requireBrandAdmin(brandId);
    const brand = await prisma.brand.findUniqueOrThrow({ where: { id: brandId }, select: { template: true } });
    const template = brand.template;
    const group = TEMPLATE_TEXT_FIELDS[template]?.[groupIndex];
    if (!hasTemplateText(template) || !group) return { error: "Bagian teks tidak dikenal." };

    const overrides = await readTextOverrides(brandId, template);
    for (const field of group.fields) {
      const raw = String(formData.get(field.path) ?? "").replace(/\r\n/g, "\n").trim();
      if (raw.length > 2000) return { error: `${field.label}: maksimal 2000 karakter.` };
      if (!raw || raw === defaultText(template, field)) delete overrides[field.path];
      else overrides[field.path] = raw;
    }

    const where = { brandId_pageKey_sectionKey: { brandId, pageKey: TEXT_PAGE_KEY, sectionKey: template } };
    await prisma.pageContent.upsert({
      where,
      update: { data: overrides },
      create: { brandId, pageKey: TEXT_PAGE_KEY, sectionKey: template, data: overrides, isVisible: true, order: 99 },
    });
    await logActivity(admin, brandId, `mengubah teks halaman "${group.title}"`);
    revalidatePath(`/admin/brands/${brandId}/pages`);
    return { ok: true, message: "Teks disimpan. Langsung tampil di situs." };
  } catch (e) {
    return actionError(e);
  }
}
