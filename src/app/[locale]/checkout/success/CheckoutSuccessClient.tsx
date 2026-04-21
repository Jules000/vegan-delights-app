"use client";

import { useCartStore } from "@/store/cartStore";
import { useEffect } from "react";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="py-32 bg-background-light dark:bg-background-dark min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Marketing Pulse Alert */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mb-12 bg-primary/10 border border-primary/30 backdrop-blur-md px-8 py-4 rounded-2xl flex items-center gap-4 max-w-xl mx-auto shadow-2xl shadow-primary/10"
      >
        <span className="material-symbols-outlined text-primary text-3xl animate-bounce">mark_email_read</span>
        <div className="text-left">
          <p className="text-forest-green font-black text-sm uppercase tracking-widest mb-1">
            {locale === 'en' ? "Email Dispatched" : "Courriel Expédié"}
          </p>
          <p className="text-forest-green/80 text-sm leading-relaxed italic">
            {locale === 'en' 
              ? "A fresh breeze is heading to your inbox! Your detailed invoice has been dispatched. Prepare your taste buds, ethical excellence is on its way." 
              : "Un vent de fraîcheur arrive dans votre boîte mail ! Votre facture détaillée vient de vous être envoyée. Préparez vos papilles, l'excellence éthique est en route."}
          </p>
        </div>
      </motion.div>

      <span className="material-symbols-outlined text-8xl text-forest-green mb-6">task_alt</span>
      <h1 className="font-serif text-5xl mb-4 text-forest-green dark:text-soft-cream text-center">
        {locale === 'en' ? 'Payment Successful!' : 'Paiement Réussi !'}
      </h1>
      <p className="text-forest-green/70 text-lg mb-8 text-center max-w-lg">
        {locale === 'en' 
          ? 'Thank you for your order. We are preparing it with care. Enjoy your Vegan Delights experience!' 
          : 'Merci pour votre commande. Nous la préparons avec soin. Profitez pleinement de votre expérience Vegan Delights !'}
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
