"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';

export default function ProductDetailsClient({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const locale = useLocale();
  const addToCart = useCartStore((state) => state.addToCart);

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity);
    
    // Simulate brief network delay for UX then show success
    setTimeout(() => {
      setIsAdding(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    }, 600);
  };

  const name = locale === 'en' ? product.nameEn : product.nameFr;
  const desc = locale === 'en' ? product.descEn : product.descFr;
  const price = product.price || 0;
  const totalPrice = price * quantity;

  return (
    <div className="pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm text-forest-green/50 dark:text-soft-cream/50">
          <Link href="/" className="hover:text-primary transition-colors">{locale === 'en' ? 'Home' : 'Accueil'}</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary transition-colors">{locale === 'en' ? 'Shop' : 'Boutique'}</Link>
          <span>/</span>
          <span className="text-forest-green dark:text-soft-cream font-bold truncate max-w-[200px]">{name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Photos */}
          <div className="space-y-4">
            <div className="aspect-square bg-forest-green/5 rounded-2xl overflow-hidden border border-forest-green/10">
              <img src={product.image} alt={name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <span className="text-primary font-bold text-sm tracking-widest uppercase mb-4">{product.category || 'Vegan Collection'}</span>
            <h1 className="font-serif text-5xl md:text-6xl text-forest-green dark:text-white mb-6 leading-tight">
              {name}
            </h1>
            <div className="flex items-end gap-3 mb-6">
              <p className="text-3xl font-bold text-terracotta">{totalPrice.toFixed(2)} FCFA</p>
              {quantity > 1 && (
                <p className="text-sm font-medium text-forest-green/40 dark:text-soft-cream/40 mb-1">
                  ({price.toFixed(2)} FCFA / u)
                </p>
              )}
            </div>
            
            <p className="text-forest-green/70 dark:text-soft-cream/70 mb-8 leading-relaxed text-lg">
              {desc}
            </p>
            
            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center border border-forest-green/20 rounded-full h-14 overflow-hidden bg-white dark:bg-transparent">
                <button onClick={handleDecrease} className="px-5 h-full hover:bg-forest-green/5 transition-colors font-bold text-xl">-</button>
                <span className="w-10 text-center font-bold">{quantity}</span>
                <button onClick={handleIncrease} className="px-5 h-full hover:bg-forest-green/5 transition-colors font-bold text-xl">+</button>
              </div>
              <button 
                onClick={handleAddToCart}
                disabled={isAdding || isSuccess}
                className={`flex-1 font-bold h-14 rounded-full transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-90 disabled:cursor-not-allowed ${isSuccess ? 'bg-forest-green text-white dark:bg-soft-cream dark:text-forest-green' : 'bg-primary text-forest-green hover:brightness-110 active:scale-95'}`}
              >
                {isAdding ? (
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                ) : isSuccess ? (
                  <span className="material-symbols-outlined">check_circle</span>
                ) : (
                  <span className="material-symbols-outlined">shopping_bag</span>
                )}
                
                {isAdding ? (locale === 'en' ? 'Adding...' : 'Ajout...') : 
                 isSuccess ? (locale === 'en' ? 'Added!' : 'Ajouté !') : 
                 (locale === 'en' ? 'Add to cart' : 'Ajouter au panier')}
              </button>
            </div>

            {/* Nutrients */}
            <div className="border border-forest-green/10 rounded-xl p-6 bg-forest-green/5 dark:bg-white/5">
              <h3 className="font-bold text-sm uppercase tracking-widest text-forest-green/50 dark:text-soft-cream/50 mb-4">
                {locale === 'en' ? 'Nutritional Preview' : 'Valeurs Nutritionnelles'}
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {product.nutritionLabel1Fr && (
                  <div className="text-center">
                    <p className="text-xs text-forest-green/60 dark:text-soft-cream/60 uppercase truncate">{locale === 'en' ? product.nutritionLabel1En : product.nutritionLabel1Fr}</p>
                    <p className="font-bold text-xl text-primary">{product.nutritionValue1}</p>
                  </div>
                )}
                {product.nutritionLabel2Fr && (
                  <div className="text-center">
                    <p className="text-xs text-forest-green/60 dark:text-soft-cream/60 uppercase truncate">{locale === 'en' ? product.nutritionLabel2En : product.nutritionLabel2Fr}</p>
                    <p className="font-bold text-xl text-primary">{product.nutritionValue2}</p>
                  </div>
                )}
                {product.nutritionLabel3Fr && (
                  <div className="text-center">
                    <p className="text-xs text-forest-green/60 dark:text-soft-cream/60 uppercase truncate">{locale === 'en' ? product.nutritionLabel3En : product.nutritionLabel3Fr}</p>
                    <p className="font-bold text-xl text-primary">{product.nutritionValue3}</p>
                  </div>
                )}
                {product.nutritionLabel4Fr && (
                  <div className="text-center">
                    <p className="text-xs text-forest-green/60 dark:text-soft-cream/60 uppercase truncate">{locale === 'en' ? product.nutritionLabel4En : product.nutritionLabel4Fr}</p>
                    <p className="font-bold text-xl text-primary">{product.nutritionValue4}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
