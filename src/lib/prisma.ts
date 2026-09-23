import { PrismaClient } from "@prisma/client";

// Satu instance PrismaClient; di dev disimpan di globalThis agar hot-reload
// tidak membuat koneksi baru terus-menerus.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
