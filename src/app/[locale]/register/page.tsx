"use client";

import { Link } from '@/i18n/routing';
import { useActionState } from 'react';
import { registerUser } from '@/app/actions/auth';

const initialState = { error: '' };

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerUser as any, initialState);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 relative">
      <div 
        className="absolute inset-0 bg-cover bg-center grayscale mix-blend-multiply opacity-20 dark:opacity-5" 
        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDpgLJ1G1Yg4vgnsL5PBtjqVcHxU-Xr4nF9u7Dlp89zt9N4QY8_TQdYoA9hzZXf1qwy6JQSEVL8WDRa-qs95mbRcdlI_OHuTIR4o8ya_wLUC1mZjI-c_keUz-qcdRE0E5kNlKTGlYClhC3tX75rKT9LBrGof0Mjq4_PaWNl_8vB77LrQesr-5JvaoDOQK25__gkCTNSpqr79BQJAK3IRo-ZEHxYLGJE_EOeqT8ZILFuH-MaMZsBtQVU4psyCCPjok8mh40kXh1iHzwy')" }}
      />
      
      <div className="relative w-full max-w-md bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl border border-forest-green/10 p-10 rounded-3xl shadow-2xl">
        <div className="text-center mb-10">
          <div className="size-12 bg-primary mx-auto rounded-xl flex items-center justify-center text-forest-green mb-4 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-3xl">person_add</span>
          </div>
          <h2 className="font-serif text-3xl font-black text-forest-green dark:text-soft-cream">Créer un compte</h2>
          <p className="text-sm font-medium text-forest-green/60 dark:text-soft-cream/60 mt-2">Rejoignez-nous pour faciliter vos commandes</p>
        </div>

        <form action={formAction} className="space-y-4 flex flex-col items-center">
          {state?.error && (
            <div className="w-full bg-red-100 text-red-600 p-3 rounded-lg text-sm text-center">
              {state.error}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="w-full space-y-1">
              <label htmlFor="firstName" className="text-sm font-bold text-forest-green dark:text-soft-cream ml-2">Prénom</label>
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
              <label htmlFor="lastName" className="text-sm font-bold text-forest-green dark:text-soft-cream ml-2">Nom</label>
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
            <label htmlFor="email" className="text-sm font-bold text-forest-green dark:text-soft-cream ml-2">Adresse Email</label>
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
            <label htmlFor="password" className="text-sm font-bold text-forest-green dark:text-soft-cream ml-2">Mot de passe</label>
            <input 
              id="password"
              name="password"
              className="w-full bg-white dark:bg-black/20 border border-forest-green/20 rounded-xl px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-forest-green/40" 
              placeholder="••••••••" 
              type="password" 
              required 
            />
          </div>

          <button 
            disabled={isPending}
            className="w-full bg-forest-green text-white dark:bg-primary dark:text-forest-green font-bold text-base py-4 rounded-xl mt-6 shadow-xl hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50"
          >
            {isPending ? 'Création en cours...' : 'M\'inscrire'}
          </button>
        </form>

        <p className="text-center text-xs font-bold text-forest-green/50 mt-10">
          Vous avez déjà un compte ? <Link href="/login" className="text-primary hover:underline ml-1">Connectez-vous</Link>
        </p>
      </div>
    </div>
  );
}
