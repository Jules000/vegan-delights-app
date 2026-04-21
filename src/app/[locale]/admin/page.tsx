import { getDashboardStats, getMonthlyRevenueData } from "@/app/actions/admin";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [stats, chartData] = await Promise.all([
    getDashboardStats(),
    getMonthlyRevenueData()
  ]);

  const maxRevenue = Math.max(...chartData.map((d: any) => d.total), 1);

  return (
    <>
      <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
        <div>
          <h2 className="text-4xl font-black leading-tight tracking-tight text-admin-forest">Vue d'ensemble</h2>
          <p className="text-admin-forest/60 font-medium">Performances de <span className="text-admin-primary font-bold">tous les temps</span></p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/finance" className="flex items-center gap-2 px-4 py-2 bg-white border border-black/5 rounded-xl text-sm font-bold text-admin-forest/80 hover:bg-admin-sage transition-colors shadow-sm">
            <span className="material-symbols-outlined text-lg">payments</span>
            Détails Finances
          </Link>
          <button className="flex items-center gap-2 px-5 py-2 bg-admin-primary text-white rounded-xl text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-admin-primary/20">
            <span className="material-symbols-outlined text-lg">download</span>
            Rapport
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="flex flex-col gap-2 rounded-2xl p-6 bg-white shadow-sm border border-black/5 hover:border-admin-primary/30 transition-colors">
          <div className="flex justify-between items-start">
            <p className="text-admin-forest/40 text-sm font-semibold uppercase tracking-wider">Revenus Total</p>
            <span className="material-symbols-outlined text-admin-primary bg-admin-primary/10 p-1.5 rounded-lg text-lg">payments</span>
          </div>
          <p className="text-3xl font-bold tracking-tight text-admin-forest">{stats.totalRevenue.toFixed(0)} FCFA</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-admin-primary flex items-center text-sm font-bold">
              <span className="material-symbols-outlined text-sm">trending_up</span> Actif
            </span>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 rounded-2xl p-6 bg-white shadow-sm border border-black/5 hover:border-admin-primary/30 transition-colors">
          <div className="flex justify-between items-start">
            <p className="text-admin-forest/40 text-sm font-semibold uppercase tracking-wider">Commandes En Attente</p>
            <span className="material-symbols-outlined text-admin-primary bg-admin-primary/10 p-1.5 rounded-lg text-lg">shopping_bag</span>
          </div>
          <p className="text-3xl font-bold tracking-tight text-admin-forest">{stats.activeOrdersCount}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-admin-forest/40 text-xs font-medium">Commandes nécessitant action</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 rounded-2xl p-6 bg-white shadow-sm border border-black/5 hover:border-admin-primary/30 transition-colors">
          <div className="flex justify-between items-start">
            <p className="text-admin-forest/40 text-sm font-semibold uppercase tracking-wider">Panier Moyen</p>
            <span className="material-symbols-outlined text-admin-primary bg-admin-primary/10 p-1.5 rounded-lg text-lg">receipt</span>
          </div>
          <p className="text-3xl font-bold tracking-tight text-admin-forest">{stats.avgOrderValue.toFixed(0)} FCFA</p>
          <div className="flex items-center gap-1.5 mt-1">
             <span className="text-admin-forest/40 text-xs font-medium">Globale</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 rounded-2xl p-6 bg-white shadow-sm border border-black/5 hover:border-admin-primary/30 transition-colors">
          <div className="flex justify-between items-start">
            <p className="text-admin-forest/40 text-sm font-semibold uppercase tracking-wider">Total Clients</p>
            <span className="material-symbols-outlined text-admin-primary bg-admin-primary/10 p-1.5 rounded-lg text-lg">person_add</span>
          </div>
          <p className="text-3xl font-bold tracking-tight text-admin-forest">{stats.newCustomersCount}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-admin-forest/40 text-xs font-medium">Inscrits ou invités via commande</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 rounded-2xl border border-black/5 bg-white shadow-sm p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-admin-forest">Statistiques de Ventes</h3>
              <p className="text-admin-forest/50 text-sm">Évolution mensuelle des commandes complétées.</p>
            </div>
            <Link href="/admin/finance" className="text-xs font-bold text-admin-primary flex items-center gap-1 hover:underline">
               Voir rapport complet <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="h-64 mt-4 w-full flex items-end justify-between gap-2 px-2">
            {chartData.slice(-6).map((d: any, index: number) => (
              <div key={index} className="flex-1 flex flex-col items-center group">
                <div 
                  className="w-full bg-admin-primary/10 group-hover:bg-admin-primary transition-all rounded-t-lg relative"
                  style={{ height: `${(d.total / maxRevenue) * 100}%`, minHeight: '4px' }}
                >
                  <div className="absolute bottom-full mb-2 bg-admin-forest text-white text-[8px] py-0.5 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 font-bold left-1/2 -translate-x-1/2">
                    {d.total.toFixed(0)}
                  </div>
                </div>
                <p className="text-[10px] font-bold text-admin-forest/40 mt-2 uppercase tracking-tighter w-full text-center truncate">{d.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white shadow-sm p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-admin-forest">Système</h3>
          </div>
          <div className="flex flex-col gap-4 mt-2">
            <div className="p-4 bg-admin-cream rounded-xl border border-black/5">
              <p className="font-bold text-admin-forest">Moteur de Base de Données</p>
              <p className="text-xs text-admin-forest/60 mt-1">PostgreSQL (Connecté)</p>
            </div>
            <div className="p-4 bg-admin-cream rounded-xl border border-black/5">
              <p className="font-bold text-admin-forest">Passerelle de Paiement</p>
              <p className="text-xs text-admin-forest/60 mt-1">Tranzak (Connecté)</p>
            </div>
            <div className="p-4 bg-admin-cream rounded-xl border border-black/5">
              <p className="font-bold text-admin-forest">Sécurité</p>
              <p className="text-xs text-admin-forest/60 mt-1">BCrypt + JWT Jose (Connecté)</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
