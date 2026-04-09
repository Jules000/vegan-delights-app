import { getStoreProductBySlug } from "@/app/actions/store";
import ProductDetailsClient from "./ProductDetailsClient";
import { notFound } from "next/navigation";

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const { id } = await params;
  const product = await getStoreProductBySlug(id);

  if (!product) {
    notFound();
  }

  return <ProductDetailsClient product={product} />;
}
