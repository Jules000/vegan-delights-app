"use client";

import { Link } from '@/i18n/routing';
import { useActionState, useState } from 'react';
import { forgotPassword } from '@/app/actions/auth';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(forgotPassword as any, { success: false, error: '' });
  const locale = useLocale();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 relative">
      <div 
        className="absolute inset-0 bg-cover bg-center grayscale mix-blend-multiply opacity-20 dark:opacity-5" 
        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuATlN5K3YzlvzC_Me5_f72VWyVWTZBqN3bjcuFXkqEUrpR7PB9FbLdnTLikyR2KIvXKIPCfu4s16w-IyD_I1V_AH0B6JPE7I8V2ZZFoNqPuMWx0-Lk0RB0eVhOdOtT1vRnSD0NNRYhd8f-tmF8-UQlL18CiSmPU-rfPctnBktimfpBzhbR6aGvc44lSInYEjLhoCk7i8XekPHu6sidDigOa5GshIV2IOhI9z9ISuZ1gtIORzl0A1tRGqwsNZSbLLz7Rraf5_DPvi-tq')" }}
      />
      
      <div className="relative w-full max-w-md bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl border border-forest-green/10 p-10 rounded-3xl shadow-2xl overflow-hidden">
        <AnimatePresence mode="wait">
          {state?.success ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="size-16 bg-primary/20 mx-auto rounded-full flex items-center justify-center text-primary mb-6 shadow-xl">
                <span className="material-symbols-outlined text-4xl">check_circle</span>
              </div>
              <h2 className="font-serif text-3xl font-black text-forest-green dark:text-soft-cream mb-4">
                {locale === 'en' ? 'Check your inbox' : 'Vérifiez vos emails'}
              </h2>
              <p className="text-sm font-medium text-forest-green/60 dark:text-soft-cream/60 mb-8 leading-relaxed">
                {locale === 'en' 
                  ? "If an account exists with this email, you will receive a reset link shortly. Please check your spam folder too." 
                  : "Si un compte existe pour cet email, un lien de réinitialisation vous sera envoyé sous peu. Pensez à vérifier vos spams."}
              </p>
              <Link 
                href="/login" 
                className="inline-block bg-forest-green text-white dark:bg-primary dark:text-forest-green font-bold text-sm px-8 py-3 rounded-xl transition-all hover:scale-105"
              >
                {locale === 'en' ? 'Back to Login' : 'Retour à la connexion'}
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              <div className="text-center mb-10">
                <div className="size-12 bg-terracotta/20 mx-auto rounded-xl flex items-center justify-center text-terracotta mb-4 shadow-lg shadow-terracotta/10">
                  <span className="material-symbols-outlined text-3xl">lock_reset</span>
                </div>
                <h2 className="font-serif text-3xl font-black text-forest-green dark:text-soft-cream">
                  {locale === 'en' ? 'Forgot Password' : 'Mot de passe oublié'}
                </h2>
                <p className="text-sm font-medium text-forest-green/60 dark:text-soft-cream/60 mt-2">
                  {locale === 'en' ? 'Enter your email to receive a recovery link' : 'Saisissez votre email pour recevoir un lien de récupération'}
                </p>
              </div>

              <form action={formAction} className="space-y-6 flex flex-col items-center">
                <input type="hidden" name="locale" value={locale} />
                
                {state?.error && (
                  <div className="w-full bg-red-100 text-red-600 p-3 rounded-lg text-sm text-center font-bold">
                    {state.error}
                  </div>
                )}
                
                <div className="w-full space-y-1">
                  <label htmlFor="email" className="text-sm font-bold text-forest-green dark:text-soft-cream ml-2">
                    {locale === 'en' ? 'Email Address' : 'Adresse Email'}
                  </label>
                  <input 
                    id="email"
                    name="email"
                    className="w-full bg-white dark:bg-black/20 border border-forest-green/20 rounded-xl px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-forest-green/40" 
                    placeholder="votre@email.com" 
                    type="email" 
                    required 
                  />
                </div>

                <button 
                  disabled={isPending}
                  className="w-full bg-forest-green text-white dark:bg-primary dark:text-forest-green font-bold text-base py-4 rounded-xl mt-4 shadow-xl hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (locale === 'en' ? 'Send Link' : 'Envoyer le lien')}
                </button>
              </form>

              <div className="mt-10 text-center">
                <Link href="/login" className="text-xs font-bold text-forest-green/50 hover:text-primary transition-colors flex items-center justify-center gap-1 group">
                  <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform">arrow_back</span>
                  {locale === 'en' ? 'Back to Login' : 'Retour à la connexion'}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
