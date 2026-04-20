'use client';

import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';

export default function MenuBanner({ product }: { product: any }) {
  const locale = useLocale();
  const t = useTranslations('Index');
  const addToCart = useCartStore((state) => state.addToCart);
  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!product) return null;

  const name = locale === 'en' ? product.nameEn : product.nameFr;
  const bannerText = locale === 'en' ? product.bannerTextEn : product.bannerTextFr;
  
  const slug = name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : 'product';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
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
  };

  return (
    <section className="relative w-full min-h-[500px] md:h-[600px] overflow-hidden group">
      {/* Background with Premium Blur & Gradient */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] group-hover:scale-105" 
        style={{ backgroundImage: `url('${product.bannerImage || product.image}')` }}
      />
      
      {/* Dynamic Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-l from-forest-green via-forest-green/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-green/80 via-transparent to-transparent" />

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-end py-20 text-right">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl flex flex-col items-end"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md border border-primary/30 px-4 py-2 rounded-full mb-6">
            <span className="material-symbols-outlined text-primary text-base animate-pulse">stars</span>
            <span className="text-primary font-bold text-xs uppercase tracking-[0.2em]">
              {locale === 'en' ? "Today's Signature" : "Notre Signature du Jour"}
            </span>
          </div>

          {/* Title */}
          <h2 className="font-serif text-5xl md:text-7xl text-white mb-6 leading-tight font-black">
            {name}
          </h2>

          {/* Marketing Text */}
          {bannerText && (
            <p className="text-soft-cream/80 text-lg md:text-xl font-light mb-10 leading-relaxed italic border-r-2 border-primary pr-6">
              &ldquo;{bannerText}&rdquo;
            </p>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleAddToCart}
              disabled={isAdding || isSuccess}
              className={`flex items-center justify-center gap-3 px-10 py-4 rounded-full font-bold transition-all shadow-xl active:scale-95 ${
                isSuccess 
                ? 'bg-white text-forest-green translate-y-[-2px]' 
                : 'bg-primary text-forest-green hover:brightness-110 hover:shadow-primary/30'
              }`}
            >
              {isAdding ? (
                <span className="material-symbols-outlined animate-spin">refresh</span>
              ) : isSuccess ? (
                <span className="material-symbols-outlined">check_circle</span>
              ) : (
                <span className="material-symbols-outlined">shopping_cart</span>
              )}
              {isAdding ? (locale === 'en' ? 'Adding...' : 'Ajout...') : 
               isSuccess ? (locale === 'en' ? 'In Cart!' : 'Au Panier!') : 
               (locale === 'en' ? 'Add to Cart' : 'Commander')}
            </button>

            <Link 
              href={`/product/${slug}`}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-10 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 group/btn"
            >
              {locale === 'en' ? 'Product Details' : 'Détails du produit'}
              <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute right-0 bottom-0 overflow-hidden opacity-20 pointer-events-none hidden lg:block">
        <span className="material-symbols-outlined text-[300px] text-soft-cream -mb-20 -mr-20 rotate-12">
          eco
        </span>
      </div>
    </section>
  );
}
