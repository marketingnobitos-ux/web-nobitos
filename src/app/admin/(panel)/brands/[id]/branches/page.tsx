import Link from "next/link";
import { Card } from "@/components/admin/fields";
import { getBrandForAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Cabang" };

export default async function BrandBranchesAdmin({ params }: { params: Promise<{ id: string }> }) {
  const brand = await getBrandForAdmin((await params).id);
  const branches = await prisma.branch.findMany({ where: { brandId: brand.id }, orderBy: { order: "asc" } });

  return (
    <Card
      title="Cabang"
      actions={
        <Link href={`/admin/brands/${brand.id}/branches/new`} className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">
          + Tambah cabang
        </Link>
      }
    >
      {branches.length === 0 ? (
        <p className="text-sm text-gray-500">Belum ada cabang.</p>
      ) : (
        <ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
          {branches.map((b) => (
            <li key={b.id}>
              <Link href={`/admin/brands/${brand.id}/branches/${b.id}`} className="block p-3 hover:bg-gray-50">
                <span className="font-medium">{b.name}</span>
                <span className="block text-sm text-gray-600">{b.address}</span>
                <span className="block text-xs text-gray-500">
                  {[b.openHours, b.whatsapp && `WA ${b.whatsapp}`, b.phone && `Telp ${b.phone}`].filter(Boolean).join(" · ") ||
                    "Jam buka & kontak belum diisi"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
