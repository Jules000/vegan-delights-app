'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ui/ProductCard';
import { useTranslations, useLocale } from 'next-intl';
import MenuBanner from '@/components/layout/MenuBanner';
import { Link } from '@/i18n/routing';
import { subscribeToNewsletter } from '@/app/actions/store';

interface HomeClientProps {
  menuOfTheDay: any;
  trendingProducts: any[];
  restaurantProducts: any[];
  shopProducts: any[];
}

export default function HomeClient({ 
  menuOfTheDay, 
  trendingProducts,
  restaurantProducts,
  shopProducts 
}: HomeClientProps) {
  const t = useTranslations('Index');
  const locale = useLocale();
  
  // Newsletter State
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const result = await subscribeToNewsletter(email, locale);
      if (result.success) {
        setStatus('success');
        setMessage(result.alreadySubscribed 
          ? (locale === 'en' ? "You're already part of the family!" : "Vous faites déjà partie de la famille !") 
          : (locale === 'en' ? "Welcome aboard! Check your inbox." : "Bienvenue à bord ! Vérifiez votre boîte mail."));
        setEmail('');
      } else {
        setStatus('error');
        setMessage(locale === 'en' ? "Something went wrong. Please try again." : "Une erreur est survenue. Veuillez réessayer.");
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <>
      {/* Menu of the Day Banner */}
      {menuOfTheDay && <MenuBanner product={menuOfTheDay} />}

      {/* Hero Section (remains the same) ... */}
      <section className="relative w-full h-[70vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "linear-gradient(rgba(13, 27, 13, 0.7), rgba(13, 27, 13, 0.4)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuATlN5K3YzlvzC_Me5_f72VWyVWTZBqN3bjcuFXkqEUrpR7PB9FbLdnTLikyR2KIvXKIPCfu4s16w-IyD_I1V_AH0B6JPE7I8V2ZZFoNqPuMWx0-Lk0RB0eVhOdOtT1vRnSD0NNRYhd8f-tmF8-UQlL18CiSmPU-rfPctnBktimfpBzhbR6aGvc44lSInYEjLhoCk7i8XekPHu6sidDigOa5GshIV2IOhI9z9ISuZ1gtIORzl0A1tRGqwsNZSbLLz7Rraf5_DPvi-tq')" }}
        />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-primary font-bold tracking-[0.3em] uppercase mb-4 text-xs"
          >
            {t('hero_badge')}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-5xl md:text-8xl text-white mb-6 leading-tight"
          >
            {t('hero_headline_1')} <br/>
            <span className="italic text-primary">{t('hero_headline_2')}</span>
          </motion.h2>
          <div className="flex gap-4">
            <Link href="/shop" className="bg-primary hover:bg-primary/90 text-forest-green font-bold px-10 py-4 rounded-full transition-all flex items-center gap-2 group">
              {t('shop_now')}
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Now */}
      <section className="py-24 lg:px-20 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between px-6 mb-16">
            <div>
              <h3 className="font-serif text-5xl mb-4 font-black">{t('trending')}</h3>
              <p className="text-forest-green/60 dark:text-soft-cream/60 text-lg uppercase tracking-widest">{t('trending_sub')}</p>
            </div>
          </div>
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6"
          >
            {trendingProducts.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Sneak Peek Restaurant */}
      <section className="py-24 bg-soft-cream/30 dark:bg-background-dark/30 border-t border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <span className="text-terracotta font-bold text-xs uppercase tracking-[0.3em] mb-4 block">Gastronomie</span>
              <h3 className="font-serif text-5xl font-black text-forest-green mb-6 leading-tight">Cuisiné avec Passion</h3>
              <p className="text-forest-green/60 text-lg">Découvrez nos plats signatures, des burgers végétaux au Ndolé revisité, servis avec élégance.</p>
            </div>
            <Link href="/restaurant" className="px-10 py-4 border-2 border-forest-green text-forest-green font-bold rounded-full hover:bg-forest-green hover:text-white transition-all flex items-center gap-2 whitespace-nowrap">
              Explorer le Restaurant
              <span className="material-symbols-outlined">restaurant</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {restaurantProducts.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Sneak Peek Boutique */}
      <section className="py-24 bg-forest-green text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
            <div className="max-w-2xl text-left">
              <span className="text-primary font-bold text-xs uppercase tracking-[0.3em] mb-4 block">Épicerie Bio</span>
              <h3 className="font-serif text-5xl font-black text-white mb-6 leading-tight font-black">La Boutique Vegan</h3>
              <p className="text-soft-cream/60 text-lg leading-relaxed">Le meilleur des alternatives végétales : fromages fermentés, viandes végétales et produits de garde-manger bio.</p>
            </div>
            <Link href="/shop" className="px-10 py-4 bg-primary text-forest-green font-bold rounded-full hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap">
              Accéder à la Boutique
              <span className="material-symbols-outlined">shopping_bag</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {shopProducts.map((p: any) => (
              <div key={p.id} className="dark">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-32 bg-soft-cream dark:bg-background-dark/50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center px-6"
        >
          <div className="size-24 bg-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-terracotta/20">
             <span className="material-symbols-outlined text-terracotta text-5xl">mark_email_unread</span>
          </div>
          <h3 className="font-serif text-5xl mb-6 font-black tracking-tight text-forest-green">{t('newsletter_title')}</h3>
          <p className="text-forest-green/60 dark:text-soft-cream/60 mb-12 text-xl max-w-2xl mx-auto">{t('newsletter_desc')}</p>
          
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-primary/20 border border-primary/40 px-8 py-6 rounded-3xl max-w-xl mx-auto"
              >
                <p className="text-forest-green font-black text-lg">{message}</p>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto relative group" 
                onSubmit={handleSubscribe}
              >
                <input 
                  className="flex-1 rounded-full px-8 py-5 bg-white shadow-inner border-transparent focus:ring-2 focus:ring-primary outline-none text-forest-green text-lg disabled:opacity-50" 
                  placeholder={t('newsletter_placeholder')} 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                />
                <button 
                  disabled={status === 'loading'}
                  className="bg-forest-green text-white dark:bg-primary dark:text-forest-green font-black px-12 py-5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center min-w-[180px]"
                >
                  {status === 'loading' ? (
                    <div className="size-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : t('subscribe')}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {status === 'error' && (
            <p className="mt-4 text-red-500 font-bold">{message}</p>
          )}

          <p className="mt-8 text-[11px] text-forest-green/40 uppercase tracking-[0.3em] font-bold">Zéro spam. Que de la passion végétale.</p>
        </motion.div>
      </section>
    </>
  );
}
