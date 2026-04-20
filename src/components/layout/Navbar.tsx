'use client';

import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { logoutUser } from '@/app/actions/auth';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SideCart from './SideCart';

function CartBadge() {
  const [mounted, setMounted] = useState(false);
  const count = useCartStore((state) => state.items.reduce((total, item) => total + item.quantity, 0));
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  
  if (count === 0) return <span className="absolute top-1 right-1 size-2 bg-terracotta rounded-full"></span>;
  
  return (
    <motion.span 
      key={count} 
      initial={{ scale: 0.5, y: 10 }} 
      animate={{ scale: 1, y: 0 }} 
      className="absolute -top-1 -right-2 min-w-5 h-5 flex items-center justify-center bg-terracotta text-white rounded-full text-[10px] font-black border-2 border-white dark:border-background-dark px-1 shadow-sm"
    >
      {count}
    </motion.span>
  );
}

export default function Navbar({ session }: { session: any }) {
  const t = useTranslations('Index'); // Just using Index for now, or you can add Navbar specific translations
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const openCart = useCartStore((state) => state.openCart);

  const handleLanguageChange = () => {
    const nextLocale = locale === 'en' ? 'fr' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-forest-green/5 dark:border-soft-cream/5 px-6 lg:px-20 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-forest-green">
                <span className="material-symbols-outlined text-2xl font-bold">eco</span>
              </div>
              <h1 className="font-serif text-2xl font-black tracking-tight dark:text-white">Vegan Delights</h1>
            </Link>
            <nav className="hidden lg:flex items-center gap-8">
              <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/">{t('nav_home')}</Link>
              <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/restaurant">{t('nav_restaurant')}</Link>
              <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/shop">{t('nav_shop')}</Link>
              <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/about">{t('nav_about')}</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-forest-green/40 dark:text-soft-cream/40 text-xl">search</span>
              <input className="bg-forest-green/5 dark:bg-soft-cream/5 border-none rounded-full pl-10 pr-4 py-2 text-sm w-64 focus:ring-1 focus:ring-primary outline-none" placeholder={t('search_placeholder')} type="text"/>
            </div>
            
            <button onClick={handleLanguageChange} className="p-2 hover:bg-primary/10 rounded-full transition-colors flex items-center font-bold text-xs uppercase">
              {locale === 'en' ? 'FR' : 'EN'}
            </button>

            <button onClick={openCart} className="p-2 hover:bg-primary/10 rounded-full transition-colors relative">
              <span className="material-symbols-outlined">shopping_bag</span>
              <CartBadge />
            </button>
            
            {session ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-forest-green max-w-[100px] truncate">{session.name}</span>
                <form action={logoutUser}>
                  <button title="Déconnexion" className="p-2 hover:bg-red-500/10 text-red-600 rounded-full transition-colors flex items-center">
                    <span className="material-symbols-outlined">logout</span>
                  </button>
                </form>
              </div>
            ) : (
              <Link href={`/login?callbackUrl=${pathname || '/'}`} className="p-2 hover:bg-primary/10 rounded-full transition-colors">
                <span className="material-symbols-outlined">person</span>
              </Link>
            )}
          </div>
        </div>
      </header>
      <SideCart />
    </>
  );
}
