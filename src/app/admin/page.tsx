import { getDashboardStats } from "@/app/actions/admin";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <>
      <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
        <div>
          <h2 className="text-4xl font-black leading-tight tracking-tight text-admin-forest">Vue d'ensemble</h2>
          <p className="text-admin-forest/60 font-medium">Performances de <span className="text-admin-primary font-bold">tous les temps</span></p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-black/5 rounded-xl text-sm font-bold text-admin-forest/80 hover:bg-admin-sage transition-colors shadow-sm">
            <span className="material-symbols-outlined text-lg">calendar_today</span>
            Globale
          </button>
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
          <p className="text-3xl font-bold tracking-tight text-admin-forest">{stats.totalRevenue.toFixed(2)} FCFA</p>
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
          <p className="text-3xl font-bold tracking-tight text-admin-forest">{stats.avgOrderValue.toFixed(2)} FCFA</p>
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
              <h3 className="text-lg font-bold text-admin-forest">Statistiques (Générales)</h3>
              <p className="text-admin-forest/50 text-sm">Le système est actuellement fonctionnel et connecté à la base de données.</p>
            </div>
          </div>
          <div className="h-64 mt-4 w-full bg-admin-sage flex items-center justify-center rounded-xl text-admin-forest/40 font-bold">
            [Graphique d'activité simulant les ventes à venir]
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
