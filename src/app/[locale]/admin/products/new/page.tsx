import { getAdminSubcategories } from "@/app/actions/admin";
import ProductCreateForm from "./ProductCreateForm";

export default async function AdminNewProductPage() {
  const subcategories = await getAdminSubcategories();
  
  return <ProductCreateForm subcategories={subcategories} />;
}
