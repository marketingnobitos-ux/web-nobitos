import Link from "next/link";
import ActionForm from "@/components/admin/ActionForm";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import { Card, TextField } from "@/components/admin/fields";
import { getBrandForAdmin } from "@/lib/admin";
import { formatRupiah } from "@/lib/format";
import { imageVariant } from "@/lib/image";
import { prisma } from "@/lib/prisma";
import { createCategory, deleteCategory, updateCategory } from "./actions";

export const metadata = { title: "Menu" };

export default async function BrandMenuAdmin({ params }: { params: Promise<{ id: string }> }) {
  const brand = await getBrandForAdmin((await params).id);
  const categories = await prisma.menuCategory.findMany({
    where: { brandId: brand.id },
    orderBy: { order: "asc" },
    include: { items: { orderBy: [{ order: "asc" }, { createdAt: "asc" }] } },
  });

  return (
    <div className="space-y-6">
      <Card title="Kategori">
        <div className="space-y-3">
          {categories.map((c) => (
            <div key={c.id} className="flex flex-wrap items-end gap-3 border-b border-gray-100 pb-3 last:border-0">
              <ActionForm action={updateCategory.bind(null, brand.id, c.id)} className="flex flex-1 flex-wrap items-end gap-3" submitLabel="Simpan">
                <div className="min-w-40 flex-1">
                  <TextField label="Nama" name="name" required defaultValue={c.name} />
                </div>
                <div className="w-24">
                  <TextField label="Urutan" name="order" type="number" min={0} defaultValue={c.order} />
                </div>
              </ActionForm>
              <form action={deleteCategory.bind(null, brand.id, c.id)}>
                <ConfirmSubmit message={`Hapus kategori "${c.name}" beserta ${c.items.length} menu di dalamnya?`} />
              </form>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-md bg-gray-50 p-4">
          <p className="mb-2 text-sm font-medium">Tambah kategori</p>
          <ActionForm action={createCategory.bind(null, brand.id)} className="flex flex-wrap items-end gap-3" submitLabel="Tambah" resetOnSuccess>
            <div className="min-w-40 flex-1">
              <TextField label="Nama" name="name" required placeholder="mis. Minuman" />
            </div>
            <div className="w-24">
              <TextField label="Urutan" name="order" type="number" min={0} defaultValue={categories.length} />
            </div>
          </ActionForm>
        </div>
      </Card>

      <Card
        title="Daftar menu"
        actions={
          categories.length > 0 && (
            <Link href={`/admin/brands/${brand.id}/menu/new`} className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">
              + Tambah menu
            </Link>
          )
        }
      >
        {categories.length === 0 && <p className="text-sm text-gray-500">Buat kategori dulu sebelum menambah menu.</p>}
        <div className="space-y-6">
          {categories.map((c) => (
            <div key={c.id}>
              <h3 className="mb-2 font-semibold">{c.name}</h3>
              {c.items.length === 0 ? (
                <p className="text-sm text-gray-500">Belum ada menu.</p>
              ) : (
                <ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
                  {c.items.map((item) => (
                    <li key={item.id}>
                      <Link href={`/admin/brands/${brand.id}/menu/${item.id}`} className="flex items-center gap-3 p-3 hover:bg-gray-50">
                        {item.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={imageVariant(item.imageUrl, 400)} alt="" className="h-12 w-12 rounded object-cover" />
                        ) : (
                          <span className="flex h-12 w-12 items-center justify-center rounded bg-gray-100 text-gray-400">—</span>
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{item.name}</span>
                          <span className="text-sm text-gray-600">
                            {formatRupiah(item.price)}
                            {item.portion && ` · ${item.portion}`}
                          </span>
                        </span>
                        <span className="flex shrink-0 flex-col items-end gap-1 text-xs">
                          {item.isFeatured && <span className="rounded bg-amber-100 px-2 py-0.5 text-amber-800">Andalan</span>}
                          {!item.isAvailable && <span className="rounded bg-gray-200 px-2 py-0.5 text-gray-700">Tidak tersedia</span>}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
