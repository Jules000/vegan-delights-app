'use client';

import { motion } from 'framer-motion';
import { Link, useRouter } from '@/i18n/routing';
import { useCartStore } from '@/store/cartStore';
import { useLocale } from 'next-intl';
import { useState } from 'react';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  badge?: string;
  nutrition: {
    label1: string; value1: string;
    label2: string; value2: string;
    label3: string; value3: string;
    label4: string; value4: string;
  };
}

export default function ProductCard({ product }: { product: any }) {
  const locale = useLocale();
  const addToCart = useCartStore((state) => state.addToCart);
  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const name = locale === 'en' ? product.nameEn : product.nameFr;
  // If price is missing or bad, default it
  const price = product.price || 0;
  
  const slug = name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : 'product';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="flex-none w-64 group cursor-pointer"
    >
      <Link href={`/product/${slug}`} className="block">
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-soft-cream shadow-sm">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
            style={{ backgroundImage: `url('${product.image}')` }}
          />
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {product.category && (
              <div className="bg-white/90 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-terracotta shadow-sm">
                {product.category}
              </div>
            )}
            {product.isGlutenFree && (
              <div className="bg-primary/95 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-forest-green shadow-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">eco</span>
                {locale === 'en' ? 'Gluten Free' : 'Sans Gluten'}
              </div>
            )}
          </div>

          {/* Floating Quick Add Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsAdding(true);
              addToCart({
                id: product.id,
                nameFr: product.nameFr,
                nameEn: product.nameEn,
                price: product.price,
                image: product.image
              });
              setTimeout(() => {
                setIsAdding(false);
                setIsSuccess(true);
                setTimeout(() => setIsSuccess(false), 2000);
              }, 500);
            }}
            disabled={isAdding || isSuccess}
            className={`absolute bottom-4 right-4 z-20 size-12 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90 ${
              isSuccess 
                ? 'bg-white text-forest-green' 
                : 'bg-primary text-forest-green hover:scale-110 hover:brightness-110'
            } disabled:opacity-80`}
            title={locale === 'en' ? 'Add to cart' : 'Ajouter au panier'}
          >
            {isAdding ? (
              <span className="material-symbols-outlined animate-spin text-2xl">refresh</span>
            ) : isSuccess ? (
              <span className="material-symbols-outlined text-2xl">check</span>
            ) : (
              <span className="material-symbols-outlined text-2xl font-bold">add</span>
            )}
          </button>
          
          {/* Interactive Hover Overlay */}
          <div className="nutritional-overlay absolute inset-0 bg-forest-green/80 backdrop-blur-sm p-6 flex flex-col justify-end text-white">
            <h4 className="font-bold mb-4 flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined">analytics</span> {locale === 'en' ? 'Nutrition' : 'Valeurs Nutritionnelles'}
            </h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="border-l-2 border-primary pl-2">
                <p className="text-white/60 truncate">{locale === 'en' ? product.nutritionLabel1En : product.nutritionLabel1Fr}</p>
                <p className="font-bold truncate">{product.nutritionValue1}</p>
              </div>
              <div className="border-l-2 border-primary pl-2">
                <p className="text-white/60 truncate">{locale === 'en' ? product.nutritionLabel2En : product.nutritionLabel2Fr}</p>
                <p className="font-bold truncate">{product.nutritionValue2}</p>
              </div>
              <div className="border-l-2 border-primary pl-2">
                <p className="text-white/60 truncate">{locale === 'en' ? product.nutritionLabel3En : product.nutritionLabel3Fr}</p>
                <p className="font-bold truncate">{product.nutritionValue3}</p>
              </div>
              <div className="border-l-2 border-primary pl-2">
                <p className="text-white/60 truncate">{locale === 'en' ? product.nutritionLabel4En : product.nutritionLabel4Fr}</p>
                <p className="font-bold truncate">{product.nutritionValue4}</p>
              </div>
            </div>
            
            <button 
              disabled={isAdding || isSuccess}
              className={`mt-6 w-full py-3 rounded-lg font-bold text-sm transition-all active:scale-95 shadow-xl disabled:opacity-90 flex items-center justify-center gap-2 ${isSuccess ? 'bg-white text-forest-green' : 'bg-primary text-forest-green hover:brightness-110'}`}
              onClick={(e) => {
                e.preventDefault(); // Stop link navigation
                setIsAdding(true);
                addToCart({
                  id: product.id,
                  nameFr: product.nameFr,
                  nameEn: product.nameEn,
                  price: product.price,
                  image: product.image
                });
                setTimeout(() => {
                  setIsAdding(false);
                  setIsSuccess(true);
                  setTimeout(() => setIsSuccess(false), 2000);
                }, 500);
              }}
            >
              {isAdding ? <span className="material-symbols-outlined animate-spin text-sm">refresh</span> : null}
              {isSuccess && !isAdding ? <span className="material-symbols-outlined text-sm">check</span> : null}
              {isAdding ? (locale === 'en' ? 'Adding...' : 'Ajout...') : 
               isSuccess ? (locale === 'en' ? 'Added!' : 'Ajouté !') : 
               (locale === 'en' ? 'Quick Add' : 'Ajout Rapide')}
            </button>
          </div>
        </div>
        
        <h4 className="font-bold text-xl mb-1 group-hover:text-primary transition-colors">{name}</h4>
        <div className="flex items-center justify-between">
          <span className="text-forest-green/60 dark:text-soft-cream/60 text-sm italic opacity-0">...</span>
          <span className="text-terracotta font-bold">{price.toFixed(2)} FCFA</span>
        </div>
      </Link>
    </motion.div>
  );
}
