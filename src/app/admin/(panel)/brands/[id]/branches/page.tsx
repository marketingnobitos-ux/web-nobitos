import Link from "next/link";
import { Card, Notice } from "@/components/admin/fields";
import { getBrandForAdmin } from "@/lib/admin";
import { isCompleteWeek } from "@/lib/hours";
import { prisma } from "@/lib/prisma";
import { TEMPLATE_FEATURES } from "@/lib/template-features";

export const metadata = { title: "Cabang" };

function Flag({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ok ? "bg-green-50 text-green-700" : "bg-amber-100 text-amber-800"}`}>{children}</span>
  );
}

export default async function BrandBranchesAdmin({ params }: { params: Promise<{ id: string }> }) {
  const brand = await getBrandForAdmin((await params).id);
  const branches = await prisma.branch.findMany({ where: { brandId: brand.id }, orderBy: { order: "asc" }, include: { hours: true } });
  const features = TEMPLATE_FEATURES[brand.template];

  return (
    <div className="space-y-4">
      {!features.dbBranches && (
        <Notice tone="warn" title="Cabang di situs ini diatur di kode">
          <p>
            Template {brand.template} membaca alamat, jam, WA, dan Maps cabang dari <code className="rounded bg-white/70 px-1">{features.codeFile}</code>.
            Perubahan di halaman ini belum tampil di situs; minta developer mengubah file tersebut.
          </p>
        </Notice>
      )}
      <Card
        title={`Cabang (${branches.length})`}
        actions={
          <Link href={`/admin/brands/${brand.id}/branches/new`} className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">
            + Tambah cabang
          </Link>
        }
      >
        {branches.length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada cabang. Tambahkan minimal satu supaya alamat & tombol Maps muncul di situs.</p>
        ) : (
          <ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
            {branches.map((b) => {
              const fullWeek = isCompleteWeek(b.hours);
              return (
                <li key={b.id}>
                  <Link href={`/admin/brands/${brand.id}/branches/${b.id}`} className="block p-3 hover:bg-gray-50">
                    <span className="font-medium">{b.name}</span>
                    <span className="block text-sm text-gray-600">{b.address}</span>
                    <span className="mt-1 block text-xs text-gray-500">
                      {[b.openHours, b.whatsapp && `WA ${b.whatsapp}`, b.phone && `Telp ${b.phone}`].filter(Boolean).join(" · ") ||
                        "Jam buka & kontak belum diisi"}
                    </span>
                    <span className="mt-2 flex flex-wrap gap-1.5">
                      <Flag ok={fullWeek}>{fullWeek ? "Jam 7 hari lengkap" : "Jam 7 hari belum lengkap"}</Flag>
                      {!b.whatsapp && <Flag ok={false}>WA kosong</Flag>}
                      {!b.mapsUrl && <Flag ok={false}>Link Maps kosong</Flag>}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
