import Link from "next/link";
import ActionForm from "@/components/admin/ActionForm";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import PendingButton from "@/components/admin/PendingButton";
import MenuFilter from "@/components/admin/MenuFilter";
import { Card, TextField } from "@/components/admin/fields";
import { getBrandForAdmin } from "@/lib/admin";
import { formatRupiah } from "@/lib/format";
import { imageVariant } from "@/lib/image";
import { prisma } from "@/lib/prisma";
import { TEMPLATE_FEATURES } from "@/lib/template-features";
import { createCategory, deleteCategory, moveCategory, moveMenuItem, toggleMenuItem, updateCategory } from "./actions";

export const metadata = { title: "Daftar Menu" };

const arrowBtn = "flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-sm text-gray-900 hover:border-gray-500";

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
    <form action={action} className="flex-1 sm:flex-none">
      <PendingButton
        aria-pressed={on}
        aria-label={`${label}: ${on ? onLabel : offLabel}. Klik untuk mengubah.`}
        className={`h-10 w-full min-w-[104px] rounded-full border px-3 text-[13px] font-bold transition-colors ${
          on ? onCls : "border-[#4a4a4a] text-[#c9ccc2] hover:border-[#8e918a]"
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
  const featured = all.filter((i) => i.isFeatured);
  const noPhoto = all.filter((i) => !i.imageUrl).length;
  const featuredNoPhoto = featured.filter((i) => !i.imageUrl).length;
  const showsPhotos = TEMPLATE_FEATURES[brand.template].menuPhotos;

  return (
    <div className="flex flex-col gap-6">
      <dl className="grid grid-cols-4 gap-2 sm:flex sm:flex-wrap sm:gap-10">
        {(
          [
            ["Total menu", all.length],
            ["Andalan", featured.length],
            ["Habis", soldOut],
            ["Tanpa foto", noPhoto],
          ] as const
        ).map(([label, n]) => (
          <div key={label}>
            <dt className="text-xs text-[#d4dcc8] sm:text-sm">{label}</dt>
            <dd className="mt-0.5 text-3xl font-semibold tabular-nums tracking-tight sm:mt-1.5 sm:text-[52px] sm:leading-none">{n}</dd>
          </div>
        ))}
      </dl>

      {categories.length === 0 ? (
        <div className="adm-light adm-card text-sm">Buat kategori dulu (kartu Kategori di bawah) sebelum menambah menu.</div>
      ) : (
        <div className="flex flex-wrap items-start gap-5">
          <div className="min-w-0 flex-[999_1_520px]">
            <MenuFilter
              categories={categories.map((c) => ({ id: c.id, name: c.name, count: c.items.length }))}
              addHref={`/admin/brands/${brand.id}/menu/new`}
            >
              {categories.map((c) => (
                <section key={c.id} data-cat={c.id} className="adm-dark flex flex-col gap-2.5 rounded-[28px] p-3.5 sm:rounded-[32px] sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 px-1.5 pb-1.5">
                    <h2 className="text-lg font-bold">{c.name}</h2>
                    <span className="hidden text-[13px] text-[#a9aca3] sm:inline">Klik status untuk ubah langsung · ▲▼ untuk urutan · klik nama untuk detail</span>
                  </div>
                  {c.items.length === 0 && <p className="px-1.5 text-sm text-[#a9aca3]">Belum ada menu.</p>}
                  {c.items.map((item, idx) => (
                    <div
                      key={item.id}
                      data-item={item.name.toLowerCase()}
                      className="flex flex-col gap-2.5 rounded-[20px] bg-[#232323] p-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3.5 sm:rounded-[22px] sm:px-3.5"
                    >
                      <Link href={`/admin/brands/${brand.id}/menu/${item.id}`} className="group flex min-w-0 items-center gap-3 sm:flex-[1_1_180px]">
                        {item.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={imageVariant(item.imageUrl, 400)}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            width={56}
                            height={56}
                            className={`h-12 w-12 shrink-0 rounded-[14px] object-cover sm:h-14 sm:w-14 sm:rounded-2xl ${item.isAvailable ? "" : "opacity-50 grayscale"}`}
                          />
                        ) : (
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#2e2e2e] text-center text-[9px] leading-tight text-[#a9aca3] sm:h-14 sm:w-14 sm:rounded-2xl sm:text-[10px]">
                            Tanpa foto
                          </span>
                        )}
                        <span className="min-w-0">
                          <span className="block truncate text-[15px] font-bold group-hover:underline sm:text-base">{item.name}</span>
                          <span className="block truncate text-[13px] text-[#a9aca3]">
                            {formatRupiah(item.price)}
                            {item.portion && ` · ${item.portion}`}
                          </span>
                        </span>
                      </Link>
                      <div className="flex items-center gap-1.5 sm:shrink-0">
                        <Toggle
                          action={toggleMenuItem.bind(null, brand.id, item.id, "isAvailable")}
                          on={item.isAvailable}
                          onLabel="Tersedia"
                          offLabel="Habis"
                          onCls="border-[#a6d27a] bg-[#a6d27a] text-[#141414]"
                          label={`Status ${item.name}`}
                        />
                        <Toggle
                          action={toggleMenuItem.bind(null, brand.id, item.id, "isFeatured")}
                          on={item.isFeatured}
                          onLabel="★ Andalan"
                          offLabel="☆ Andalan"
                          onCls="border-[#f5d58a] bg-[#f5d58a] text-[#141414]"
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
                    </div>
                  ))}
                </section>
              ))}
            </MenuFilter>
          </div>

          <aside className="flex min-w-0 flex-[1_1_300px] flex-col gap-5">
            <section className="adm-card adm-card-green flex flex-col gap-2.5">
              <h2 className="text-[17px] font-bold">Tampil di Beranda</h2>
              <p className="text-sm leading-relaxed text-[#d4dcc8]">
                {showsPhotos
                  ? `Menu andalan muncul sebagai kartu foto di Beranda situs. Saat ini ${featured.length} andalan${
                      featured.length ? (featuredNoPhoto ? `, ${featuredNoPhoto} belum punya foto.` : ", semua punya foto.") : "."
                    }`
                  : `Template brand ini menampilkan menu andalan tanpa foto. Saat ini ${featured.length} andalan.`}
              </p>
            </section>
          </aside>
        </div>
      )}

      <div id="kategori" className="scroll-mt-6">
        <Card title="Kategori">
          {categories.length > 0 && (
            <ul className="flex flex-col gap-2">
              {categories.map((c, idx) => (
                <li key={c.id} className="flex flex-wrap items-end gap-3 rounded-[20px] bg-white p-3">
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
          <div className="mt-4 rounded-[20px] bg-[#e3e6d4] p-4">
            <p className="mb-2 text-sm font-bold">Tambah kategori</p>
            <ActionForm action={createCategory.bind(null, brand.id)} className="flex flex-wrap items-end gap-3" submitLabel="Tambah" resetOnSuccess>
              <input type="hidden" name="order" value={Math.max(-1, ...categories.map((c) => c.order)) + 1} />
              <div className="min-w-40 flex-1">
                <TextField label="Nama" name="name" required placeholder="mis. Minuman" />
              </div>
            </ActionForm>
          </div>
        </Card>
      </div>
    </div>
  );
}
