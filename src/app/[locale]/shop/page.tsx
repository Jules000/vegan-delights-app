import { getAllStoreProducts, getStoreSubcategories } from "@/app/actions/store";
import ProductListing from "@/components/layout/ProductListing";
import { getTranslations } from "next-intl/server";

export default async function ShopPage() {
  const t = await getTranslations('Index');
  const [initialData, subcategories] = await Promise.all([
    getAllStoreProducts({ type: 'SHOP', limit: 12 }),
    getStoreSubcategories('SHOP')
  ]);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-20 py-16">
      <div className="mb-16 border-l-4 border-terracotta pl-10 py-6">
        <h1 className="font-serif text-6xl font-black text-forest-green dark:text-soft-cream mb-4">
          La Boutique
        </h1>
        <p className="text-xl text-forest-green/60 dark:text-soft-cream/60 max-w-2xl leading-relaxed">
          Toute notre épicerie fine, notre boucherie végétale et nos produits bien-être. Le meilleur du lifestyle vegan à portée de main.
        </p>
      </div>

      <ProductListing type="SHOP" initialData={initialData} subcategories={subcategories} />
    </div>
  );
}
