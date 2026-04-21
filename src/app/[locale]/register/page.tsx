"use client";

import { Link } from '@/i18n/routing';
import { useActionState, useState } from 'react';
import { registerUser } from '@/app/actions/auth';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import OtpVerification from '@/components/auth/OtpVerification';
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const initialState = { error: '', showOtp: false, email: '' };

export default function RegisterPage() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const rawCallbackUrl = searchParams.get('callbackUrl');
  const callbackUrl = (rawCallbackUrl && rawCallbackUrl !== 'undefined' && rawCallbackUrl !== 'null') ? rawCallbackUrl : '/';

  const [phoneNumber, setPhoneNumber] = useState<any>('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [clientError, setClientError] = useState('');

  const [state, registerAction, isPending] = useActionState(registerUser as any, initialState);

  const isPasswordStrong = (pass: string) => {
    return pass.length >= 8 && 
           /[A-Z]/.test(pass) && 
           /[a-z]/.test(pass) && 
           /[0-9]/.test(pass) && 
           /[^A-Za-z0-9]/.test(pass);
  };

  const handleRegisterSubmit = (formData: FormData) => {
    setClientError('');
    
    if (!phoneNumber) {
      setClientError(locale === 'en' ? 'Phone number is required' : 'Le numéro de téléphone est requis');
      return;
    }

    const pass = formData.get('password') as string;
    const confirm = formData.get('confirmPassword') as string;

    if (!isPasswordStrong(pass)) {
      setClientError(locale === 'en' ? 'Password is too weak' : 'Le mot de passe est trop faible');
      return;
    }

    if (pass !== confirm) {
      setClientError(locale === 'en' ? 'Passwords do not match' : 'Les mots de passe ne correspondent pas');
      return;
    }

    (registerAction as any)(formData);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 relative">
      <div 
        className="absolute inset-0 bg-cover bg-center grayscale mix-blend-multiply opacity-20 dark:opacity-5" 
        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDpgLJ1G1Yg4vgnsL5PBtjqVcHxU-Xr4nF9u7Dlp89zt9N4QY8_TQdYoA9hzZXf1qwy6JQSEVL8WDRa-qs95mbRcdlI_OHuTIR4o8ya_wLUC1mZjI-c_keUz-qcdRE0E5kNlKTGlYClhC3tX75rKT9LBrGof0Mjq4_PaWNl_8vB77LrQesr-5JvaoDOQK25__gkCTNSpqr79BQJAK3IRo-ZEHxYLGJE_EOeqT8ZILFuH-MaMZsBtQVU4psyCCPjok8mh40kXh1iHzwy')" }}
      />
      
      <div className="relative w-full max-w-md bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl border border-forest-green/10 p-10 rounded-3xl shadow-2xl overflow-hidden">
        <AnimatePresence mode="wait">
          {state?.showOtp ? (
            <OtpVerification key="otp" email={state.email} callbackUrl={callbackUrl} />
          ) : (
            <motion.div
              key="register-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="text-center mb-10">
                <div className="size-12 bg-primary mx-auto rounded-xl flex items-center justify-center text-forest-green mb-4 shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-3xl">person_add</span>
                </div>
                <h2 className="font-serif text-3xl font-black text-forest-green dark:text-soft-cream">
                  {locale === 'en' ? 'Create an account' : 'Créer un compte'}
                </h2>
                <p className="text-sm font-medium text-forest-green/60 dark:text-soft-cream/60 mt-2">
                  {locale === 'en' ? 'Join us to facilitate your orders' : 'Rejoignez-nous pour faciliter vos commandes'}
                </p>
              </div>

              <form action={handleRegisterSubmit} className="space-y-4 flex flex-col items-center">
                <input type="hidden" name="callbackUrl" value={callbackUrl || ''} />
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="phone" value={phoneNumber} />
                
                {(state?.error || clientError) && (
                  <div className="w-full bg-red-100 text-red-600 p-3 rounded-lg text-sm text-center font-bold border border-red-200">
                    {state?.error || clientError}
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="w-full space-y-1">
                    <label htmlFor="firstName" className="text-sm font-bold text-forest-green dark:text-soft-cream ml-2">
                      {locale === 'en' ? 'First Name' : 'Prénom'}
                    </label>
                    <input 
                      id="firstName"
                      name="firstName"
                      className="w-full bg-white dark:bg-black/20 border border-forest-green/20 rounded-xl px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-forest-green/40" 
                      placeholder="Ex. Jean" 
                      type="text" 
                      required 
                    />
                  </div>
                  <div className="w-full space-y-1">
                    <label htmlFor="lastName" className="text-sm font-bold text-forest-green dark:text-soft-cream ml-2">
                      {locale === 'en' ? 'Last Name' : 'Nom'}
                    </label>
                    <input 
                      id="lastName"
                      name="lastName"
                      className="w-full bg-white dark:bg-black/20 border border-forest-green/20 rounded-xl px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-forest-green/40" 
                      placeholder="Ex. Dupont" 
                      type="text" 
                      required 
                    />
                  </div>
                </div>

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

                <div className="w-full space-y-1">
                  <label htmlFor="phone" className="text-sm font-bold text-forest-green dark:text-soft-cream ml-2">
                    {locale === 'en' ? 'Phone Number' : 'Numéro de Téléphone'}
                  </label>
                  <div className="phone-input-container">
                    <PhoneInput
                      international
                      defaultCountry="CM"
                      value={phoneNumber}
                      onChange={setPhoneNumber}
                      placeholder={locale === 'en' ? 'Enter phone number' : 'Entrez le numéro'}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="w-full space-y-1">
                  <label htmlFor="password" className="text-sm font-bold text-forest-green dark:text-soft-cream ml-2">
                    {locale === 'en' ? 'Password' : 'Mot de passe'}
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
                  className="w-full bg-forest-green text-white dark:bg-primary dark:text-forest-green font-bold text-base py-4 rounded-xl mt-6 shadow-xl hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isPending ? (locale === 'en' ? 'Creating...' : 'Création en cours...') : (locale === 'en' ? 'Sign Up' : 'M\'inscrire')}
                </button>
              </form>

              <p className="text-center text-xs font-bold text-forest-green/50 mt-10">
                {locale === 'en' ? 'Already have an account?' : 'Vous avez déjà un compte ?'} 
                <Link href={callbackUrl ? `/login?callbackUrl=${callbackUrl}` : "/login"} className="text-primary hover:underline ml-1">
                  {locale === 'en' ? 'Log in' : 'Connectez-vous'}
                </Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
