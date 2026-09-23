"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { requireBrandAdmin } from "@/lib/admin";
import { actionError } from "@/lib/admin-action";
import { PAGE_SECTIONS, type SectionData } from "@/lib/content";
import { deleteReplacedImage } from "@/lib/media";
import { prisma } from "@/lib/prisma";
import { parseForm, sectionSchema, type ActionState } from "@/lib/validation";

export async function saveSection(
  brandId: string,
  pageKey: string,
  sectionKey: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requireBrandAdmin(brandId);
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

    revalidatePath(`/admin/brands/${brandId}/pages`);
    return { ok: true, message: "Section disimpan." };
  } catch (e) {
    return actionError(e);
  }
}
