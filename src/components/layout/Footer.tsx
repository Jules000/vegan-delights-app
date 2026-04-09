import { Link } from '@/i18n/routing';

export default function Footer() {
  return (
    <footer className="bg-forest-green text-white py-16 border-t border-white/5 px-6 lg:px-20 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="size-6 bg-primary rounded flex items-center justify-center text-forest-green">
              <span className="material-symbols-outlined text-lg">eco</span>
            </div>
            <h2 className="font-serif text-xl">Vegan Delights</h2>
          </div>
          <p className="text-white/50 text-sm leading-relaxed mb-6">Redefining plant-based dining through elegance, sustainability, and absolute culinary excellence.</p>
          <div className="flex gap-4">
            <a className="size-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-forest-green transition-all" href="#">
              <span className="material-symbols-outlined text-sm">public</span>
            </a>
            <a className="size-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-forest-green transition-all" href="#">
              <span className="material-symbols-outlined text-sm">alternate_email</span>
            </a>
          </div>
        </div>
        <div>
          <h5 className="font-bold mb-6 text-primary uppercase text-xs tracking-widest">Shop</h5>
          <ul className="space-y-4 text-sm text-white/60">
            <li><Link className="hover:text-white transition-colors" href="/products">Our Cheeses</Link></li>
            <li><Link className="hover:text-white transition-colors" href="/products">Meat Alternatives</Link></li>
            <li><Link className="hover:text-white transition-colors" href="/products">Gift Cards</Link></li>
            <li><Link className="hover:text-white transition-colors" href="/products">Bulk Orders</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-6 text-primary uppercase text-xs tracking-widest">Support</h5>
          <ul className="space-y-4 text-sm text-white/60">
            <li><a className="hover:text-white transition-colors" href="#">Delivery Info</a></li>
            <li><a className="hover:text-white transition-colors" href="#">Return Policy</a></li>
            <li><a className="hover:text-white transition-colors" href="#">Wholesale</a></li>
            <li><a className="hover:text-white transition-colors" href="#">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-6 text-primary uppercase text-xs tracking-widest">Company</h5>
          <ul className="space-y-4 text-sm text-white/60">
            <li><a className="hover:text-white transition-colors" href="#">Our Story</a></li>
            <li><a className="hover:text-white transition-colors" href="#">Sustainability</a></li>
            <li><a className="hover:text-white transition-colors" href="#">Careers</a></li>
            <li><a className="hover:text-white transition-colors" href="#">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-white/40 uppercase tracking-widest">
        <p>© 2026 Vegan Delights. All Rights Reserved.</p>
        <div className="flex gap-8">
          <a className="hover:text-white" href="#">Privacy Policy</a>
          <a className="hover:text-white" href="#">Terms of Service</a>
          <a className="hover:text-white" href="#">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
