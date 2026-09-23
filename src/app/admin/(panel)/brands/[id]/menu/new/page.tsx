import Link from "next/link";
import { Card } from "@/components/admin/fields";
import { getBrandForAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { createMenuItem } from "../actions";
import MenuItemForm from "../MenuItemForm";

export const metadata = { title: "Tambah Menu" };

export default async function NewMenuItemPage({ params }: { params: Promise<{ id: string }> }) {
  const brand = await getBrandForAdmin((await params).id);
  const categories = await prisma.menuCategory.findMany({
    where: { brandId: brand.id },
    orderBy: { order: "asc" },
    select: { id: true, name: true },
  });

  return (
    <Card title="Tambah menu" actions={<Link href={`/admin/brands/${brand.id}/menu`} className="text-sm hover:underline">← Kembali</Link>}>
      {categories.length ? (
        <MenuItemForm action={createMenuItem.bind(null, brand.id)} brandId={brand.id} categories={categories} submitLabel="Tambah menu" />
      ) : (
        <p className="text-sm text-gray-500">Buat kategori dulu di halaman Menu.</p>
      )}
    </Card>
  );
}
