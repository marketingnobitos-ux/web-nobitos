import { notFound } from "next/navigation";
import { Card } from "@/components/admin/fields";
import { requireAdmin } from "@/lib/admin";
import { createBrand } from "../actions";
import BrandForm from "../BrandForm";

export const metadata = { title: "Tambah Brand" };

export default async function NewBrandPage() {
  const admin = await requireAdmin();
  if (admin.role !== "SUPER_ADMIN") notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tambah Brand</h1>
      <Card>
        <BrandForm action={createBrand} submitLabel="Buat brand" />
      </Card>
    </div>
  );
}
