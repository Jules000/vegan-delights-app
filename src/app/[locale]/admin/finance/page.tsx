import { getFinanceStats, getMonthlyRevenueData, getPaymentTransactions } from "@/app/actions/admin";

export default async function AdminFinancePage() {
  const [stats, chartData, transactions] = await Promise.all([
    getFinanceStats(),
    getMonthlyRevenueData(),
    getPaymentTransactions()
  ]);

  const maxRevenue = Math.max(...chartData.map((d: any) => d.total), 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <h2 className="text-4xl font-black leading-tight tracking-tight text-admin-forest">Rapport Financier</h2>
          <p className="text-admin-forest/60 font-medium">Analyse des revenus et réconciliation des paiements.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2 bg-admin-primary text-white rounded-xl text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-admin-primary/20">
            <span className="material-symbols-outlined text-lg">download</span>
            Exporter CSV
          </button>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-admin-forest/40 text-xs font-black uppercase tracking-widest">Revenu Brut Total</p>
            <span className="material-symbols-outlined text-admin-primary bg-admin-primary/10 p-1.5 rounded-lg text-lg">account_balance_wallet</span>
          </div>
          <p className="text-2xl font-black text-admin-forest">{stats.totalGross.toLocaleString()} FCFA</p>
          <p className="text-[10px] text-admin-forest/40 mt-1">Cumul des commandes complétées</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-admin-forest/40 text-xs font-black uppercase tracking-widest">Revenu Net (Est.)</p>
            <span className="material-symbols-outlined text-admin-primary bg-admin-primary/10 p-1.5 rounded-lg text-lg">payments</span>
          </div>
          <p className="text-2xl font-black text-admin-forest">{stats.netRevenue.toLocaleString()} FCFA</p>
          <p className="text-[10px] text-admin-forest/40 mt-1">Revenu total hors frais de livraison</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-admin-forest/40 text-xs font-black uppercase tracking-widest">Frais Logistiques Collectés</p>
            <span className="material-symbols-outlined text-admin-primary bg-admin-primary/10 p-1.5 rounded-lg text-lg">local_shipping</span>
          </div>
          <p className="text-2xl font-black text-admin-forest">{stats.totalDeliveryFees.toLocaleString()} FCFA</p>
          <p className="text-[10px] text-admin-forest/40 mt-1">Frais de livraison facturés aux clients</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-admin-forest/40 text-xs font-black uppercase tracking-widest">Encaissements en Attente</p>
            <span className="material-symbols-outlined text-admin-primary bg-admin-primary/10 p-1.5 rounded-lg text-lg">pending_actions</span>
          </div>
          <p className="text-2xl font-black text-admin-forest">{stats.pendingAmount.toLocaleString()} FCFA</p>
          <p className="text-[10px] text-admin-forest/40 mt-1">Commandes en cours de traitement</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-8">
          <h3 className="text-lg font-black text-admin-forest mb-8 flex items-center gap-2">
            <span className="material-symbols-outlined text-admin-primary underline decoration-admin-primary/20 decoration-4">analytics</span>
            Évolution des Revenus (12 mois)
          </h3>
          
          <div className="h-64 flex items-end justify-between gap-1">
            {chartData.map((d, index) => (
              <div key={index} className="flex-1 flex flex-col items-center group relative">
                {/* Tooltip visible on hover */}
                <div className="absolute bottom-full mb-2 bg-admin-forest text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 font-bold">
                  {d.total.toLocaleString()} FCFA
                </div>
                <div 
                  className="w-full bg-admin-primary/10 group-hover:bg-admin-primary/30 transition-colors rounded-t-lg relative flex items-end justify-center"
                  style={{ height: `${(d.total / maxRevenue) * 100}%`, minHeight: '4px' }}
                >
                  <div 
                    className="w-[80%] bg-admin-primary rounded-t-sm transition-all group-hover:brightness-110 shadow-sm"
                    style={{ height: d.total > 0 ? '100%' : '0%' }}
                  />
                </div>
                <p className="text-[8px] font-black text-admin-forest/40 mt-2 uppercase tracking-tighter w-full text-center truncate">{d.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Insights */}
        <div className="bg-admin-sage/20 rounded-3xl border border-admin-sage p-8 space-y-6">
          <h3 className="text-lg font-black text-admin-forest">Observations Clés</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <span className="bg-white p-2 rounded-xl text-admin-primary shadow-sm">
                <span className="material-symbols-outlined">trending_up</span>
              </span>
              <div>
                <p className="font-bold text-admin-forest">Croissance Moyenne</p>
                <p className="text-sm text-admin-forest/60">Le revenu net représente environ {((stats.netRevenue / stats.totalGross) * 100).toFixed(1)}% du chiffre d'affaires brut.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="bg-white p-2 rounded-xl text-admin-primary shadow-sm">
                <span className="material-symbols-outlined">verified</span>
              </span>
              <div>
                <p className="font-bold text-admin-forest">Efficacité Paiement</p>
                <p className="text-sm text-admin-forest/60">Vous avez {stats.completedCount} transactions confirmées avec réconciliation automatique.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="bg-white p-2 rounded-xl text-admin-primary shadow-sm">
                <span className="material-symbols-outlined">warning</span>
              </span>
              <div>
                <p className="font-bold text-admin-forest">Points d'Attention</p>
                <p className="text-sm text-admin-forest/60">Il y a {stats.pendingAmount.toLocaleString()} FCFA bloqués dans des commandes non encore finalisées.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction List (Reconciliation) */}
      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-black/5 flex justify-between items-center">
            <h3 className="text-lg font-black text-admin-forest">Réconciliation des Paiements (Récents)</h3>
            <span className="text-xs font-bold text-admin-forest/40 bg-admin-cream px-3 py-1 rounded-full uppercase tracking-widest">Dernières 50 transactions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-admin-cream/50 text-[10px] font-black uppercase tracking-widest text-admin-forest/40">
              <tr>
                <th className="px-8 py-4">Commande</th>
                <th className="px-8 py-4">Client</th>
                <th className="px-8 py-4">Montant</th>
                <th className="px-8 py-4">Référence Tranzak (txRef)</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {transactions.map(tx => (
                <tr key={tx.id} className="hover:bg-admin-cream/30 transition-colors">
                  <td className="px-8 py-4">
                    <p className="text-xs font-black text-admin-forest">#{tx.id.slice(-6).toUpperCase()}</p>
                  </td>
                  <td className="px-8 py-4">
                    <p className="text-xs font-bold text-admin-forest">{tx.customer.name}</p>
                  </td>
                  <td className="px-8 py-4">
                    <p className="text-xs font-black text-admin-forest">{tx.total.toLocaleString()} FCFA</p>
                  </td>
                  <td className="px-8 py-4">
                    {tx.txRef ? (
                      <code className="text-[10px] bg-admin-sage/40 text-admin-primary px-2 py-1 rounded font-bold">{tx.txRef}</code>
                    ) : (
                      <span className="text-[10px] text-red-400 font-bold italic">Manquante</span>
                    )}
                  </td>
                  <td className="px-8 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      tx.status === 'COMPLETED' ? 'bg-admin-primary/10 text-admin-primary' : 
                      tx.status === 'PENDING' ? 'bg-orange-100 text-orange-600' : 'bg-red-50 text-red-500'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <p className="text-[10px] font-bold text-admin-forest/40">{new Date(tx.createdAt).toLocaleDateString()}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
