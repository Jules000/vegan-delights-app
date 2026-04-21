import { getAdminCustomers } from "@/app/actions/admin";

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return (
    <div>
      <h2 className="text-4xl font-black leading-tight tracking-tight text-admin-forest mb-6">Clients</h2>

      <div className="bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-admin-cream text-xs font-bold uppercase tracking-widest text-admin-forest/50">
            <tr>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Inscrit le</th>
              <th className="px-6 py-4 text-right">Dépenses Totales</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {customers.map((c: any) => (
              <tr key={c.id} className="hover:bg-admin-cream/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-admin-primary/10 flex items-center justify-center text-admin-primary font-bold">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-admin-forest">{c.name}</p>
                      <p className="text-xs text-admin-forest/60">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-admin-forest/80">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-bold text-admin-forest">
                    {c.totalSpent.toFixed(2)} FCFA
                  </span>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-admin-forest/50 text-sm font-bold">
                  Aucun client enregistré.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
