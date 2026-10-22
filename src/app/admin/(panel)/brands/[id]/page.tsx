import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import { Card } from "@/components/admin/fields";
import { getBrandForAdmin, requireAdmin } from "@/lib/admin";
import { deleteBrand, updateBrand } from "../actions";
import BrandForm from "../BrandForm";

export const metadata = { title: "Profil Brand" };

export default async function BrandInfoPage({ params }: { params: Promise<{ id: string }> }) {
  const brand = await getBrandForAdmin((await params).id);
  const admin = await requireAdmin();

  return (
    <div className="space-y-6">
      <Card title="Info & tampilan brand">
        <BrandForm action={updateBrand.bind(null, brand.id)} brand={brand} />
      </Card>

      {admin.role === "SUPER_ADMIN" && (
        <Card title="Zona berbahaya">
          <p className="mb-3 text-sm text-gray-600">
            Menghapus brand juga menghapus semua menu, galeri, promo, cabang, konten, domain, dan data analitiknya.
          </p>
          <form action={deleteBrand.bind(null, brand.id)}>
            <ConfirmSubmit message={`Hapus brand "${brand.name}" beserta SEMUA datanya? Tindakan ini tidak bisa dibatalkan.`}>
              Hapus brand
            </ConfirmSubmit>
          </form>
        </Card>
      )}
    </div>
  );
}
