import { readFile } from "node:fs/promises";
import path from "node:path";
import { uploadRoot } from "@/lib/media";

export const runtime = "nodejs";

const TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

// Melayani file upload saat dev / fallback. Di produksi sebaiknya Nginx `location /uploads/` (PRD Bagian 12).
export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const root = uploadRoot();
  const file = path.resolve(root, ...(await params).path);
  const type = TYPES[path.extname(file).toLowerCase()];

  if (!file.startsWith(root + path.sep) || !type) return new Response("Not found", { status: 404 });

  try {
    const data = await readFile(file);
    return new Response(new Uint8Array(data), {
      headers: { "Content-Type": type, "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
