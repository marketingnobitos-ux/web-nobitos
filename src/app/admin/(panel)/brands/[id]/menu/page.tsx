import Link from "next/link";
import ActionForm from "@/components/admin/ActionForm";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import PendingButton from "@/components/admin/PendingButton";
import { Card, TextField } from "@/components/admin/fields";
import { getBrandForAdmin } from "@/lib/admin";
import { formatRupiah } from "@/lib/format";
import { imageVariant } from "@/lib/image";
import { prisma } from "@/lib/prisma";
import { createCategory, deleteCategory, moveCategory, moveMenuItem, toggleMenuItem, updateCategory } from "./actions";

export const metadata = { title: "Menu" };

const arrowBtn = "flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900";

/** Tombol ▲/▼ untuk menggeser urutan (form server action). */
function MoveButtons({ up, down, first, last, label }: { up: () => Promise<void>; down: () => Promise<void>; first: boolean; last: boolean; label: string }) {
  return (
    <div className="flex gap-1">
      <form action={up}>
        <PendingButton disabled={first} className={arrowBtn} aria-label={`Naikkan ${label}`} title="Naikkan">
          ▲
        </PendingButton>
      </form>
      <form action={down}>
        <PendingButton disabled={last} className={arrowBtn} aria-label={`Turunkan ${label}`} title="Turunkan">
          ▼
        </PendingButton>
      </form>
    </div>
  );
}

function Toggle({ action, on, onLabel, offLabel, onCls, label }: { action: () => Promise<void>; on: boolean; onLabel: string; offLabel: string; onCls: string; label: string }) {
  return (
    <form action={action}>
      <PendingButton
        aria-pressed={on}
        aria-label={`${label}: ${on ? onLabel : offLabel}. Klik untuk mengubah.`}
        className={`min-w-[5.5rem] rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
          on ? onCls : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
        }`}
      >
        {on ? onLabel : offLabel}
      </PendingButton>
    </form>
  );
}

export default async function BrandMenuAdmin({ params }: { params: Promise<{ id: string }> }) {
  const brand = await getBrandForAdmin((await params).id);
  const categories = await prisma.menuCategory.findMany({
    where: { brandId: brand.id },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: { items: { orderBy: [{ order: "asc" }, { createdAt: "asc" }] } },
  });
  const all = categories.flatMap((c) => c.items);
  const soldOut = all.filter((i) => !i.isAvailable).length;
  const featured = all.filter((i) => i.isFeatured).length;
  const noPhoto = all.filter((i) => !i.imageUrl).length;

  return (
    <div className="space-y-6">
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
        {categories.length === 0 ? (
          <p className="text-sm text-gray-500">Buat kategori dulu (bagian Kategori di bawah) sebelum menambah menu.</p>
        ) : (
          <p className="mb-4 text-sm text-gray-600">
            {all.length} menu · {featured} andalan · {soldOut} habis · {noPhoto} tanpa foto. Klik tombol status untuk mengubah langsung; klik nama untuk
            mengubah detail.
          </p>
        )}
        <div className="space-y-6">
          {categories.map((c) => (
            <div key={c.id}>
              <h3 className="mb-2 font-semibold">
                {c.name} <span className="text-sm font-normal text-gray-500">· {c.items.length}</span>
              </h3>
              {c.items.length === 0 ? (
                <p className="text-sm text-gray-500">Belum ada menu.</p>
              ) : (
                <ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
                  {c.items.map((item, idx) => (
                    <li key={item.id} className={`flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:gap-3 ${item.isAvailable ? "" : "bg-gray-50"}`}>
                      <Link href={`/admin/brands/${brand.id}/menu/${item.id}`} className="group flex min-w-0 items-center gap-3 sm:flex-1">
                        {item.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={imageVariant(item.imageUrl, 400)}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            width={48}
                            height={48}
                            className={`h-12 w-12 shrink-0 rounded object-cover ${item.isAvailable ? "" : "opacity-50 grayscale"}`}
                          />
                        ) : (
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-gray-100 text-[10px] text-gray-400">Tanpa foto</span>
                        )}
                        <span className="min-w-0">
                          <span className="block truncate font-medium group-hover:underline">{item.name}</span>
                          <span className="text-sm text-gray-600">
                            {formatRupiah(item.price)}
                            {item.portion && ` · ${item.portion}`}
                          </span>
                        </span>
                      </Link>
                      <div className="flex shrink-0 flex-wrap items-center gap-2">
                        <Toggle
                          action={toggleMenuItem.bind(null, brand.id, item.id, "isAvailable")}
                          on={item.isAvailable}
                          onLabel="Tersedia"
                          offLabel="Habis"
                          onCls="border-green-200 bg-green-50 text-green-800 hover:bg-green-100"
                          label={`Status ${item.name}`}
                        />
                        <Toggle
                          action={toggleMenuItem.bind(null, brand.id, item.id, "isFeatured")}
                          on={item.isFeatured}
                          onLabel="★ Andalan"
                          offLabel="☆ Andalan"
                          onCls="border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
                          label={`Andalan ${item.name}`}
                        />
                        <MoveButtons
                          up={moveMenuItem.bind(null, brand.id, item.id, -1)}
                          down={moveMenuItem.bind(null, brand.id, item.id, 1)}
                          first={idx === 0}
                          last={idx === c.items.length - 1}
                          label={item.name}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card title="Kategori">
        {categories.length > 0 && (
          <ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
            {categories.map((c, idx) => (
              <li key={c.id} className="flex flex-wrap items-end gap-3 p-3">
                <MoveButtons
                  up={moveCategory.bind(null, brand.id, c.id, -1)}
                  down={moveCategory.bind(null, brand.id, c.id, 1)}
                  first={idx === 0}
                  last={idx === categories.length - 1}
                  label={`kategori ${c.name}`}
                />
                <ActionForm action={updateCategory.bind(null, brand.id, c.id)} className="flex min-w-0 flex-1 flex-wrap items-end gap-3" submitLabel="Simpan nama">
                  <input type="hidden" name="order" value={c.order} />
                  <div className="min-w-40 flex-1">
                    <TextField label="Nama" name="name" required defaultValue={c.name} />
                  </div>
                </ActionForm>
                <form action={deleteCategory.bind(null, brand.id, c.id)}>
                  <ConfirmSubmit message={`Hapus kategori "${c.name}" beserta ${c.items.length} menu di dalamnya?`} />
                </form>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 rounded-md bg-gray-50 p-4">
          <p className="mb-2 text-sm font-medium">Tambah kategori</p>
          <ActionForm action={createCategory.bind(null, brand.id)} className="flex flex-wrap items-end gap-3" submitLabel="Tambah" resetOnSuccess>
            <input type="hidden" name="order" value={Math.max(-1, ...categories.map((c) => c.order)) + 1} />
            <div className="min-w-40 flex-1">
              <TextField label="Nama" name="name" required placeholder="mis. Minuman" />
            </div>
          </ActionForm>
        </div>
      </Card>
    </div>
  );
}
