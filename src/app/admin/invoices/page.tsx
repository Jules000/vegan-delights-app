import Link from 'next/link';
import { getAdminInvoices } from "@/app/actions/admin";

export default async function AdminInvoicesPage() {
  const invoices = await getAdminInvoices();

  return (
    <>
      <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
        <div>
          <h2 className="text-4xl font-black leading-tight tracking-tight text-admin-forest">Suivi des Factures</h2>
          <p className="text-admin-forest/60 font-medium">Consultez et imprimez les factures générées pour les commandes validées.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-admin-cream text-xs font-bold uppercase tracking-widest text-admin-forest/50">
            <tr>
              <th className="px-6 py-4">Numéro Facture</th>
              <th className="px-6 py-4">Date d'émission</th>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Montant</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {invoices.map(inv => (
              <tr key={inv.id} className="hover:bg-admin-cream/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-black text-admin-forest">{inv.invoiceNumber}</p>
                  <p className="text-[10px] text-admin-forest/50 uppercase">Réf Cmd: {inv.orderId.slice(0, 8)}</p>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-admin-forest/80">
                  {new Date(inv.issuedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-admin-forest">{inv.customer.name}</p>
                  <p className="text-[10px] text-admin-forest/60">{inv.customer.email}</p>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-admin-forest">
                  {inv.amount.toFixed(2)} FCFA
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                    inv.status === 'ISSUED' || inv.status === 'PAID' ? 'bg-admin-sage text-admin-primary' : 'bg-black/5 text-admin-forest/70'
                  }`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/admin/invoices/${inv.id}`} className="px-3 py-1.5 text-xs font-bold bg-admin-primary/10 text-admin-primary rounded-lg hover:bg-admin-primary hover:text-white transition-colors">
                    Détails & Impression
                  </Link>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
               <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-admin-forest/50 text-sm font-bold">
                  Aucune facture générée pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
