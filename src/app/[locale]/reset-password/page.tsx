"use client";

import { Link } from '@/i18n/routing';
import { useActionState, useState, useEffect } from 'react';
import { resetPassword } from '@/app/actions/auth';
import { useLocale } from 'next-intl';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [clientError, setClientError] = useState('');

  const [state, formAction, isPending] = useActionState(resetPassword as any, { success: false, error: '' });

  useEffect(() => {
    if (!token) {
      router.push(`/${locale}/login`);
    }
  }, [token, router, locale]);

  const handleResetSubmit = (formData: FormData) => {
    setClientError('');
    const pass = formData.get('password') as string;
    const confirm = formData.get('confirmPassword') as string;

    if (pass.length < 8) {
      setClientError(locale === 'en' ? 'Password is too short' : 'Le mot de passe est trop court');
      return;
    }

    if (pass !== confirm) {
      setClientError(locale === 'en' ? 'Passwords do not match' : 'Les mots de passe ne correspondent pas');
      return;
    }

    formAction(formData);
  };

  if (!token) return null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 relative">
      <div 
        className="absolute inset-0 bg-cover bg-center grayscale mix-blend-multiply opacity-20 dark:opacity-5" 
        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuATlN5K3YzlvzC_Me5_f72VWyVWTZBqN3bjcuFXkqEUrpR7PB9FbLdnTLikyR2KIvXKIPCfu4s16w-IyD_I1V_AH0B6JPE7I8V2ZZFoNqPuMWx0-Lk0RB0eVhOtT1vRnSD0NNRYhd8f-tmF8-UQlL18CiSmPU-rfPctnBktimfpBzhbR6aGvc44lSInYEjLhoCk7i8XekPHu6sidDigOa5GshIV2IOhI9z9ISuZ1gtIORzl0A1tRGqwsNZSbLLz7Rraf5_DPvi-tq')" }}
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
                <span className="material-symbols-outlined text-4xl">verified_user</span>
              </div>
              <h2 className="font-serif text-3xl font-black text-forest-green dark:text-soft-cream mb-4">
                {locale === 'en' ? 'Password Reset!' : 'Mot de passe modifié !'}
              </h2>
              <p className="text-sm font-medium text-forest-green/60 dark:text-soft-cream/60 mb-8 leading-relaxed">
                {locale === 'en' 
                  ? "Your account security has been updated. You can now log in with your new password." 
                  : "La sécurité de votre compte a été mise à jour. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe."}
              </p>
              <Link 
                href="/login" 
                className="inline-block bg-forest-green text-white dark:bg-primary dark:text-forest-green font-bold text-sm px-8 py-3 rounded-xl transition-all hover:scale-105"
              >
                {locale === 'en' ? 'Log In' : 'Se connecter'}
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
                <div className="size-12 bg-primary/20 mx-auto rounded-xl flex items-center justify-center text-primary mb-4 shadow-lg">
                  <span className="material-symbols-outlined text-3xl">key</span>
                </div>
                <h2 className="font-serif text-3xl font-black text-forest-green dark:text-soft-cream">
                  {locale === 'en' ? 'New Password' : 'Nouveau mot de passe'}
                </h2>
                <p className="text-sm font-medium text-forest-green/60 dark:text-soft-cream/60 mt-2">
                  {locale === 'en' ? 'Choose a strong password for your account' : 'Choisissez un mot de passe robuste pour votre compte'}
                </p>
              </div>

              <form action={handleResetSubmit} className="space-y-5 flex flex-col items-center">
                <input type="hidden" name="token" value={token || ''} />
                <input type="hidden" name="locale" value={locale} />
                
                {(state?.error || clientError) && (
                  <div className="w-full bg-red-100 text-red-600 p-3 rounded-lg text-sm text-center font-bold">
                    {state?.error || clientError}
                  </div>
                )}
                
                <div className="w-full space-y-1">
                  <label htmlFor="password" className="text-sm font-bold text-forest-green dark:text-soft-cream ml-2">
                    {locale === 'en' ? 'New Password' : 'Nouveau mot de passe'}
                  </label>
                  <div className="relative">
                    <input 
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white dark:bg-black/20 border border-forest-green/20 rounded-xl px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-forest-green/40" 
                      placeholder="••••••••" 
                      type={showPassword ? "text" : "password"} 
                      required 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-forest-green/40 hover:text-forest-green transition-colors"
                    >
                      <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                  <PasswordStrengthMeter password={password} />
                </div>

                <div className="w-full space-y-1">
                  <label htmlFor="confirmPassword" className="text-sm font-bold text-forest-green dark:text-soft-cream ml-2">
                    {locale === 'en' ? 'Confirm Password' : 'Confirmer le mot de passe'}
                  </label>
                  <input 
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white dark:bg-black/20 border border-forest-green/20 rounded-xl px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-forest-green/40" 
                    placeholder="••••••••" 
                    type={showPassword ? "text" : "password"} 
                    required 
                  />
                </div>

                <button 
                  disabled={isPending}
                  className="w-full bg-forest-green text-white dark:bg-primary dark:text-forest-green font-bold text-base py-4 rounded-xl mt-4 shadow-xl hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (locale === 'en' ? 'Reset Password' : 'Réinitialiser')}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
