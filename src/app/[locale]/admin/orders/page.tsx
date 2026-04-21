import { getAdminOrders, updateOrderStatus } from "@/app/actions/admin";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div>
      <h2 className="text-4xl font-black leading-tight tracking-tight text-admin-forest mb-6">Commandes</h2>

      <div className="bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-admin-cream text-xs font-bold uppercase tracking-widest text-admin-forest/50">
            <tr>
              <th className="px-6 py-4">ID / Réf</th>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Statut Paiement</th>
              <th className="px-6 py-4">Statut Commande</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {orders.map((order: any) => (
              <tr key={order.id} className="hover:bg-admin-cream/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-xs font-black text-admin-forest">{order.id.slice(0, 8)}</p>
                  {order.txRef && <p className="text-[10px] text-admin-forest/50">{order.txRef}</p>}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-admin-forest">{order.customer.name}</p>
                  <p className="text-[10px] text-admin-forest/60">{order.customer.email}</p>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-admin-forest/80">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-admin-forest">
                  {order.total.toFixed(2)} FCFA
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                    order.paymentStatus === 'SUCCESSFUL' ? 'bg-admin-sage text-admin-primary' : 
                    order.paymentStatus === 'FAILED' ? 'bg-admin-accent/10 text-admin-accent' : 
                    'bg-black/5 text-admin-forest/70'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                    order.status === 'COMPLETED' ? 'bg-admin-sage text-admin-primary' : 
                    order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'CANCELLED' ? 'bg-admin-accent/10 text-admin-accent' : 
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {order.status === 'COMPLETED' ? 'Validée' : order.status === 'PROCESSING' ? 'En cours' : order.status === 'CANCELLED' ? 'Annulée' : 'En attente'}
                  </span>
                </td>
                <td className="px-6 py-4 flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-1">
                    <form action={updateOrderStatus} className="flex gap-1">
                      <input type="hidden" name="id" value={order.id} />
                      {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                         <button type="submit" name="status" value="COMPLETED" className="text-[10px] font-bold bg-admin-primary text-white px-2 py-1 rounded transition-colors hover:brightness-110">Valider</button>
                      )}
                      {order.status === 'PENDING' && (
                         <button type="submit" name="status" value="PROCESSING" className="text-[10px] font-bold bg-blue-500 text-white px-2 py-1 rounded transition-colors hover:bg-blue-600">Traiter</button>
                      )}
                      {order.status !== 'CANCELLED' && (
                         <button type="submit" name="status" value="CANCELLED" className="text-[10px] font-bold bg-admin-accent text-white px-2 py-1 rounded transition-colors hover:brightness-110">Annuler</button>
                      )}
                    </form>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] text-admin-forest/50 font-bold">{order.items.length} articles</span>
                    {/* @ts-ignore dynamic struct  */}
                    {order.invoice && (
                      <a href={`/admin/invoices/${order.invoice.id}`} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-admin-primary hover:bg-admin-primary/5 border border-admin-primary/30 px-2 py-1 rounded transition-colors">
                         Voir Facture
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
               <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-admin-forest/50 text-sm font-bold">
                  Aucune commande pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
