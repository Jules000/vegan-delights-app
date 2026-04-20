'use client';

import { useState, useEffect, useCallback } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import { getAllStoreProducts } from '@/app/actions/store';
import { useSearchParams } from 'next/navigation';

interface Subcategory {
  id: string;
  nameFr: string;
  nameEn: string;
  slug: string;
  productType: string;
  order: number;
}

interface ProductListingProps {
  type: 'RESTAURANT' | 'SHOP';
  initialData: {
    products: any[];
    totalPages: number;
    currentPage: number;
    totalCount: number;
  };
  subcategories: Subcategory[];
}

const CATEGORIES = [
  { id: 'ALL', fr: 'Tous', en: 'All' },
  { id: 'VEGAN', fr: 'Vegan', en: 'Vegan' },
  { id: 'VEGETARIAN', fr: 'Végétarien', en: 'Vegetarian' },
];

export default function ProductListing({ type, initialData, subcategories }: ProductListingProps) {
  const locale = useLocale();
  const [products, setProducts] = useState(initialData.products);
  const [totalPages, setTotalPages] = useState(initialData.totalPages);
  const [currentPage, setCurrentPage] = useState(initialData.currentPage);
  
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activeSubcategories, setActiveSubcategories] = useState<string[]>([]);
  const [isGlutenFree, setIsGlutenFree] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);

  // Initialize filters from URL on mount
  useEffect(() => {
    const subParam = searchParams.get('subcategory');
    if (subParam) {
      setActiveSubcategories(subParam.split(','));
    }
    const catParam = searchParams.get('category');
    if (catParam) {
      setActiveCategory(catParam);
    }
    const gfParam = searchParams.get('glutenFree');
    if (gfParam === 'true') {
      setIsGlutenFree(true);
    }
  }, [searchParams]);

  // Subcategories are already filtered by type from the page, but just in case
  const filteredSubcategories = subcategories
    .filter(s => s.productType === type)
    .sort((a, b) => a.order - b.order);

  const subOrder = filteredSubcategories.map(s => s.id);

  const [isMount, setIsMount] = useState(true);

  const fetchProducts = useCallback(async (page: number, cat: string, subs: string[], gf: boolean) => {
    setIsLoading(true);
    try {
      const result = await getAllStoreProducts({
        type,
        category: cat === 'ALL' ? undefined : cat,
        subcategory: subs.length > 0 ? subs : undefined, // Note: action might need update for IDs
        isGlutenFree: gf,
        page,
        limit: 12
      });
      setProducts(result.products);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  useEffect(() => {
    if (isMount) {
      setIsMount(false);
      return;
    }
    
    fetchProducts(currentPage, activeCategory, activeSubcategories, isGlutenFree);
  }, [activeCategory, activeSubcategories, isGlutenFree, currentPage, fetchProducts]);

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubcategoryToggle = (subId: string) => {
    setActiveSubcategories(prev => 
      prev.includes(subId) ? prev.filter(s => s !== subId) : [...prev, subId]
    );
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGlutenFreeToggle = () => {
    setIsGlutenFree(prev => !prev);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (p: number) => {
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Group products by subcategory ID
  const groupedProducts = products.reduce((acc: any, product) => {
    const subId = product.subcategoryId || 'OTHER';
    if (!acc[subId]) acc[subId] = [];
    acc[subId].push(product);
    return acc;
  }, {});

  return (
    <div className="flex flex-col lg:flex-row gap-12 py-12">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-72 flex-none">
        <div className="sticky top-32 space-y-10">
          
          {/* Main Category Filter */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-forest-green/40 dark:text-soft-cream/40 mb-6">
              {locale === 'en' ? 'Lifestyle' : 'Régime'}
            </h3>
            <div className="flex flex-col gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`text-left px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-between group ${
                    activeCategory === cat.id 
                    ? 'bg-primary text-forest-green shadow-lg shadow-primary/20 scale-[1.02]' 
                    : 'hover:bg-forest-green/5 dark:hover:bg-soft-cream/5 text-forest-green/60 dark:text-soft-cream/60'
                  }`}
                >
                  {locale === 'en' ? cat.en : cat.fr}
                  <span className={`material-symbols-outlined text-sm transition-transform group-hover:translate-x-1 ${activeCategory === cat.id ? 'opacity-100' : 'opacity-0'}`}>
                    chevron_right
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Subcategory Filter (Multi-select) */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-forest-green/40 dark:text-soft-cream/40 mb-6">
              {locale === 'en' ? 'Categories' : 'Catégories'}
            </h3>
            <div className="flex flex-col gap-3">
              {filteredSubcategories.map((sub) => {
                const isActive = activeSubcategories.includes(sub.id);
                const label = locale === 'en' ? sub.nameEn : sub.nameFr;
                return (
                  <button
                    key={sub.id}
                    onClick={() => handleSubcategoryToggle(sub.id)}
                    className="flex items-center gap-3 group text-left transition-colors"
                  >
                    <div className={`size-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                      isActive 
                      ? 'bg-primary border-primary text-forest-green shadow-md' 
                      : 'border-forest-green/20 group-hover:border-primary/50'
                    }`}>
                      {isActive && <span className="material-symbols-outlined text-sm font-bold">check</span>}
                    </div>
                    <span className={`text-sm font-bold transition-colors ${isActive ? 'text-forest-green dark:text-soft-cream' : 'text-forest-green/60 dark:text-soft-cream/60 group-hover:text-forest-green'}`}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gluten Free Toggle */}
          <div className="pt-2">
            <button
              onClick={handleGlutenFreeToggle}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all group ${
                isGlutenFree 
                ? 'bg-terracotta/10 border-terracotta text-terracotta' 
                : 'bg-white dark:bg-soft-cream/5 border-forest-green/5 dark:border-soft-cream/5 text-forest-green/60 dark:text-soft-cream/60 hover:border-terracotta/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined transition-colors ${isGlutenFree ? 'text-terracotta' : 'text-forest-green/30'}`}>
                  {isGlutenFree ? 'verified' : 'eco'}
                </span>
                <span className="font-bold text-sm">
                  {locale === 'en' ? 'Gluten Free' : 'Sans Gluten'}
                </span>
              </div>
              <div className={`size-5 rounded-full border-2 transition-all flex items-center justify-center ${
                isGlutenFree ? 'bg-terracotta border-terracotta' : 'border-forest-green/20'
              }`}>
                {isGlutenFree && <div className="size-2 bg-white rounded-full shadow-inner" />}
              </div>
            </button>
          </div>

          <div className="p-6 bg-terracotta/5 rounded-2xl border border-terracotta/10">
            <h4 className="font-serif text-lg text-terracotta mb-2">
              {locale === 'en' ? 'Quality Guaranteed' : 'Qualité Garantie'}
            </h4>
            <p className="text-xs text-terracotta/70 leading-relaxed italic">
              {locale === 'en' 
                ? 'Every product in our collection is strictly selected to meet the highest plant-based standards.'
                : 'Chaque produit de notre collection est rigoureusement sélectionné pour répondre aux standards végétaliens les plus élevés.'}
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-32"
            >
              <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg shadow-primary/20"></div>
            </motion.div>
          ) : products.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-24"
            >
              {filteredSubcategories.map((sub) => {
                const subProducts = groupedProducts[sub.id];
                if (!subProducts || subProducts.length === 0) return null;

                const label = locale === 'en' ? sub.nameEn : sub.nameFr;

                return (
                  <section key={sub.id}>
                    <div className="flex items-center gap-6 mb-12">
                      <h2 className="font-serif text-3xl font-black text-forest-green dark:text-soft-cream whitespace-nowrap">
                        {label}
                      </h2>
                      <div className="h-px bg-forest-green/10 dark:bg-soft-cream/10 flex-1"></div>
                      <span className="text-xs font-black uppercase tracking-widest text-forest-green/30 px-3 py-1 bg-forest-green/5 rounded-full">
                        {subProducts.length} {locale === 'en' ? 'items' : 'produits'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
                      {subProducts.map((p: any) => (
                        <ProductCard key={p.id} product={p} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </motion.div>
          ) : (
            <div className="w-full text-center py-40 border-2 border-dashed border-forest-green/10 rounded-3xl bg-white/30 backdrop-blur-sm">
              <span className="material-symbols-outlined text-7xl text-forest-green/10 mb-6">inventory_2</span>
              <p className="text-forest-green/40 font-black text-xl tracking-tight">
                {locale === 'en' 
                  ? 'No products match your current filters.' 
                  : 'Aucun produit ne correspond à ces critères.'}
              </p>
              <button 
                onClick={() => {
                  setActiveCategory('ALL');
                  setActiveSubcategories([]);
                  setIsGlutenFree(false);
                  setCurrentPage(1);
                }}
                className="mt-8 px-8 py-3 bg-forest-green text-white dark:bg-primary dark:text-forest-green rounded-xl font-bold shadow-xl shadow-forest-green/20 hover:scale-105 active:scale-95 transition-all"
              >
                {locale === 'en' ? 'Clear all filters' : 'Réinitialiser les filtres'}
              </button>
            </div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-24 flex justify-center gap-3">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`size-12 rounded-xl font-black transition-all shadow-sm ${
                  currentPage === i + 1
                  ? 'bg-forest-green text-white dark:bg-primary dark:text-forest-green shadow-xl scale-110'
                  : 'bg-white dark:bg-soft-cream/5 border border-forest-green/10 hover:border-primary text-forest-green dark:text-soft-cream'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
