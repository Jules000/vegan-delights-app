'use client';

import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { logoutUser } from '@/app/actions/auth';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
  const t = useTranslations('Index');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const openCart = useCartStore((state) => state.openCart);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuHovered, setIsUserMenuHovered] = useState(false);

  const handleLanguageChange = () => {
    const nextLocale = locale === 'en' ? 'fr' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  const navLinks = [
    { href: '/', label: t('nav_home'), id: 'home' },
    { href: '/restaurant', label: t('nav_restaurant'), id: 'restaurant' },
    { href: '/shop', label: t('nav_shop'), id: 'shop' },
    { href: '/about', label: t('nav_about'), id: 'about' },
  ];

  const firstName = session?.name?.split(' ')[0] || '';

  return (
    <>
      <header className="sticky top-0 z-[60] w-full bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-forest-green/5 dark:border-soft-cream/5 px-6 lg:px-20 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsMenuOpen(false)}>
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-forest-green">
                <span className="material-symbols-outlined text-2xl font-bold">eco</span>
              </div>
              <h1 className="font-serif text-2xl font-black tracking-tight dark:text-white">Vegan Delights</h1>
            </Link>
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.id} className="text-sm font-semibold hover:text-primary transition-colors" href={link.href as any}>{link.label}</Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative hidden lg:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-forest-green/40 dark:text-soft-cream/40 text-xl">search</span>
              <input className="bg-forest-green/5 dark:bg-soft-cream/5 border-none rounded-full pl-10 pr-4 py-2 text-sm w-64 focus:ring-1 focus:ring-primary outline-none" placeholder={t('search_placeholder')} type="text"/>
            </div>
            
            <button onClick={handleLanguageChange} className="hidden sm:flex p-2 hover:bg-primary/10 rounded-full transition-colors items-center font-bold text-xs uppercase">
              {locale === 'en' ? 'FR' : 'EN'}
            </button>

            <button onClick={openCart} className="p-2 hover:bg-primary/10 rounded-full transition-colors relative">
              <span className="material-symbols-outlined">shopping_bag</span>
              <CartBadge />
            </button>
            
            {session ? (
              <div 
                className="hidden md:block relative"
                onMouseEnter={() => setIsUserMenuHovered(true)}
                onMouseLeave={() => setIsUserMenuHovered(false)}
              >
                <div className="flex items-center gap-2 px-3 py-2 hover:bg-primary/10 rounded-full cursor-pointer transition-colors">
                  <span className="material-symbols-outlined text-2xl">account_circle</span>
                  <span className="text-sm font-bold text-forest-green dark:text-soft-cream">{firstName}</span>
                  <span className={`material-symbols-outlined text-xs transition-transform duration-300 ${isUserMenuHovered ? 'rotate-180' : ''}`}>expand_more</span>
                </div>

                <AnimatePresence>
                  {isUserMenuHovered && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full pt-2 w-48 z-50"
                    >
                      <div className="bg-white dark:bg-background-dark border border-forest-green/10 dark:border-soft-cream/10 rounded-2xl shadow-2xl overflow-hidden py-2">
                        <div className="px-4 py-2 border-b border-forest-green/5 dark:border-soft-cream/5 mb-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-forest-green/40 dark:text-soft-cream/40">Account</p>
                          <p className="text-sm font-bold truncate">{session.name}</p>
                        </div>
                        
                        <form action={logoutUser}>
                          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                            <span className="material-symbols-outlined text-xl">logout</span>
                            {locale === 'en' ? 'Logout' : 'Déconnexion'}
                          </button>
                        </form>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href={`/login?callbackUrl=${pathname || '/'}`} className="hidden md:flex p-2 hover:bg-primary/10 rounded-full transition-colors items-center gap-2 px-4">
                <span className="material-symbols-outlined">person</span>
                <span className="text-sm font-bold uppercase tracking-tighter">{locale === 'en' ? 'Login' : 'Connexion'}</span>
              </Link>
            )}

            {/* Hamburger Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="lg:hidden p-2 text-forest-green dark:text-soft-cream hover:bg-primary/10 rounded-full transition-colors z-[70]"
            >
              <span className="material-symbols-outlined text-3xl">
                {isMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <motion.nav 
        initial={false}
        animate={isMenuOpen ? "open" : "closed"}
        variants={{
          open: { clipPath: "circle(150% at 100% 0)", opacity: 1 },
          closed: { clipPath: "circle(0% at 100% 0)", opacity: 0 }
        }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
        className="fixed inset-0 z-[55] bg-white dark:bg-background-dark pt-28 px-10 flex flex-col pointer-events-auto lg:hidden"
      >
        <div className="flex flex-col gap-10 mt-4">
          {/* Prominent Mobile Search */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-forest-green/40 dark:text-soft-cream/40">search</span>
            <input 
              className="w-full bg-forest-green/5 dark:bg-soft-cream/5 border-2 border-forest-green/10 dark:border-soft-cream/10 rounded-2xl pl-12 pr-4 py-5 text-lg focus:border-primary outline-none transition-all" 
              placeholder={t('search_placeholder')} 
              type="text"
            />
          </div>

          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <motion.div 
                whileTap={{ scale: 0.95 }}
                key={link.id}
              >
                <Link 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-4xl font-serif font-black text-forest-green dark:text-soft-cream hover:text-primary transition-colors block" 
                  href={link.href as any}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-auto pt-10 pb-12 border-t border-forest-green/10 dark:border-soft-cream/10 space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-bold text-forest-green/40 dark:text-soft-cream/40 uppercase tracking-widest text-sm">Language</span>
              <button 
                onClick={handleLanguageChange} 
                className="px-6 py-2 bg-primary/10 border border-primary/20 text-forest-green dark:text-soft-cream rounded-full font-black flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">language</span>
                {locale === 'en' ? 'Français' : 'English'}
              </button>
            </div>
            
            {!session ? (
              <Link 
                href={`/login?callbackUrl=${pathname || '/'}`} 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between p-5 bg-forest-green/5 dark:bg-soft-cream/5 rounded-2xl border border-forest-green/10 dark:border-soft-cream/10 group"
              >
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-3xl">account_circle</span>
                  <span className="font-bold text-lg">{locale === 'en' ? 'My Account' : 'Mon Compte'}</span>
                </div>
                <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
              </Link>
            ) : (
              <div className="flex items-center justify-between p-5 bg-terracotta/5 rounded-2xl border border-terracotta/10">
                 <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-3xl">face</span>
                  <span className="font-bold text-lg truncate max-w-[120px]">{firstName}</span>
                </div>
                <form action={logoutUser}>
                  <button className="flex items-center gap-2 text-red-500 font-bold">
                    <span className="material-symbols-outlined">logout</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </motion.nav>
      <SideCart />
    </>
  );
}
