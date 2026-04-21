import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { logoutUser } from '@/app/actions/auth';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SideCart from './SideCart';
import { searchProducts } from '@/app/actions/store';

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
  const { openCart, addItem } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuHovered, setIsUserMenuHovered] = useState(false);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'RESTAURANT' | 'SHOP'>('RESTAURANT');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = () => {
    const nextLocale = locale === 'en' ? 'fr' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  // Debounced Search Logic
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchProducts(searchQuery, searchType);
        setSearchResults(results);
        setShowResults(true);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, searchType]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { href: '/', label: t('nav_home'), id: 'home' },
    { href: '/restaurant', label: t('nav_restaurant'), id: 'restaurant' },
    { href: '/shop', label: t('nav_shop'), id: 'shop' },
    { href: '/about', label: t('nav_about'), id: 'about' },
  ];

  const firstName = session?.name?.split(' ')[0] || '';

  const SearchDropdown = ({ isMobile = false }) => (
    <AnimatePresence>
      {showResults && searchResults.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          className={`${isMobile ? 'relative mt-2' : 'absolute top-full left-0 right-0 mt-2'} z-50 bg-white/95 dark:bg-background-dark/95 backdrop-blur-xl border border-forest-green/10 dark:border-soft-cream/10 rounded-2xl shadow-2xl max-h-[400px] overflow-y-auto custom-scrollbar`}
        >
          <div className="p-3 space-y-2">
            {searchResults.map((product) => (
              <div key={product.id} className="flex items-center gap-3 p-2 hover:bg-forest-green/5 dark:hover:bg-soft-cream/5 rounded-xl transition-colors group">
                <Link 
                  href={`/product/${product.id}`} 
                  onClick={() => {
                    setShowResults(false);
                    setIsMenuOpen(false);
                    setSearchQuery('');
                  }}
                  className="flex-1 flex items-center gap-3 cursor-pointer"
                >
                  <div className="size-12 rounded-lg bg-cover bg-center border border-forest-green/5" style={{ backgroundImage: `url(${product.image})` }} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate">{locale === 'en' ? product.nameEn : product.nameFr}</h4>
                    <p className="text-xs text-forest-green/60 dark:text-soft-cream/60">{product.price.toLocaleString(locale)} FCFA</p>
                  </div>
                </Link>
                <button 
                  onClick={() => {
                    addItem({
                      id: product.id,
                      name: locale === 'en' ? product.nameEn : product.nameFr,
                      price: product.price,
                      image: product.image,
                      quantity: 1
                    });
                  }}
                  className="size-8 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-full flex items-center justify-center transition-all active:scale-90"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}
      {showResults && searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
         <motion.div 
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         className={`${isMobile ? 'relative mt-2' : 'absolute top-full left-0 right-0 mt-2'} z-50 bg-white/95 dark:bg-background-dark/95 backdrop-blur-xl border border-forest-green/10 dark:border-soft-cream/10 rounded-2xl p-6 text-center shadow-2xl`}
       >
         <span className="material-symbols-outlined text-4xl text-forest-green/20 dark:text-soft-cream/20 mb-2">search_off</span>
         <p className="text-sm font-bold text-forest-green/40 dark:text-soft-cream/40">Aucun résultat pour "{searchQuery}"</p>
       </motion.div>
      )}
    </AnimatePresence>
  );

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
            {/* Desktop Search Bar */}
            <div className="relative hidden lg:block" ref={searchRef}>
              <div className="flex items-center bg-forest-green/5 dark:bg-soft-cream/5 rounded-full border border-transparent focus-within:border-primary/30 transition-all">
                <div className="flex p-1">
                   <button 
                    onClick={() => setSearchType('RESTAURANT')}
                    className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${searchType === 'RESTAURANT' ? 'bg-primary text-forest-green shadow-sm' : 'text-forest-green/40 dark:text-soft-cream/40'}`}
                  >
                    Res.
                  </button>
                  <button 
                    onClick={() => setSearchType('SHOP')}
                    className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${searchType === 'SHOP' ? 'bg-primary text-forest-green shadow-sm' : 'text-forest-green/40 dark:text-soft-cream/40'}`}
                  >
                    Shop
                  </button>
                </div>
                <div className="relative flex-1 flex items-center">
                  <span className="material-symbols-outlined absolute left-2 text-forest-green/40 dark:text-soft-cream/40 text-xl">
                    {isSearching ? 'progress_activity' : 'search'}
                  </span>
                  <input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                    className="bg-transparent border-none pl-9 pr-4 py-2 text-sm w-48 xl:w-64 outline-none" 
                    placeholder={searchType === 'RESTAURANT' ? 'Rechercher un plat...' : 'Rechercher un produit...'} 
                    type="text"
                  />
                </div>
              </div>
              <SearchDropdown />
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
        className="fixed inset-0 z-[55] bg-white dark:bg-background-dark pt-24 px-10 flex flex-col pointer-events-auto lg:hidden overflow-y-auto custom-scrollbar"
      >
        <div className="flex flex-col gap-8 pb-10">
          {/* Prominent Mobile Search */}
          <div className="relative mt-4 flex flex-col gap-4" ref={mobileSearchRef}>
            <div className="flex p-1 bg-forest-green/5 dark:bg-soft-cream/5 rounded-2xl self-start">
                <button 
                onClick={() => setSearchType('RESTAURANT')}
                className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${searchType === 'RESTAURANT' ? 'bg-primary text-forest-green shadow-md' : 'text-forest-green/40 dark:text-soft-cream/40'}`}
              >
                Restaurant
              </button>
              <button 
                onClick={() => setSearchType('SHOP')}
                className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${searchType === 'SHOP' ? 'bg-primary text-forest-green shadow-md' : 'text-forest-green/40 dark:text-soft-cream/40'}`}
              >
                Boutique
              </button>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-forest-green/40 dark:text-soft-cream/40">
                {isSearching ? 'progress_activity' : 'search'}
              </span>
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-forest-green/5 dark:bg-soft-cream/5 border-2 border-forest-green/10 dark:border-soft-cream/10 rounded-2xl pl-12 pr-4 py-5 text-lg focus:border-primary outline-none transition-all" 
                placeholder={searchType === 'RESTAURANT' ? 'Quel plat vous ferait plaisir ?' : 'Trouvez vos produits bio...'} 
                type="text"
              />
            </div>
            <SearchDropdown isMobile />
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

          <div className="mt-8 pt-8 border-t border-forest-green/10 dark:border-soft-cream/10 space-y-6">
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
