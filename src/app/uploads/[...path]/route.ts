import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { uploadRoot } from "@/lib/media";

export const runtime = "nodejs";

const TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".mp4": "video/mp4",
};

const CACHE = "public, max-age=31536000, immutable";

// Melayani file upload saat dev / fallback. Di produksi sebaiknya Nginx `location /uploads/` (PRD Bagian 12).
// Mendukung header Range supaya video bisa diputar & di-seek (wajib untuk Safari/iPhone).
export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const root = uploadRoot();
  const file = path.resolve(root, ...(await params).path);
  const type = TYPES[path.extname(file).toLowerCase()];

  if (!file.startsWith(root + path.sep) || !type) return new Response("Not found", { status: 404 });

  let size: number;
  try {
    const info = await stat(file);
    if (!info.isFile()) return new Response("Not found", { status: 404 });
    size = info.size;
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const stream = (start: number, end: number) =>
    Readable.toWeb(createReadStream(file, { start, end })) as ReadableStream<Uint8Array>;

  const range = req.headers.get("range")?.match(/^bytes=(\d*)-(\d*)$/);
  if (range && (range[1] || range[2])) {
    let start = range[1] ? Number(range[1]) : size - Number(range[2]);
    let end = range[1] && range[2] ? Number(range[2]) : size - 1;
    start = Math.max(0, start);
    end = Math.min(end, size - 1);
    if (start > end) {
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
    }
    return new Response(stream(start, end), {
      status: 206,
      headers: {
        "Content-Type": type,
        "Content-Length": String(end - start + 1),
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Accept-Ranges": "bytes",
        "Cache-Control": CACHE,
      },
    });
  }

  return new Response(stream(0, Math.max(0, size - 1)), {
    headers: { "Content-Type": type, "Content-Length": String(size), "Accept-Ranges": "bytes", "Cache-Control": CACHE },
  });
}
