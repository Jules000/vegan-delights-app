'use client';

import { motion } from 'framer-motion';
import { Link, useRouter } from '@/i18n/routing';
import { useCartStore } from '@/store/cartStore';
import { useLocale } from 'next-intl';
import { useState } from 'react';
import { slugify } from '@/lib/slugify';

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
  
  const slug = slugify(name);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group cursor-pointer w-full"
    >
      <Link href={`/product/${slug}`} className="block">
        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-5 bg-soft-cream shadow-md transition-shadow hover:shadow-xl">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" 
            style={{ backgroundImage: `url('${product.image}')` }}
          />
          
          {/* Gradients for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />

          <div className="absolute top-5 left-5 flex flex-col gap-2 z-10">
            {product.category && (
              <div className="bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] text-terracotta shadow-sm">
                {product.category}
              </div>
            )}
            {product.isGlutenFree && (
              <div className="bg-primary/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] text-forest-green shadow-sm flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">eco</span>
                {locale === 'en' ? 'Gluten Free' : 'Sans Gluten'}
              </div>
            )}
          </div>

          {/* Floating Action Button (Only visible on hover or mobile always?) */}
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
            className={`absolute bottom-5 right-5 z-30 size-12 md:size-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all active:scale-90 ${
              isSuccess 
                ? 'bg-white text-forest-green' 
                : 'bg-primary text-forest-green hover:scale-105 active:brightness-90'
            } disabled:opacity-80 opacity-100 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0`}
          >
            {isAdding ? (
              <span className="material-symbols-outlined animate-spin text-2xl">refresh</span>
            ) : isSuccess ? (
              <span className="material-symbols-outlined text-2xl">check</span>
            ) : (
              <span className="material-symbols-outlined text-2xl font-black">shopping_cart_checkout</span>
            )}
          </button>
          
          {/* Description Overlay on Hover */}
          <div className="absolute inset-0 bg-forest-green/60 backdrop-blur-[2px] p-8 flex flex-col justify-end text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 pointer-events-none">
            <div className="mb-8">
              <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2 block">Discovery</span>
              <p className="text-sm font-medium leading-relaxed line-clamp-4 text-white/90">
                {locale === 'en' ? product.descEn : product.descFr}
              </p>
            </div>
          </div>
        </div>
        
        <h4 className="font-serif text-2xl font-black mb-1.5 text-forest-green dark:text-soft-cream group-hover:text-terracotta transition-colors">{name}</h4>
        <div className="flex items-center justify-between">
          <span className="text-terracotta font-black text-lg tracking-tight">{price.toLocaleString(locale)} FCFA</span>
          <span className="material-symbols-outlined text-forest-green/20 group-hover:text-terracotta/40 transition-colors">arrow_forward</span>
        </div>
      </Link>
    </motion.div>

  );
}
