import Link from "next/link";
import { Card } from "@/components/admin/fields";
import { getBrandForAdmin } from "@/lib/admin";
import { formatDate } from "@/lib/format";
import { imageVariant } from "@/lib/image";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Promo" };

function promoStatus(p: { isActive: boolean; startsAt: Date | null; endsAt: Date | null }) {
  const now = new Date();
  if (!p.isActive) return { label: "Nonaktif", cls: "bg-gray-100 text-gray-600" };
  if (p.startsAt && p.startsAt > now) return { label: "Terjadwal", cls: "bg-blue-100 text-blue-800" };
  if (p.endsAt && p.endsAt < now) return { label: "Berakhir", cls: "bg-gray-100 text-gray-600" };
  return { label: "Tayang", cls: "bg-green-100 text-green-800" };
}

export default async function BrandPromosAdmin({ params }: { params: Promise<{ id: string }> }) {
  const brand = await getBrandForAdmin((await params).id);
  const promos = await prisma.promo.findMany({ where: { brandId: brand.id }, orderBy: { order: "asc" } });

  return (
    <Card
      title="Promo"
      actions={
        <Link href={`/admin/brands/${brand.id}/promos/new`} className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">
          + Tambah promo
        </Link>
      }
    >
      {promos.length === 0 ? (
        <p className="text-sm text-gray-500">Belum ada promo.</p>
      ) : (
        <ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
          {promos.map((p) => {
            const status = promoStatus(p);
            return (
              <li key={p.id}>
                <Link href={`/admin/brands/${brand.id}/promos/${p.id}`} className="flex items-center gap-3 p-3 hover:bg-gray-50">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imageVariant(p.imageUrl, 400)} alt="" className="h-12 w-20 rounded object-cover" />
                  ) : (
                    <span className="flex h-12 w-20 items-center justify-center rounded bg-gray-100 text-gray-400">—</span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{p.title}</span>
                    <span className="text-xs text-gray-500">
                      {p.startsAt ? formatDate(p.startsAt) : "Sekarang"} – {p.endsAt ? formatDate(p.endsAt) : "tanpa batas"}
                    </span>
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.cls}`}>{status.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
