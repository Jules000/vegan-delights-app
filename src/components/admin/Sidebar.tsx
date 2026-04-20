'use client';

import { logoutUser } from '@/app/actions/auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-black/5 flex-col justify-between p-6 bg-admin-sage hidden lg:flex h-screen sticky top-0">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <div className="bg-admin-primary p-2 rounded-lg">
            <span className="material-symbols-outlined text-white font-bold">eco</span>
          </div>
          <div>
            <h1 className="text-admin-primary text-lg font-bold leading-none">VeganEco</h1>
            <p className="text-admin-primary/60 text-xs font-medium uppercase tracking-wider mt-1">Admin Portal</p>
          </div>
        </div>
        
        <nav className="flex flex-col gap-2">
          <Link href="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === '/admin' ? 'bg-admin-primary text-white shadow-md shadow-admin-primary/20' : 'text-admin-forest/60 hover:bg-white/50'}`}>
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm font-semibold">Vue d'ensemble</span>
          </Link>
          <Link href="/admin/products" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname.includes('/admin/products') && !pathname.includes('/admin/subcategories') ? 'bg-admin-primary text-white shadow-md shadow-admin-primary/20' : 'text-admin-forest/60 hover:bg-white/50'}`}>
            <span className="material-symbols-outlined">inventory_2</span>
            <span className="text-sm font-semibold">Produits</span>
          </Link>
          <Link href="/admin/subcategories" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${(pathname === '/admin/subcategories') ? 'bg-admin-primary text-white shadow-md shadow-admin-primary/20' : 'text-admin-forest/60 hover:bg-white/50'}`}>
            <span className="material-symbols-outlined">category</span>
            <span className="text-sm font-semibold">Sous-Catégories</span>
          </Link>
          <Link href="/admin/orders" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname.includes('/admin/orders') ? 'bg-admin-primary text-white shadow-md shadow-admin-primary/20' : 'text-admin-forest/60 hover:bg-white/50'}`}>
            <span className="material-symbols-outlined">shopping_cart</span>
            <span className="text-sm font-semibold">Commandes</span>
          </Link>
          <Link href="/admin/customers" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === '/admin/customers' ? 'bg-admin-primary text-white shadow-md shadow-admin-primary/20' : 'text-admin-forest/60 hover:bg-white/50'}`}>
            <span className="material-symbols-outlined">group</span>
            <span className="text-sm font-semibold">Clients</span>
          </Link>
          <Link href="/admin/invoices" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === '/admin/invoices' ? 'bg-admin-primary text-white shadow-md shadow-admin-primary/20' : 'text-admin-forest/60 hover:bg-white/50'}`}>
            <span className="material-symbols-outlined">receipt_long</span>
            <span className="text-sm font-semibold">Factures</span>
          </Link>
        </nav>
      </div>

      <div className="mt-auto pt-6">
        <form action={logoutUser}>
          <button className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-admin-accent hover:bg-admin-accent/10 cursor-pointer transition-colors">
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-semibold">Déconnexion</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
