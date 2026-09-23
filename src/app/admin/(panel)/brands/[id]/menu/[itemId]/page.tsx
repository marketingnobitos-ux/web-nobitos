import Link from "next/link";
import { notFound } from "next/navigation";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import { Card } from "@/components/admin/fields";
import { getBrandForAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { deleteMenuItem, updateMenuItem } from "../actions";
import MenuItemForm from "../MenuItemForm";

export const metadata = { title: "Ubah Menu" };

export default async function EditMenuItemPage({ params }: { params: Promise<{ id: string; itemId: string }> }) {
  const { id, itemId } = await params;
  const brand = await getBrandForAdmin(id);
  const [item, categories] = await Promise.all([
    prisma.menuItem.findFirst({ where: { id: itemId, brandId: brand.id } }),
    prisma.menuCategory.findMany({ where: { brandId: brand.id }, orderBy: { order: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!item) notFound();

  return (
    <div className="space-y-6">
      <Card title={`Ubah: ${item.name}`} actions={<Link href={`/admin/brands/${brand.id}/menu`} className="text-sm hover:underline">← Kembali</Link>}>
        <MenuItemForm action={updateMenuItem.bind(null, brand.id, item.id)} brandId={brand.id} categories={categories} item={item} />
      </Card>
      <Card>
        <form action={deleteMenuItem.bind(null, brand.id, item.id)}>
          <ConfirmSubmit message={`Hapus menu "${item.name}"?`}>Hapus menu</ConfirmSubmit>
        </form>
      </Card>
    </div>
  );
}
