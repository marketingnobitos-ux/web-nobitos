import { NextResponse } from "next/server";
import { getAdmin, hasBrandAccess } from "@/lib/admin";
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  MediaError,
  maxUploadBytes,
  maxVideoBytes,
  saveImage,
  saveVideo,
} from "@/lib/media";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// Upload 1 file untuk sebuah brand: gambar -> dioptimasi sharp; video MP4 -> disimpan apa adanya. -> { url }.
export async function POST(req: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Belum login." }, { status: 401 });

  // Batas kasar untuk seluruh request (video paling besar); dicek lagi per jenis file di bawah.
  const hardMax = Math.max(maxUploadBytes(), maxVideoBytes());
  if (Number(req.headers.get("content-length") ?? 0) > hardMax + 1024 * 1024) {
    return NextResponse.json({ error: `Ukuran file maksimal ${Math.round(hardMax / 1024 / 1024)} MB.` }, { status: 413 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Form upload tidak valid." }, { status: 400 });
  }

  const file = form.get("file");
  const brandId = form.get("brandId");
  if (!(file instanceof File) || typeof brandId !== "string") {
    return NextResponse.json({ error: "File atau brand tidak ada." }, { status: 400 });
  }

  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
  if (!isVideo && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Format harus JPG, PNG, WebP, atau video MP4." }, { status: 415 });
  }
  const maxBytes = isVideo ? maxVideoBytes() : maxUploadBytes();
  if (file.size > maxBytes) {
    return NextResponse.json({ error: `Ukuran file maksimal ${Math.round(maxBytes / 1024 / 1024)} MB.` }, { status: 413 });
  }

  const brand = await prisma.brand.findUnique({ where: { id: brandId }, select: { id: true, slug: true } });
  if (!brand || !(await hasBrandAccess(admin, brand.id))) {
    return NextResponse.json({ error: "Brand tidak ditemukan." }, { status: 404 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const logo = form.get("kind") === "logo";
    const url = isVideo ? await saveVideo(buffer, brand.slug) : await saveImage(buffer, brand.slug, { logo });
    return NextResponse.json({ url });
  } catch (e) {
    if (e instanceof MediaError) return NextResponse.json({ error: e.message }, { status: 422 });
    console.error("[upload] gagal:", e);
    return NextResponse.json({ error: "Gagal memproses file." }, { status: 500 });
  }
}
