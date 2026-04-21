"use client";

import { useCartStore } from '@/store/cartStore';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { initializePayment } from '@/app/actions/payment';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import CheckoutAuth from '@/components/auth/CheckoutAuth';

export default function CheckoutClient({ session }: { session: any }) {
  const [mounted, setMounted] = useState(false);
  const { items, getTotalPrice, updateQuantity, removeFromCart } = useCartStore();
  const locale = useLocale();
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = getTotalPrice();
  // New logic: 1000 FCFA fixed, free if >= 15,000 FCFA
  const delivery = subtotal >= 15000 ? 0 : 1000; 
  const total = subtotal + delivery;

  if (items.length === 0) {
    return (
      <div className="py-24 bg-background-light dark:bg-background-dark min-h-screen flex flex-col items-center justify-center">
        <span className="material-symbols-outlined text-6xl text-forest-green/20 mb-6">production_quantity_limits</span>
        <h1 className="font-serif text-4xl mb-4 text-forest-green dark:text-soft-cream">
          {locale === 'en' ? 'Your cart is empty' : 'Votre panier est vide'}
        </h1>
        <Link href="/products" className="bg-primary text-forest-green font-bold px-8 py-4 rounded-full mt-4 hover:brightness-110 transition-all">
          {locale === 'en' ? 'Continue Shopping' : 'Continuer vos achats'}
        </Link>
      </div>
    );
  }

  return (
    <div className="py-24 bg-background-light dark:bg-background-dark min-h-[85vh]">
      <div className="max-w-6xl mx-auto px-6">
        {searchParams.get("canceled") === "true" && (
          <div className="mb-8 bg-terracotta/10 border border-terracotta text-terracotta p-4 rounded-xl flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">warning</span>
            <span className="font-bold">{locale === 'en' ? 'Payment was canceled.' : 'Le paiement a été annulé ou a échoué.'}</span>
          </div>
        )}

        {/* Free Shipping Alert in Checkout */}
        {delivery === 0 ? (
          <div className="mb-10 bg-sage/20 border border-sage/40 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <span className="material-symbols-outlined text-forest-green text-3xl">local_shipping</span>
            <div>
              <p className="font-black text-forest-green uppercase tracking-tighter text-lg">
                {locale === 'en' ? 'FREE SHIPPING UNLOCKED!' : 'LIVRAISON OFFERTE !'}
              </p>
              <p className="text-sm font-bold text-forest-green/60 italic">
                {locale === 'en' 
                  ? "Since your order is over 15,000 FCFA, we're covering the delivery costs." 
                  : "Votre commande dépasse 15 000 FCFA, nous vous offrons les frais de port."}
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-10 bg-blue-50 border border-blue-100 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <span className="material-symbols-outlined text-blue-600 text-3xl">info</span>
            <div>
              <p className="font-black text-blue-800 uppercase tracking-tighter text-lg">
                {locale === 'en' ? 'DELIVERY INFO' : 'INFOS LIVRAISON'}
              </p>
              <p className="text-sm font-bold text-blue-800/60 italic">
                {locale === 'en' 
                  ? `Only ${(15000 - subtotal).toLocaleString(locale)} FCFA left to get free shipping!` 
                  : `Plus que ${(15000 - subtotal).toLocaleString(locale)} FCFA pour bénéficier de la livraison gratuite !`}
              </p>
            </div>
          </div>
        )}

        <h1 className="font-serif text-5xl mb-10 text-forest-green dark:text-soft-cream">
          {locale === 'en' ? 'Secure Checkout' : 'Paiement Sécurisé'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Order Summary */}
          <div className="lg:col-span-7 bg-white dark:bg-forest-green/10 rounded-2xl p-8 border border-forest-green/10 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-2xl">{locale === 'en' ? 'Your Order' : 'Votre Commande'}</h2>
              <span className="text-sm font-bold bg-forest-green/5 text-forest-green px-3 py-1 rounded-full">{items.length} {locale === 'en' ? 'items' : 'articles'}</span>
            </div>
            
            <div className="space-y-6 mb-8 flex-1 overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="size-20 rounded-xl bg-soft-cream overflow-hidden shadow-sm shrink-0">
                    <img src={item.image} className="w-full h-full object-cover" alt={item.nameFr} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.id}`} className="font-bold text-forest-green dark:text-soft-cream text-lg truncate block hover:text-primary transition-colors">
                      {locale === 'en' ? item.nameEn : item.nameFr}
                    </Link>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center border border-forest-green/20 rounded-lg overflow-hidden h-8">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 hover:bg-forest-green/5 transition-colors font-bold">-</button>
                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 hover:bg-forest-green/5 transition-colors font-bold">+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-xs text-terracotta hover:underline font-bold">
                        {locale === 'en' ? 'Remove' : 'Retirer'}
                      </button>
                    </div>
                  </div>
                  <p className="font-bold text-lg whitespace-nowrap">{(item.price * item.quantity).toLocaleString(locale)} FCFA</p>
                </div>
              ))}
            </div>

            <div className="border-t border-forest-green/10 pt-6 space-y-3 mt-auto">
              <div className="flex justify-between text-forest-green/70">
                <p>Sous-total</p>
                <p className="font-medium">{subtotal.toLocaleString(locale)} FCFA</p>
              </div>
              <div className="flex justify-between text-forest-green/70">
                <p>Livraison (Eco-friendly)</p>
                <p className={`font-black ${delivery === 0 ? 'text-primary' : ''}`}>
                  {delivery === 0 ? (locale === 'en' ? 'FREE' : 'GRATUIT') : `${delivery.toLocaleString(locale)} FCFA`}
                </p>
              </div>
              <div className="flex justify-between font-black text-2xl mt-4 pt-4 border-t border-forest-green/10">
                <p>Total</p>
                <p className="text-primary">{total.toLocaleString(locale)} FCFA</p>
              </div>
            </div>
          </div>

          {/* Payment Form / Auth Prompt */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-28 space-y-6">
              <h2 className="font-bold text-2xl mb-2">Informations de livraison</h2>
              
              {!session ? (
                <CheckoutAuth />
              ) : (
                <form action={initializePayment} className="space-y-4">
                  <div className="bg-primary/10 p-4 rounded-xl border border-primary/20 mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider font-bold text-forest-green/50">Compte Actif</p>
                      <p className="font-bold text-forest-green">{session.name}</p>
                    </div>
                    <span className="material-symbols-outlined text-primary text-3xl">verified_user</span>
                  </div>

                  <input name="email" defaultValue={session.email || ""} className="w-full bg-white dark:bg-forest-green/10 border border-forest-green/20 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary" placeholder="Email" type="email" required />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input name="firstName" defaultValue={session.name?.split(' ')[0] || ""} className="w-full bg-white dark:bg-forest-green/10 border border-forest-green/20 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary" placeholder="Prénom" type="text" required />
                    <input name="lastName" defaultValue={session.name?.split(' ')[1] || ""} className="w-full bg-white dark:bg-forest-green/10 border border-forest-green/20 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary" placeholder="Nom" type="text" required />
                  </div>
                  
                  <input name="address" className="w-full bg-white dark:bg-forest-green/10 border border-forest-green/20 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary" placeholder={locale === 'en' ? 'Full Address' : 'Adresse complète'} type="text" required />
                  
                  {/* Dynamic fields */}
                  <input type="hidden" name="amount" value={total} />
                  <input type="hidden" name="deliveryFee" value={delivery} />
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="cartItems" value={JSON.stringify(items.map(item => ({ id: item.id, quantity: item.quantity, price: item.price })))} />
                  
                  <button className="w-full bg-primary text-forest-green font-bold text-lg py-5 rounded-full mt-6 shadow-xl hover:brightness-110 active:scale-95 transition-all flex justify-center items-center gap-2">
                    <span className="material-symbols-outlined">lock</span> Payer {total.toLocaleString(locale)} FCFA
                  </button>
                  <p className="text-center text-xs text-forest-green/40 mt-4 flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-[10px]">encrypted</span> Paiement hautement sécurisé via Tranzak
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
