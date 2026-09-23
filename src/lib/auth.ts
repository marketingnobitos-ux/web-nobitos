// Konfigurasi Auth.js (NextAuth v5) — login Super Admin (PRD Bagian 10.1).
// Catatan: provider Credentials hanya mendukung session JWT (cookie terenkripsi),
// jadi session tidak disimpan di tabel DB.
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { AdminRole } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { clientIp, hit, isRateLimited, resetLimit } from "@/lib/rate-limit";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_EMAIL = 5;
const MAX_PER_IP = 20;

export class RateLimitedError extends CredentialsSignin {
  code = "rate_limited";
}

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(200),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true, // di belakang Nginx, banyak domain
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw, request) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const emailKey = `login:email:${email}`;
        const ipKey = `login:ip:${clientIp(request)}`;
        if (isRateLimited(emailKey, MAX_PER_EMAIL) || isRateLimited(ipKey, MAX_PER_IP)) {
          throw new RateLimitedError();
        }

        const user = await prisma.adminUser.findUnique({ where: { email } });
        const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;
        if (!user || !valid) {
          hit(emailKey, WINDOW_MS);
          hit(ipKey, WINDOW_MS);
          return null;
        }

        resetLimit(emailKey);
        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      if (token.role) session.user.role = token.role as AdminRole;
      return session;
    },
  },
});
