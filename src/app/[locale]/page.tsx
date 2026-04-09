'use client';

import { motion } from 'framer-motion';
import ProductCard, { Product } from '@/components/ui/ProductCard';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { getTrendingProducts } from '@/app/actions/store';

export default function Home() {
  const t = useTranslations('Index');
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);

  useEffect(() => {
    getTrendingProducts(10).then(data => setTrendingProducts(data));
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "linear-gradient(rgba(13, 27, 13, 0.6), rgba(13, 27, 13, 0.3)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuATlN5K3YzlvzC_Me5_f72VWyVWTZBqN3bjcuFXkqEUrpR7PB9FbLdnTLikyR2KIvXKIPCfu4s16w-IyD_I1V_AH0B6JPE7I8V2ZZFoNqPuMWx0-Lk0RB0eVhOdOtT1vRnSD0NNRYhd8f-tmF8-UQlL18CiSmPU-rfPctnBktimfpBzhbR6aGvc44lSInYEjLhoCk7i8XekPHu6sidDigOa5GshIV2IOhI9z9ISuZ1gtIORzl0A1tRGqwsNZSbLLz7Rraf5_DPvi-tq')" }}
        />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-primary font-bold tracking-widest uppercase mb-4 text-sm animate-pulse"
          >
            {t('hero_badge')}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-5xl md:text-7xl text-white mb-6 max-w-4xl leading-tight"
          >
            {t('hero_headline_1')} <br/>
            <span className="italic text-primary">{t('hero_headline_2')}</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white/80 text-lg md:text-xl max-w-2xl mb-10 font-light"
          >
            {t('hero_subheadline')}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button className="bg-primary hover:bg-primary/90 text-forest-green font-bold px-10 py-4 rounded-full transition-all flex items-center gap-2 group">
              {t('shop_now')}
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold px-10 py-4 rounded-full transition-all border border-white/30">
              {t('view_recipes')}
            </button>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent"></div>
        </motion.div>
      </section>

      {/* Trending Now */}
      <section className="py-20 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between px-6 mb-12"
          >
            <div>
              <h3 className="font-serif text-4xl mb-2">{t('trending')}</h3>
              <p className="text-forest-green/60 dark:text-soft-cream/60">{t('trending_sub')}</p>
            </div>
            <div className="flex gap-2">
              <button className="size-12 rounded-full border border-forest-green/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all group">
                <span className="material-symbols-outlined group-hover:text-forest-green cursor-pointer">chevron_left</span>
              </button>
              <button className="size-12 rounded-full border border-forest-green/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all group">
                <span className="material-symbols-outlined group-hover:text-forest-green cursor-pointer">chevron_right</span>
              </button>
            </div>
          </motion.div>
          <div 
            className="flex overflow-x-auto gap-8 px-6 pb-12 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {trendingProducts.length > 0 ? trendingProducts.map((p, idx) => (
              <div key={p.id} className="snap-center">
                <ProductCard product={p} />
              </div>
            )) : (
              <div className="w-full text-center py-20 text-forest-green/50 animate-pulse">
                Chargement des tendances mondiales...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Curated Collections */}
      <section className="bg-forest-green py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="font-serif text-4xl text-soft-cream mb-4">{t('collections')}</h3>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative h-[500px] rounded-2xl overflow-hidden group cursor-pointer col-span-1 md:col-span-2"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" 
                style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.7)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuCMeuwOFH-E8_p3ZC9TxBK6uUtzU8xldBPWMAEUD2-Oy6A-LwdaTArnBrXIJPr-9cQ8XChYFSFc-ZkwGHtW0N36KykzTfdPMor6CmP9Vhh8cwXZy9l0OcKkhNLJcq_tjdrPN6vmp-EuvhzuoAkNmoKTMpMOO_wkWGXHsjaQ8MLFbCfB2aAzm6ci-RUzQd6qBsz-pQJIp0fpYIoyCbjMuSaz43ZaSpbkPZ3n7jE7DXUv_gFyxSbwN85UzOLOfkwQJpYhZw80kyTp0t9m')" }}
              />
              <div className="absolute inset-0 p-10 flex flex-col justify-end text-white">
                <h4 className="font-serif text-4xl mb-4">Next-Gen Meats</h4>
                <p className="mb-6 text-white/70 max-w-md">Discover seitan, jackfruit, and mushroom blends that redefine what&apos;s possible.</p>
                <button className="w-fit text-sm font-bold uppercase tracking-widest border-b-2 border-primary pb-1 group-hover:text-primary transition-colors">Explore Collection</button>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative h-[500px] rounded-2xl overflow-hidden group cursor-pointer"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" 
                style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.7)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuAknkgIPy3iDfCUcheFAdfRN0AxxQVx91HfZ_8otDiSzS0_xmnYEKvKBh-PNyvbEMSy_L-nceAYUR3TxaGu8cbTki4lhc1FLvI_o81Axtya-nMd0haUo18Yay86OdDbXXpgDte1P9_kiPeQaQ-7rTV3gtcEjOct9AXewsp-yZm814vrKF-HY8d4n7bfBcXAHlmY5Ex7gXAw0LXhpsFkMhs8OCGlJsF5lSmlRPWWizB-v0ZXMDoeOAQSVgriS2FrpjZQs-P4cwSbAqVe')" }}
              />
              <div className="absolute inset-0 p-10 flex flex-col justify-end text-white">
                <h4 className="font-serif text-4xl mb-4">The Pantry</h4>
                <p className="mb-6 text-white/70">Organic staples for the modern vegan kitchen.</p>
                <button className="w-fit text-sm font-bold uppercase tracking-widest border-b-2 border-primary pb-1 group-hover:text-primary transition-colors">Explore</button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-soft-cream dark:bg-background-dark/50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center px-6"
        >
          <span className="material-symbols-outlined text-terracotta text-5xl mb-6">mark_email_unread</span>
          <h3 className="font-serif text-3xl mb-4">{t('newsletter_title')}</h3>
          <p className="text-forest-green/60 dark:text-soft-cream/60 mb-8">{t('newsletter_desc')}</p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input className="flex-1 rounded-full px-6 py-4 bg-white dark:bg-white/5 border border-forest-green/10 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder={t('newsletter_placeholder')} type="email"/>
            <button className="bg-forest-green text-white dark:bg-primary dark:text-forest-green font-bold px-8 py-4 rounded-full hover:shadow-lg transition-all">{t('subscribe')}</button>
          </form>
          <p className="mt-4 text-[10px] text-forest-green/40 uppercase tracking-widest">Unsubscribe at any time. Respect for your inbox.</p>
        </motion.div>
      </section>
    </>
  );
}
