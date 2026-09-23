import Link from "next/link";
import { Card, PublishBadge } from "@/components/admin/fields";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Dashboard" };

// Dashboard ringkas. Grafik analitik pengunjung/klik menyusul di Milestone 5.
export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  const brands = await prisma.brand.findMany({
    where: admin.role === "SUPER_ADMIN" ? {} : { admins: { some: { adminId: admin.id } } },
    orderBy: { name: "asc" },
    include: { _count: { select: { menuItems: true, branches: true, promos: true, albums: true, domains: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-600">Ringkasan konten per brand. Statistik pengunjung hadir di Milestone 5.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Brand" value={brands.length} />
        <Stat label="Brand tayang" value={brands.filter((b) => b.isPublished).length} />
        <Stat label="Total menu" value={brands.reduce((n, b) => n + b._count.menuItems, 0)} />
      </div>

      <Card title="Brand">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b text-gray-500">
              <tr>
                <th className="py-2 pr-4">Brand</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Menu</th>
                <th className="py-2 pr-4">Cabang</th>
                <th className="py-2 pr-4">Promo</th>
                <th className="py-2 pr-4">Album</th>
                <th className="py-2">Domain</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((b) => (
                <tr key={b.id} className="border-b last:border-0">
                  <td className="py-2 pr-4">
                    <Link href={`/admin/brands/${b.id}`} className="flex items-center gap-2 font-medium hover:underline">
                      <span className="h-3 w-3 rounded-full" style={{ background: b.colorPrimary }} />
                      {b.name}
                    </Link>
                  </td>
                  <td className="py-2 pr-4">
                    <PublishBadge published={b.isPublished} />
                  </td>
                  <td className="py-2 pr-4">{b._count.menuItems}</td>
                  <td className="py-2 pr-4">{b._count.branches}</td>
                  <td className="py-2 pr-4">{b._count.promos}</td>
                  <td className="py-2 pr-4">{b._count.albums}</td>
                  <td className="py-2">{b._count.domains}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
    </div>
  );
}
