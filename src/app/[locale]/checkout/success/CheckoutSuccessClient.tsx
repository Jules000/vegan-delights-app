"use client";

import { useCartStore } from "@/store/cartStore";
import { useEffect } from "react";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";

export default function CheckoutSuccessClient({
  txRef,
  transactionId,
  invoiceId,
}: {
  txRef?: string;
  transactionId?: string;
  invoiceId?: string | null;
}) {
  const clearCart = useCartStore((state) => state.clearCart);
  const locale = useLocale();

  useEffect(() => {
    // Once the user visits the success page, the payment is confirmed by Tranzak 
    // Usually a webhook confirms the backend DB, but we clear their frontend cart.
    clearCart();
  }, [clearCart]);

  return (
    <div className="py-32 bg-background-light dark:bg-background-dark min-h-[80vh] flex flex-col items-center justify-center">
      <span className="material-symbols-outlined text-8xl text-forest-green mb-6">task_alt</span>
      <h1 className="font-serif text-5xl mb-4 text-forest-green dark:text-soft-cream text-center">
        {locale === 'en' ? 'Payment Successful!' : 'Paiement Réussi !'}
      </h1>
      <p className="text-forest-green/70 text-lg mb-8 text-center max-w-lg">
        {locale === 'en' 
          ? 'Thank you for your order. We are preparing it with care. You will receive an email confirmation shortly.' 
          : 'Merci pour votre commande. Nous la préparons avec soin. Vous recevrez une confirmation par courriel sous peu.'}
      </p>
      
      <div className="bg-forest-green/5 border border-forest-green/10 rounded-2xl p-6 w-full max-w-md mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-forest-green/60 uppercase">Transaction</span>
          <span className="font-mono text-sm">{transactionId || txRef || 'N/A'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-forest-green/60 uppercase">Status</span>
          <span className="text-sm font-bold text-primary">Payé (Tranzak)</span>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        {invoiceId && (
          <Link 
            href={`/invoice/${invoiceId}`} 
            target="_blank"
            className="flex items-center gap-2 bg-transparent border-2 border-forest-green text-forest-green font-bold text-base px-6 py-4 rounded-full hover:bg-forest-green/5 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            {locale === 'en' ? 'View/Print Invoice' : 'Voir/Imprimer la facture'}
          </Link>
        )}
        <Link 
          href="/" 
          className="bg-primary text-forest-green font-bold text-base px-8 py-4 rounded-full hover:brightness-110 active:scale-95 transition-all shadow-xl"
        >
          {locale === 'en' ? 'Return to Homepage' : 'Retourner à l\'accueil'}
        </Link>
      </div>
    </div>
  );
}
