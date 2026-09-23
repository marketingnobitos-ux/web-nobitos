"use server";

import { AuthError, CredentialsSignin } from "next-auth";
import { signIn } from "@/lib/auth";
import type { ActionState } from "@/lib/validation";

/** Hanya izinkan redirect ke dalam /admin (cegah open redirect). */
function safeCallback(value: FormDataEntryValue | null): string {
  const v = typeof value === "string" ? value : "";
  return v.startsWith("/admin") && !v.startsWith("/admin/login") && !v.includes("//") ? v : "/admin";
}

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: safeCallback(formData.get("callbackUrl")),
    });
    return { ok: true };
  } catch (e) {
    if (e instanceof CredentialsSignin && e.code === "rate_limited") {
      return { error: "Terlalu banyak percobaan gagal. Coba lagi dalam 15 menit." };
    }
    if (e instanceof AuthError) return { error: "Email atau password salah." };
    throw e; // termasuk redirect sukses dari signIn
  }
}
