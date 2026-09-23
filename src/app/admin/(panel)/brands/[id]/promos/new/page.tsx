import Link from "next/link";
import { Card } from "@/components/admin/fields";
import { getBrandForAdmin } from "@/lib/admin";
import { createPromo } from "../actions";
import PromoForm from "../PromoForm";

export const metadata = { title: "Tambah Promo" };

export default async function NewPromoPage({ params }: { params: Promise<{ id: string }> }) {
  const brand = await getBrandForAdmin((await params).id);
  return (
    <Card title="Tambah promo" actions={<Link href={`/admin/brands/${brand.id}/promos`} className="text-sm hover:underline">← Kembali</Link>}>
      <PromoForm action={createPromo.bind(null, brand.id)} brandId={brand.id} submitLabel="Tambah promo" />
    </Card>
  );
}
