import { getAdminProductById, getAdminSubcategories } from "@/app/actions/admin";
import ProductEditForm from "./ProductEditForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, subcategories] = await Promise.all([
    getAdminProductById(id),
    getAdminSubcategories()
  ]);
  
  if (!product) {
    notFound();
  }

  return <ProductEditForm product={product} subcategories={subcategories} />;
}
