'use client';

import { useState, useEffect, useActionState } from 'react';
import { verifyOtp, resendOtp } from '@/app/actions/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';

interface OtpVerificationProps {
  email: string;
  callbackUrl?: string;
}

const initialState = { error: '' };

export default function OtpVerification({ email, callbackUrl }: OtpVerificationProps) {
  const locale = useLocale();
  const [state, formAction, isPending] = useActionState(verifyOtp as any, initialState);
  const [cooldown, setCooldown] = useState(0);
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResend = async () => {
    setResendStatus('sending');
    await resendOtp(email, locale);
    setResendStatus('sent');
    setCooldown(60); // 1 minute cooldown
    setTimeout(() => setResendStatus('idle'), 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full space-y-8"
    >
      <div className="text-center space-y-4">
        <div className="size-20 bg-forest-green/5 dark:bg-soft-cream/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-4xl text-forest-green dark:text-soft-cream">mark_email_unread</span>
        </div>
        <h2 className="font-serif text-3xl font-black text-forest-green dark:text-soft-cream">
          {locale === 'en' ? 'Check your email' : 'Vérifiez vos e-mails'}
        </h2>
        <p className="text-sm text-forest-green/60 dark:text-soft-cream/60 leading-relaxed px-4">
          {locale === 'en' 
            ? `We've sent a 6-digit verification code to ` 
            : `Nous avons envoyé un code de vérification à 6 chiffres à `}
          <span className="font-bold text-forest-green dark:text-soft-cream">{email}</span>.
        </p>
      </div>

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="callbackUrl" value={callbackUrl || '/'} />
        <input type="hidden" name="locale" value={locale} />

        <div className="space-y-4">
          <div className="relative">
            <input 
              name="otp"
              maxLength={6}
              className="w-full bg-white dark:bg-black/20 border-2 border-forest-green/10 rounded-2xl px-6 py-5 text-center text-3xl font-black tracking-[0.5em] outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-forest-green/10" 
              placeholder="000000" 
              type="text" 
              required 
              autoFocus
            />
          </div>

          <AnimatePresence>
            {state?.error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold text-center border border-red-100"
              >
                {state.error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button 
          disabled={isPending}
          className="w-full bg-forest-green text-white dark:bg-primary dark:text-forest-green font-black text-lg py-5 rounded-2xl shadow-xl hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isPending ? (
            <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              {locale === 'en' ? 'Verify Code' : 'Vérifier le code'}
              <span className="material-symbols-outlined">verified</span>
            </>
          )}
        </button>
      </form>

      <div className="text-center space-y-4 pt-4">
        <p className="text-xs font-bold text-forest-green/40 uppercase tracking-widest">
          {locale === 'en' ? "Didn't receive the code?" : "Vous n'avez pas reçu le code ?"}
        </p>
        <button 
          onClick={handleResend}
          disabled={cooldown > 0 || resendStatus === 'sending'}
          className={`text-sm font-black transition-all ${
            cooldown > 0 || resendStatus === 'sending'
              ? 'text-forest-green/20 cursor-not-allowed'
              : 'text-terracotta hover:text-terracotta/80'
          }`}
        >
          {resendStatus === 'sending' 
            ? (locale === 'en' ? 'Sending...' : 'Envoi...') 
            : resendStatus === 'sent'
            ? (locale === 'en' ? 'Sent!' : 'Envoyé !')
            : cooldown > 0 
            ? (locale === 'en' ? `Resend in ${cooldown}s` : `Renvoyer dans ${cooldown}s`)
            : (locale === 'en' ? 'Resend verification code' : 'Renvoyer le code de vérification')}
        </button>
      </div>
    </motion.div>
  );
}
