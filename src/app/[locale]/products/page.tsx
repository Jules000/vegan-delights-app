import { getAllStoreProducts } from "@/app/actions/store";
import ProductCard from "@/components/ui/ProductCard";

export default async function ProductsPage() {
  const { products } = await getAllStoreProducts();

  return (
    <div className="py-24 max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h1 className="font-serif text-5xl mb-6">Our Collection</h1>
        <p className="text-forest-green/60 dark:text-soft-cream/60 max-w-2xl mx-auto">
          Explore our artisanally crafted vegan products, ranging from next-gen meats to organic pantry staples. Every item is 100% plant-based and cruelty-free.
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product: any) => (
            <div key={product.id} className="flex justify-center">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full text-center py-32 border-2 border-dashed border-forest-green/10 rounded-2xl">
          <span className="material-symbols-outlined text-6xl text-forest-green/20 mb-4">inventory_2</span>
          <p className="text-forest-green/50 font-bold text-lg">No products available at the moment.</p>
          <p className="text-forest-green/40 mt-2">Come back soon for exciting vegan alternatives!</p>
        </div>
      )}
    </div>
  );
}
