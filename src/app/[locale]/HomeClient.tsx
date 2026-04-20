'use client';

import { motion } from 'framer-motion';
import ProductCard from '@/components/ui/ProductCard';
import { useTranslations } from 'next-intl';
import MenuBanner from '@/components/layout/MenuBanner';
import { Link } from '@/i18n/routing';

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

  return (
    <>
      {/* Menu of the Day Banner */}
      {menuOfTheDay && <MenuBanner product={menuOfTheDay} />}

      {/* Hero Section */}
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6"
          >
            {trendingProducts.map((p) => (
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
            {restaurantProducts.map((p) => (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {shopProducts.map((p) => (
              <div key={p.id} className="dark">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curated Collections */}
      <section className="py-24 bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="font-serif text-5xl font-black text-forest-green dark:text-soft-cream mb-4 tracking-tighter">Collections Sélectives</h3>
            <div className="w-24 h-2 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative h-[600px] rounded-3xl overflow-hidden group cursor-pointer col-span-1 md:col-span-2">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" 
                style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuCMeuwOFH-E8_p3ZC9TxBK6uUtzU8xldBPWMAEUD2-Oy6A-LwdaTArnBrXIJPr-9cQ8XChYFSFc-ZkwGHtW0N36KykzTfdPMor6CmP9Vhh8cwXZy9l0OcKkhNLJcq_tjdrPN6vmp-EuvhzuoAkNmoKTMpMOO_wkWGXHsjaQ8MLFbCfB2aAzm6ci-RUzQd6qBsz-pQJIp0fpYIoyCbjMuSaz43ZaSpbkPZ3n7jE7DXUv_gFyxSbwN85UzOLOfkwQJpYhZw80kyTp0t9m')" }}
              />
              <div className="absolute inset-0 p-12 flex flex-col justify-end text-white">
                <span className="text-primary font-bold uppercase tracking-[0.4em] text-xs mb-4">Innovation</span>
                <h4 className="font-serif text-5xl mb-6 font-black tracking-tight">Viandes Next-Gen</h4>
                <p className="mb-8 text-white/70 max-w-md text-lg leading-relaxed font-light">Découvrez le seitan, le jackfruit et nos mélanges de champignons qui redéfinissent ce qui est possible.</p>
                <Link href="/shop" className="w-fit text-sm font-black uppercase tracking-[0.2em] bg-white text-forest-green px-8 py-3 rounded-full hover:bg-primary transition-colors">Découvrir la collection</Link>
              </div>
            </div>
            
            <div className="relative h-[600px] rounded-3xl overflow-hidden group cursor-pointer shadow-2xl">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" 
                style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuAknkgIPy3iDfCUcheFAdfRN0AxxQVx91HfZ_8otDiSzS0_xmnYEKvKBh-PNyvbEMSy_L-nceAYUR3TxaGu8cbTki4lhc1FLvI_o81Axtya-nMd0haUo18Yay86OdDbXXpgDte1P9_kiPeQaQ-7rTV3gtcEjOct9AXewsp-yZm814vrKF-HY8d4n7bfBcXAHlmY5Ex7gXAw0LXhpsFkMhs8OCGlJsF5lSmlRPWWizB-v0ZXMDoeOAQSVgriS2FrpjZQs-P4cwSbAqVe')" }}
              />
              <div className="absolute inset-0 p-10 flex flex-col justify-end text-white">
                <span className="text-primary font-bold uppercase tracking-[0.4em] text-xs mb-4">Essentiels</span>
                <h4 className="font-serif text-5xl mb-6 font-black tracking-tight">Le Garde-Manger</h4>
                <p className="mb-8 text-white/70 text-lg leading-relaxed font-light">Incontournables biologiques pour une cuisine végane moderne et raffinée.</p>
                <Link href="/shop" className="w-fit text-sm font-black uppercase tracking-[0.2em] bg-primary text-forest-green px-8 py-3 rounded-full hover:brightness-110 transition-all">Parcourir</Link>
              </div>
            </div>
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
          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input className="flex-1 rounded-full px-8 py-5 bg-white shadow-inner border-transparent focus:ring-2 focus:ring-primary outline-none text-forest-green text-lg" placeholder={t('newsletter_placeholder')} type="email"/>
            <button className="bg-forest-green text-white dark:bg-primary dark:text-forest-green font-black px-12 py-5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl">{t('subscribe')}</button>
          </form>
          <p className="mt-8 text-[11px] text-forest-green/40 uppercase tracking-[0.3em] font-bold">Zéro spam. Que de la passion végétale.</p>
        </motion.div>
      </section>
    </>
  );
}
