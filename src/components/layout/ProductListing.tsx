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

interface SubcategoryData {
  products: any[];
  page: number;
  hasMore: boolean;
  isLoadingMore: boolean;
}

interface ProductListingProps {
  type: 'RESTAURANT' | 'SHOP';
  initialData: {
    productsBySub?: Record<string, SubcategoryData>;
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
  const [dataBySub, setDataBySub] = useState<Record<string, SubcategoryData>>(initialData.productsBySub || {});
  const [isLoading, setIsLoading] = useState(false);
  
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activeSubcategories, setActiveSubcategories] = useState<string[]>([]);
  const [isGlutenFree, setIsGlutenFree] = useState(false);

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
    .filter((s: any) => s.productType === type)
    .sort((a, b) => a.order - b.order);

  const subOrder = filteredSubcategories.map((s: any) => s.id);

  const [isMount, setIsMount] = useState(true);

  const fetchInitialData = useCallback(async (cat: string, subs: string[], gf: boolean) => {
    setIsLoading(true);
    try {
      const activeSubs = subcategories.filter((s: any) => s.productType === type);
      const subData: Record<string, SubcategoryData> = {};
      
      // Fetch initial batch (4 products) for each subcategory in parallel
      await Promise.all(activeSubs.map(async (sub) => {
        // If specific subcategories are selected in the filter, only fetch those
        if (subs.length > 0 && !subs.includes(sub.id)) return;

        const result = await getAllStoreProducts({
          type,
          category: cat === 'ALL' ? undefined : cat,
          subcategory: sub.id,
          isGlutenFree: gf,
          page: 1,
          limit: 6
        });

        if (result.products.length > 0) {
          subData[sub.id] = {
            products: result.products,
            page: 1,
            hasMore: result.currentPage < result.totalPages,
            isLoadingMore: false
          };
        }
      }));

      setDataBySub(subData);
    } catch (error) {
      console.error("Failed to fetch initial products:", error);
    } finally {
      setIsLoading(false);
    }
  }, [type, subcategories]);

  useEffect(() => {
    if (isMount) {
      setIsMount(false);
      // We could use initialData here but for consistency/simplicity in this new model,
      // it's cleaner to just fetch what we need for each subcategory.
      fetchInitialData(activeCategory, activeSubcategories, isGlutenFree);
      return;
    }
    
    fetchInitialData(activeCategory, activeSubcategories, isGlutenFree);
  }, [activeCategory, activeSubcategories, isGlutenFree, fetchInitialData]);

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubcategoryToggle = (subId: string) => {
    setActiveSubcategories(prev => 
      prev.includes(subId) ? prev.filter((s: any) => s !== subId) : [...prev, subId]
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGlutenFreeToggle = () => {
    setIsGlutenFree(prev => !prev);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadMore = async (subId: string) => {
    const current = dataBySub[subId];
    if (!current || current.isLoadingMore) return;

    setDataBySub(prev => ({
      ...prev,
      [subId]: { ...prev[subId], isLoadingMore: true }
    }));

    try {
      const nextPage = current.page + 1;
      const result = await getAllStoreProducts({
        type,
        category: activeCategory === 'ALL' ? undefined : activeCategory,
        subcategory: subId,
        isGlutenFree,
        page: nextPage,
        limit: 6
      });

      setDataBySub(prev => ({
        ...prev,
        [subId]: {
          products: [...prev[subId].products, ...result.products],
          page: nextPage,
          hasMore: result.currentPage < result.totalPages,
          isLoadingMore: false
        }
      }));
    } catch (error) {
      console.error(`Failed to load more for subcategory ${subId}:`, error);
      setDataBySub(prev => ({
        ...prev,
        [subId]: { ...prev[subId], isLoadingMore: false }
      }));
    }
  };

  // No longer need global groupedProducts as it's handled by dataBySub

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
          ) : Object.keys(dataBySub).length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-32"
            >
              {filteredSubcategories.map((sub) => {
                const subData = dataBySub[sub.id];
                if (!subData || subData.products.length === 0) return null;

                const label = locale === 'en' ? sub.nameEn : sub.nameFr;

                return (
                  <section key={sub.id} className="relative">
                    <div className="flex items-center gap-6 mb-12">
                      <h2 className="font-serif text-4xl font-black text-forest-green dark:text-soft-cream whitespace-nowrap">
                        {label}
                      </h2>
                      <div className="h-px bg-forest-green/10 dark:bg-soft-cream/10 flex-1"></div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-forest-green/40 px-4 py-2 bg-forest-green/5 dark:bg-soft-cream/5 rounded-full border border-forest-green/5">
                         {locale === 'en' ? 'Collection' : 'Collection'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
                      <AnimatePresence mode="popLayout">
                        {subData.products.map((p: any) => (
                          <motion.div
                            key={p.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            layout
                          >
                            <ProductCard product={p} />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* Load More Button for this subcategory */}
                    {subData.hasMore && (
                      <div className="mt-16 flex justify-center">
                        <button
                          onClick={() => handleLoadMore(sub.id)}
                          disabled={subData.isLoadingMore}
                          className="group relative px-12 py-4 rounded-full overflow-hidden transition-all active:scale-95 disabled:opacity-70"
                        >
                          <div className="absolute inset-0 bg-forest-green dark:bg-primary opacity-5 group-hover:opacity-10 transition-opacity" />
                          <div className="absolute inset-0 border border-forest-green/10 dark:border-primary/20 rounded-full group-hover:border-forest-green/30 transition-colors" />
                          
                          <div className="relative flex items-center gap-3">
                            {subData.isLoadingMore ? (
                              <div className="size-5 border-2 border-forest-green/30 border-t-forest-green dark:border-primary/30 dark:border-t-primary rounded-full animate-spin" />
                            ) : (
                              <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-y-1">expand_more</span>
                            )}
                            <span className="text-sm font-black uppercase tracking-[0.2em] text-forest-green dark:text-soft-cream">
                              {subData.isLoadingMore 
                                ? (locale === 'en' ? 'Loading...' : 'Chargement...') 
                                : (locale === 'en' ? 'Show More' : 'Voir plus')
                              }
                            </span>
                          </div>
                        </button>
                      </div>
                    )}
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
                }}
                className="mt-8 px-8 py-3 bg-forest-green text-white dark:bg-primary dark:text-forest-green rounded-xl font-bold shadow-xl shadow-forest-green/20 hover:scale-105 active:scale-95 transition-all"
              >
                {locale === 'en' ? 'Clear all filters' : 'Réinitialiser les filtres'}
              </button>
            </div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
