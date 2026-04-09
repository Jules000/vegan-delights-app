"use client";

import { Link } from '@/i18n/routing';
import { useActionState } from 'react';
import { loginUser } from '@/app/actions/auth';

const initialState = { error: '' };

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginUser as any, initialState);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 relative">
      <div 
        className="absolute inset-0 bg-cover bg-center grayscale mix-blend-multiply opacity-20 dark:opacity-5" 
        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuATlN5K3YzlvzC_Me5_f72VWyVWTZBqN3bjcuFXkqEUrpR7PB9FbLdnTLikyR2KIvXKIPCfu4s16w-IyD_I1V_AH0B6JPE7I8V2ZZFoNqPuMWx0-Lk0RB0eVhOdOtT1vRnSD0NNRYhd8f-tmF8-UQlL18CiSmPU-rfPctnBktimfpBzhbR6aGvc44lSInYEjLhoCk7i8XekPHu6sidDigOa5GshIV2IOhI9z9ISuZ1gtIORzl0A1tRGqwsNZSbLLz7Rraf5_DPvi-tq')" }}
      />
      
      <div className="relative w-full max-w-md bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl border border-forest-green/10 p-10 rounded-3xl shadow-2xl">
        <div className="text-center mb-10">
          <div className="size-12 bg-primary mx-auto rounded-xl flex items-center justify-center text-forest-green mb-4 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-3xl">eco</span>
          </div>
          <h2 className="font-serif text-3xl font-black text-forest-green dark:text-soft-cream">Bon retour</h2>
          <p className="text-sm font-medium text-forest-green/60 dark:text-soft-cream/60 mt-2">Connectez-vous pour accéder à vos commandes</p>
        </div>

        <form action={formAction} className="space-y-5 flex flex-col items-center">
          {state?.error && (
            <div className="w-full bg-red-100 text-red-600 p-3 rounded-lg text-sm text-center">
              {state.error}
            </div>
          )}
          
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

          <div className="w-full flex justify-between items-center px-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="accent-primary w-4 h-4" />
              <span className="text-xs font-bold text-forest-green/60 group-hover:text-forest-green transition-colors">Se souvenir de moi</span>
            </label>
            <a href="#" className="text-xs font-bold text-primary hover:underline">Mot de passe oublié ?</a>
          </div>

          <button 
            disabled={isPending}
            className="w-full bg-forest-green text-white dark:bg-primary dark:text-forest-green font-bold text-base py-4 rounded-xl mt-6 shadow-xl hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50"
          >
            {isPending ? 'Connexion en cours...' : 'Connexion'}
          </button>
        </form>

        <p className="text-center text-xs font-bold text-forest-green/50 mt-10">
          Nouveau sur Vegan Delights ? <Link href="/register" className="text-primary hover:underline ml-1">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
}
