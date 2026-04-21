'use client';

import { useState, useEffect, useTransition, useActionState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { triggerAdminMfa, verifyAdminMfa } from '@/app/actions/auth';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as string || 'fr';
  const callbackUrl = searchParams.get('callbackUrl') || `/admin`;

  const [otp, setOtp] = useState('');
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [isPending, startTransition] = useTransition();

  // Use action state for the form
  const [state, formAction] = useActionState(verifyAdminMfa, null);

  // Trigger MFA automatically on mount
  useEffect(() => {
    handleResend();
  }, []);

  // Redirect on success
  useEffect(() => {
    if (state?.success) {
      router.push(callbackUrl);
      router.refresh();
    }
  }, [state, router, callbackUrl]);

  const handleResend = async () => {
    setResendStatus('sending');
    try {
      const result = await triggerAdminMfa();
      if (result.success) {
        setResendStatus('sent');
        setTimeout(() => setResendStatus('idle'), 5000);
      } else {
        setResendStatus('error');
      }
    } catch (error) {
      setResendStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf6] flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[32px] p-8 md:p-12 shadow-[0_20px_50px_rgba(13,27,13,0.05)] border border-[#0d1b0d]/5"
      >
        <div className="text-center mb-8">
          <div className="inline-block w-16 h-16 bg-[#13ec13] rounded-2xl text-[#0d1b0d] text-4xl leading-[64px] font-black mb-6">
            🍀
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#0d1b0d] tracking-tight mb-2">
            {locale === 'en' ? 'Identity Verification' : 'Vérification d\'identité'}
          </h1>
          <p className="text-[#666] text-sm md:text-base">
            {locale === 'en' 
              ? 'An extra layer of security for administrative access.' 
              : 'Une protection supplémentaire pour accéder à l\'administration.'}
          </p>
        </div>

        <form action={formAction} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest font-black text-[#0d1b0d] mb-4 text-center">
              {locale === 'en' ? 'Enter 6-digit code' : 'Entrez le code à 6 chiffres'}
            </label>
            <input
              type="text"
              name="otp"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full text-center text-4xl font-black tracking-[0.5em] py-4 bg-[#fdfaf6] border-2 border-[#eee] rounded-2xl focus:border-[#13ec13] focus:ring-0 transition-all placeholder:opacity-20"
              required
              autoFocus
            />
          </div>

          <AnimatePresence>
            {state?.error && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-500 font-bold text-sm text-center"
              >
                {state.error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={otp.length !== 6 || isPending}
            className="w-full py-4 bg-[#0d1b0d] text-[#13ec13] font-black uppercase tracking-widest rounded-2xl hover:bg-[#1a331a] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-[0.98]"
          >
            {isPending 
              ? (locale === 'en' ? 'Verifying...' : 'Vérification...') 
              : (locale === 'en' ? 'Unlock Dashboard' : 'Déverrouiller l\'accès')}
          </button>
        </form>

        <div className="mt-8 text-center border-top border-[#eee] pt-6">
          <button
            onClick={handleResend}
            disabled={resendStatus === 'sending' || resendStatus === 'sent'}
            className="text-sm font-bold text-[#b25a38] hover:underline disabled:opacity-50"
          >
            {resendStatus === 'sending' && (locale === 'en' ? 'Sending...' : 'Envoi en cours...')}
            {resendStatus === 'sent' && (locale === 'en' ? 'Code sent! Check your inbox' : 'Code envoyé ! Vérifiez vos e-mails')}
            {resendStatus === 'error' && (locale === 'en' ? 'Failed to send. Try again?' : 'Échec de l\'envoi. Réessayer ?')}
            {resendStatus === 'idle' && (locale === 'en' ? 'Resend verification code' : 'Renvoyer le code de vérification')}
          </button>
        </div>
      </motion.div>

      <div className="mt-8 text-center">
        <button 
          onClick={() => router.push('/')}
          className="text-[#666] text-sm hover:text-[#0d1b0d] transition-colors font-medium"
        >
          {locale === 'en' ? '← Back to store' : '← Retour à la boutique'}
        </button>
      </div>
    </div>
  );
}
