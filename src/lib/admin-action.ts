// Penanganan error standar untuk server action admin.
import { unstable_rethrow } from "next/navigation";
import { Prisma } from "@prisma/client";
import { ForbiddenError } from "@/lib/admin";
import type { ActionState } from "@/lib/validation";

export function actionError(e: unknown): ActionState {
  unstable_rethrow(e); // redirect()/notFound() harus diteruskan ke Next
  if (e instanceof ForbiddenError) return { error: e.message };
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2002") return { error: "Data sudah dipakai (duplikat). Gunakan nilai lain." };
    if (e.code === "P2025") return { error: "Data tidak ditemukan. Muat ulang halaman." };
  }
  console.error("[admin action]", e);
  return { error: "Terjadi kesalahan. Coba lagi." };
}
