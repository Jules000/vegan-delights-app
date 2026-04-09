'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';

export default function SideCart() {
  const [mounted, setMounted] = useState(false);
  const locale = useLocale();
  
  const { 
    items, 
    isOpen, 
    closeCart, 
    updateQuantity, 
    removeFromCart, 
    getTotalPrice 
  } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
          />
          
          {/* Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-[110] w-full max-w-md h-[100dvh] bg-background-light dark:bg-background-dark shadow-2xl flex flex-col border-l border-forest-green/10 dark:border-soft-cream/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-forest-green/10 dark:border-soft-cream/10 bg-background-light dark:bg-background-dark relative z-10">
              <h2 className="text-2xl font-serif font-black text-forest-green dark:text-soft-cream flex items-center gap-2">
                <span className="material-symbols-outlined">shopping_cart</span>
                {locale === 'en' ? 'Your Cart' : 'Votre Panier'}
              </h2>
              <button 
                onClick={closeCart}
                className="p-2 rounded-full hover:bg-forest-green/10 dark:hover:bg-soft-cream/10 transition-colors text-forest-green dark:text-soft-cream"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Free Shipping Incentive - Sticky */}
            {items.length > 0 && (
              <div className="sticky top-0 z-20 bg-sage/20 dark:bg-sage/10 p-4 border-b border-sage/30 backdrop-blur-md">
                {(() => {
                  const subtotal = getTotalPrice();
                  const threshold = 15000;
                  const progress = Math.min((subtotal / threshold) * 100, 100);
                  const remaining = threshold - subtotal;
                  const isFree = subtotal >= threshold;

                  return (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-forest-green">
                        <span>
                          {isFree 
                            ? (locale === 'en' ? 'Free shipping unlocked!' : 'Livraison offerte !') 
                            : (locale === 'en' 
                                ? `${remaining.toLocaleString()} FCFA away from free shipping` 
                                : `Plus que ${remaining.toLocaleString()} FCFA pour la livraison gratuite !`)}
                        </span>
                        <span className="text-primary">{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2 w-full bg-forest-green/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                          className={`h-full ${isFree ? 'bg-primary shadow-[0_0_10px_rgba(var(--color-primary),0.5)]' : 'bg-primary/60'}`}
                        />
                      </div>
                      {!isFree && (
                        <p className="text-[10px] font-bold text-forest-green/60 italic text-center">
                          {locale === 'en' 
                            ? "Add more delights to your cart to save on delivery fees!" 
                            : "Ajoutez plus de délices pour économiser les frais de port !"}
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-forest-green/60 dark:text-soft-cream/60 gap-4">
                  <div className="size-24 rounded-full bg-forest-green/5 dark:bg-soft-cream/5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl">shopping_cart</span>
                  </div>
                  <p className="text-lg font-medium">{locale === 'en' ? 'Your cart is empty' : 'Votre panier est vide'}</p>
                  <button 
                    onClick={closeCart}
                    className="mt-4 px-6 py-2 bg-primary text-forest-green font-bold rounded-full hover:bg-primary/90 transition-colors"
                  >
                    {locale === 'en' ? 'Continue Shopping' : 'Continuer vos achats'}
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={item.id} 
                    className="flex gap-4 items-center bg-white dark:bg-forest-green/20 p-3 rounded-2xl shadow-sm border border-forest-green/5 dark:border-soft-cream/5"
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-forest-green/5 dark:bg-soft-cream/5 flex-shrink-0">
                      <Image 
                        src={item.image || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070'} 
                        alt={locale === 'en' ? item.nameEn : item.nameFr} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-forest-green dark:text-soft-cream truncate">
                        {locale === 'en' ? item.nameEn : item.nameFr}
                      </h3>
                      <p className="text-terracotta font-bold">{(item.price * item.quantity).toLocaleString()} FCFA</p>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center bg-forest-green/5 dark:bg-soft-cream/5 rounded-full h-8 border border-forest-green/10 dark:border-soft-cream/10">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-full flex items-center justify-center rounded-l-full hover:bg-forest-green/10 dark:hover:bg-soft-cream/10 text-forest-green dark:text-soft-cream transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm font-bold">remove</span>
                          </button>
                          <span className="w-8 text-center font-bold text-sm text-forest-green dark:text-soft-cream">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-full flex items-center justify-center rounded-r-full hover:bg-forest-green/10 dark:hover:bg-soft-cream/10 text-forest-green dark:text-soft-cream transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm font-bold">add</span>
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-full transition-colors ml-auto"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-forest-green/10 dark:border-soft-cream/10 bg-background-light dark:bg-background-dark">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-lg font-medium text-forest-green dark:text-soft-cream">
                    {locale === 'en' ? 'Subtotal' : 'Sous-total'}
                  </span>
                  <span className="text-3xl font-black text-terracotta">{getTotalPrice().toLocaleString()} FCFA</span>
                </div>
                <Link href="/checkout" onClick={closeCart} className="block w-full">
                  <button className="relative overflow-hidden w-full py-4 bg-terracotta text-white font-bold text-lg rounded-full hover:bg-terracotta/90 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 group">
                    <span className="relative z-10 flex items-center gap-2">
                      {locale === 'en' ? 'Proceed to Checkout' : 'Passer à la caisse'} 
                      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </span>
                  </button>
                </Link>
                <button 
                  onClick={closeCart}
                  className="w-full mt-4 py-2 text-forest-green/70 dark:text-soft-cream/70 font-medium hover:text-forest-green dark:hover:text-soft-cream transition-colors text-sm"
                >
                  {locale === 'en' ? 'Continue Shopping' : 'Continuer vos achats'}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
