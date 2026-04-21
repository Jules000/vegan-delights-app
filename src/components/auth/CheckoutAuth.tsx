"use client";

import { useState, useActionState, useRef } from 'react';
import { loginUser, registerUser } from '@/app/actions/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import OtpVerification from './OtpVerification';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function CheckoutAuth() {
  const t = useTranslations('Index');
  const locale = useLocale();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<any>('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [clientError, setClientError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  
  const [loginState, loginAction, isLoginPending] = useActionState(loginUser as any, { error: '', showOtp: false, email: '' });
  const [registerState, registerAction, isRegisterPending] = useActionState(registerUser as any, { error: '', showOtp: false, email: '' });

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

  // If register returns showOtp, we prioritize showing the OTP verification
  if (registerState?.showOtp || loginState?.showOtp) {
    return (
      <div className="bg-white dark:bg-forest-green/10 border border-forest-green/10 rounded-2xl p-8 shadow-sm">
        <OtpVerification 
          email={registerState?.email || loginState?.email} 
          callbackUrl="/checkout" 
        />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-forest-green/10 border border-forest-green/10 rounded-2xl p-8 shadow-sm">
      <div className="flex bg-forest-green/5 p-1.5 rounded-xl mb-8">
        <button 
          onClick={() => { setMode('login'); setClientError(''); }}
          className={`flex-1 py-3 rounded-lg text-sm font-black transition-all ${mode === 'login' ? 'bg-white text-forest-green shadow-sm' : 'text-forest-green/40 hover:text-forest-green/60'}`}
        >
          {locale === 'en' ? 'Log In' : 'Connexion'}
        </button>
        <button 
          onClick={() => { setMode('register'); setClientError(''); }}
          className={`flex-1 py-3 rounded-lg text-sm font-black transition-all ${mode === 'register' ? 'bg-white text-forest-green shadow-sm' : 'text-forest-green/40 hover:text-forest-green/60'}`}
        >
          {locale === 'en' ? 'Register' : 'Inscription'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'login' ? (
          <motion.form 
            key="login"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            action={loginAction} 
            className="space-y-4"
          >
            <h3 className="font-bold text-xl mb-2">
              {locale === 'en' ? 'Welcome back' : 'Bon retour parmi nous'}
            </h3>
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="callbackUrl" value="/checkout" />
            
            <div className="space-y-1">
              <input 
                name="email" 
                className="w-full bg-white dark:bg-black/20 border border-forest-green/20 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary" 
                placeholder="Email" 
                type="email" 
                required 
              />
            </div>
            <div className="space-y-1 relative">
              <input 
                name="password" 
                className="w-full bg-white dark:bg-black/20 border border-forest-green/20 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary" 
                placeholder={locale === 'en' ? 'Password' : 'Mot de passe'} 
                type={showPassword ? "text" : "password"} 
                required 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-forest-green/40 hover:text-forest-green transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>

            {loginState?.error && (
              <p className="text-red-500 text-sm font-bold text-center bg-red-50 p-2 rounded-lg border border-red-100">
                {loginState.error}
              </p>
            )}

            <button 
              disabled={isLoginPending}
              className="w-full bg-forest-green text-white font-black py-4 rounded-xl hover:brightness-110 active:scale-95 transition-all text-center flex items-center justify-center gap-2"
            >
              {isLoginPending ? <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (locale === 'en' ? 'Log In' : 'Se connecter')}
            </button>
          </motion.form>
        ) : (
          <motion.form 
            key="register"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            action={handleRegisterSubmit} 
            className="space-y-4"
          >
            <h3 className="font-bold text-xl mb-2">
              {locale === 'en' ? 'Create an account' : 'Créer un compte'}
            </h3>
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="callbackUrl" value="/checkout" />
            <input type="hidden" name="phone" value={phoneNumber} />
            
            <div className="grid grid-cols-2 gap-4">
              <input 
                name="firstName" 
                className="w-full bg-white dark:bg-black/20 border border-forest-green/20 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary" 
                placeholder={locale === 'en' ? 'First Name' : 'Prénom'} 
                type="text" 
                required 
              />
              <input 
                name="lastName" 
                className="w-full bg-white dark:bg-black/20 border border-forest-green/20 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary" 
                placeholder={locale === 'en' ? 'Last Name' : 'Nom'} 
                type="text" 
                required 
              />
            </div>

            <div className="space-y-1">
              <input 
                name="email" 
                className="w-full bg-white dark:bg-black/20 border border-forest-green/20 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary" 
                placeholder="Email" 
                type="email" 
                required 
              />
            </div>

            <div className="space-y-1">
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
            
            <div className="space-y-1 relative">
              <input 
                name="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white dark:bg-black/20 border border-forest-green/20 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary" 
                placeholder={locale === 'en' ? 'Password' : 'Mot de passe'} 
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

            <input 
              name="confirmPassword" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white dark:bg-black/20 border border-forest-green/20 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary" 
              placeholder={locale === 'en' ? 'Confirm Password' : 'Confirmer le mot de passe'} 
              type={showPassword ? "text" : "password"} 
              required 
            />

            {(registerState?.error || clientError) && (
              <p className="text-red-500 text-sm font-bold text-center bg-red-50 p-2 rounded-lg border border-red-100">
                {registerState?.error || clientError}
              </p>
            )}

            <button 
              disabled={isRegisterPending}
              className="w-full bg-primary text-forest-green font-black py-4 rounded-xl hover:brightness-110 active:scale-95 transition-all text-center flex items-center justify-center gap-2"
            >
              {isRegisterPending ? <div className="size-4 border-2 border-forest-green/30 border-t-forest-green rounded-full animate-spin" /> : (locale === 'en' ? 'Create Account' : 'Créer un compte')}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
