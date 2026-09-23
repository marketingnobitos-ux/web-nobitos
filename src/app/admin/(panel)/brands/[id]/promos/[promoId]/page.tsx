import Link from "next/link";
import { notFound } from "next/navigation";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import { Card } from "@/components/admin/fields";
import { getBrandForAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { deletePromo, updatePromo } from "../actions";
import PromoForm from "../PromoForm";

export const metadata = { title: "Ubah Promo" };

export default async function EditPromoPage({ params }: { params: Promise<{ id: string; promoId: string }> }) {
  const { id, promoId } = await params;
  const brand = await getBrandForAdmin(id);
  const promo = await prisma.promo.findFirst({ where: { id: promoId, brandId: brand.id } });
  if (!promo) notFound();

  return (
    <div className="space-y-6">
      <Card title={`Ubah: ${promo.title}`} actions={<Link href={`/admin/brands/${brand.id}/promos`} className="text-sm hover:underline">← Kembali</Link>}>
        <PromoForm action={updatePromo.bind(null, brand.id, promo.id)} brandId={brand.id} promo={promo} />
      </Card>
      <Card>
        <form action={deletePromo.bind(null, brand.id, promo.id)}>
          <ConfirmSubmit message={`Hapus promo "${promo.title}"?`}>Hapus promo</ConfirmSubmit>
        </form>
      </Card>
    </div>
  );
}
