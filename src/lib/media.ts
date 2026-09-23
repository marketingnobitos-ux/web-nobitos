// Upload & optimasi media dengan sharp (PRD Bagian 10.5).
// Setiap gambar disimpan sebagai WebP dalam beberapa lebar; DB menyimpan URL versi terbesar.
import { randomBytes } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { IMAGE_WIDTHS, LARGEST_WIDTH } from "@/lib/image";

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export class MediaError extends Error {}

export function maxUploadBytes(): number {
  return Number(process.env.MAX_UPLOAD_MB ?? 15) * 1024 * 1024;
}

export const ALLOWED_VIDEO_TYPES = ["video/mp4"];

export function maxVideoBytes(): number {
  return Number(process.env.MAX_VIDEO_MB ?? 60) * 1024 * 1024;
}

/** Folder upload absolut. Default ./uploads kalau UPLOAD_DIR kosong. */
export function uploadRoot(): string {
  return path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads"));
}

/** Simpan gambar (resize + WebP) ke <UPLOAD_DIR>/<brandSlug>/ dan kembalikan URL publiknya. */
export async function saveImage(input: Buffer, brandSlug: string): Promise<string> {
  let format: string | undefined;
  try {
    format = (await sharp(input).metadata()).format;
  } catch {
    throw new MediaError("File bukan gambar yang valid.");
  }
  if (!format || !["jpeg", "png", "webp"].includes(format)) {
    throw new MediaError("Format gambar harus JPG, PNG, atau WebP.");
  }

  const dir = path.join(uploadRoot(), brandSlug);
  await mkdir(dir, { recursive: true });
  const id = `${Date.now().toString(36)}-${randomBytes(4).toString("hex")}`;

  await Promise.all(
    IMAGE_WIDTHS.map((width) =>
      sharp(input)
        .rotate() // ikuti orientasi EXIF dari HP
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(path.join(dir, `${id}-${width}.webp`)),
    ),
  );

  return `/uploads/${brandSlug}/${id}-${LARGEST_WIDTH}.webp`;
}

/**
 * Simpan video MP4 apa adanya (tanpa kompres ulang) ke <UPLOAD_DIR>/<brandSlug>/.
 * Kompres dulu sebelum upload supaya ringan (disarankan < 15 MB, 1080p, tanpa suara).
 */
export async function saveVideo(input: Buffer, brandSlug: string): Promise<string> {
  // File MP4 selalu punya kotak "ftyp" di byte 4–8.
  if (input.length < 12 || input.subarray(4, 8).toString("ascii") !== "ftyp") {
    throw new MediaError("File bukan video MP4 yang valid.");
  }
  const dir = path.join(uploadRoot(), brandSlug);
  await mkdir(dir, { recursive: true });
  const id = `${Date.now().toString(36)}-${randomBytes(4).toString("hex")}`;
  await writeFile(path.join(dir, `${id}.mp4`), input);
  return `/uploads/${brandSlug}/${id}.mp4`;
}

const VIDEO_URL_RE = /^\/uploads\/([a-z0-9-]+)\/([a-z0-9-]+)\.mp4$/;

const UPLOAD_URL_RE =new RegExp(`^/uploads/([a-z0-9-]+)/([a-z0-9-]+)-${LARGEST_WIDTH}\\.webp$`);

/** Hapus semua varian file dari URL upload. Aman dipanggil untuk URL non-upload (diabaikan). */
export async function deleteImage(url: string | null | undefined): Promise<void> {
  const video = url?.match(VIDEO_URL_RE);
  if (video) {
    await rm(path.join(uploadRoot(), video[1], `${video[2]}.mp4`), { force: true }).catch((e) =>
      console.error("[media] gagal hapus file:", e),
    );
    return;
  }
  const m = url?.match(UPLOAD_URL_RE);
  if (!m) return;
  await Promise.all(
    IMAGE_WIDTHS.map((w) => rm(path.join(uploadRoot(), m[1], `${m[2]}-${w}.webp`), { force: true })),
  ).catch((e) => console.error("[media] gagal hapus file:", e));
}

/** Hapus file lama kalau URL gambar berubah. */
export async function deleteReplacedImage(oldUrl: string | null | undefined, newUrl: string | null | undefined) {
  if (oldUrl && oldUrl !== newUrl) await deleteImage(oldUrl);
}
