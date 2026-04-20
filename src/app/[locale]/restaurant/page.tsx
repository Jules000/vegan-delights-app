import { getAllStoreProducts, getStoreSubcategories } from "@/app/actions/store";
import ProductListing from "@/components/layout/ProductListing";
import { getTranslations } from "next-intl/server";

export default async function RestaurantPage() {
  const t = await getTranslations('Index');
  const subcategories = await getStoreSubcategories('RESTAURANT');
  
  // Fetch first 4 products for each subcategory
  const productsBySub = await Promise.all(
    subcategories.map(async (sub) => {
      const result = await getAllStoreProducts({
        type: 'RESTAURANT',
        subcategory: sub.id,
        limit: 4
      });
      return { subId: sub.id, ...result };
    })
  );

  const initialData = {
    productsBySub: productsBySub.reduce((acc: any, curr) => {
      if (curr.products.length > 0) {
        acc[curr.subId] = {
          products: curr.products,
          page: 1,
          hasMore: curr.currentPage < curr.totalPages,
          isLoadingMore: false
        };
      }
      return acc;
    }, {})
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-20 py-16">
      <div className="mb-16 border-l-4 border-primary pl-10 py-6">
        <h1 className="font-serif text-6xl font-black text-forest-green dark:text-soft-cream mb-4">
          Le Restaurant
        </h1>
        <p className="text-xl text-forest-green/60 dark:text-soft-cream/60 max-w-2xl leading-relaxed">
          Découvrez notre cuisine gastronomique 100% végétale. Des plats chauds aux salades croquantes, savourez l'excellence éthique.
        </p>
      </div>

      <ProductListing type="RESTAURANT" initialData={initialData} subcategories={subcategories} />
    </div>
  );
}
