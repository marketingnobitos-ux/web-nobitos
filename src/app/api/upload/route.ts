import { NextResponse } from "next/server";
import { getAdmin, hasBrandAccess } from "@/lib/admin";
import { ALLOWED_IMAGE_TYPES, MediaError, maxUploadBytes, saveImage } from "@/lib/media";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// Upload 1 gambar untuk sebuah brand -> dioptimasi sharp -> { url }.
export async function POST(req: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Belum login." }, { status: 401 });

  const maxBytes = maxUploadBytes();
  const maxMb = Math.round(maxBytes / 1024 / 1024);
  // Tolak lebih awal kalau jelas terlalu besar (+1 MB toleransi untuk overhead multipart).
  if (Number(req.headers.get("content-length") ?? 0) > maxBytes + 1024 * 1024) {
    return NextResponse.json({ error: `Ukuran file maksimal ${maxMb} MB.` }, { status: 413 });
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
  if (file.size > maxBytes) {
    return NextResponse.json({ error: `Ukuran file maksimal ${maxMb} MB.` }, { status: 413 });
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Format gambar harus JPG, PNG, atau WebP." }, { status: 415 });
  }

  const brand = await prisma.brand.findUnique({ where: { id: brandId }, select: { id: true, slug: true } });
  if (!brand || !(await hasBrandAccess(admin, brand.id))) {
    return NextResponse.json({ error: "Brand tidak ditemukan." }, { status: 404 });
  }

  try {
    const url = await saveImage(Buffer.from(await file.arrayBuffer()), brand.slug);
    return NextResponse.json({ url });
  } catch (e) {
    if (e instanceof MediaError) return NextResponse.json({ error: e.message }, { status: 422 });
    console.error("[upload] gagal:", e);
    return NextResponse.json({ error: "Gagal memproses gambar." }, { status: 500 });
  }
}
