import { getAdminSubcategories, createAdminSubcategory, updateAdminSubcategory, deleteAdminSubcategory } from '@/app/actions/admin';
import Link from 'next/link';

export default async function AdminSubcategoriesPage() {
  const subcategories = await getAdminSubcategories();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-admin-forest text-4xl font-black leading-tight tracking-tight">Sous-Catégories</h1>
          <p className="text-admin-forest/40 font-medium">Gérez les sous-catégories pour le Restaurant et la Boutique</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Creation Form */}
        <div className="lg:col-span-4">
          <section className="bg-white rounded-xl shadow-sm border border-black/5 p-6 sticky top-28">
            <h2 className="text-admin-forest text-xl font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-admin-primary">add_circle</span>
              Nouvelle Sous-Catégorie
            </h2>
            <form action={createAdminSubcategory} className="space-y-4">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-bold text-admin-forest/60 uppercase tracking-wider">Nom (Français)</span>
                <input name="nameFr" required className="rounded-lg border border-black/10 bg-admin-cream p-3 text-sm focus:ring-2 focus:ring-admin-primary outline-none" placeholder="Ex: Plats Chauds" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-bold text-admin-forest/60 uppercase tracking-wider">Name (English)</span>
                <input name="nameEn" required className="rounded-lg border border-black/10 bg-admin-cream p-3 text-sm focus:ring-2 focus:ring-admin-primary outline-none" placeholder="Ex: Hot Dishes" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-bold text-admin-forest/60 uppercase tracking-wider">Type</span>
                <select name="productType" className="rounded-lg border border-black/10 bg-admin-cream p-3 text-sm focus:ring-2 focus:ring-admin-primary outline-none">
                  <option value="RESTAURANT">🍴 Restaurant</option>
                  <option value="SHOP">🛍️ Boutique (Shop)</option>
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-bold text-admin-forest/60 uppercase tracking-wider">Ordre d'affichage</span>
                <input name="order" type="number" defaultValue="0" className="rounded-lg border border-black/10 bg-admin-cream p-3 text-sm focus:ring-2 focus:ring-admin-primary outline-none" />
              </label>
              <button type="submit" className="w-full py-3 bg-admin-primary text-white font-bold rounded-lg shadow-lg shadow-admin-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2">
                <span className="material-symbols-outlined text-sm">save</span>
                Créer
              </button>
            </form>
          </section>
        </div>

        {/* List */}
        <div className="lg:col-span-8">
          <section className="bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-admin-sage/30 border-b border-black/5">
                  <th className="px-6 py-4 text-xs font-bold text-admin-forest/40 uppercase tracking-widest">Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-admin-forest/40 uppercase tracking-widest">Nom (FR/EN)</th>
                  <th className="px-6 py-4 text-xs font-bold text-admin-forest/40 uppercase tracking-widest text-center">Ordre</th>
                  <th className="px-6 py-4 text-xs font-bold text-admin-forest/40 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {subcategories.map((sub) => (
                  <tr key={sub.id} className="hover:bg-admin-cream/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-1 rounded-full ${sub.productType === 'RESTAURANT' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                        {sub.productType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-admin-forest">{sub.nameFr}</span>
                        <span className="text-xs text-admin-forest/40 italic">{sub.nameEn}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-mono font-bold text-admin-primary bg-admin-primary/5 px-2 py-1 rounded">{sub.order}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <form action={deleteAdminSubcategory}>
                          <input type="hidden" name="id" value={sub.id} />
                          <button className="p-2 text-admin-accent hover:bg-admin-accent/10 rounded-lg transition-colors" title="Supprimer">
                            <span className="material-symbols-outlined text-xl">delete</span>
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
                {subcategories.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center">
                      <p className="text-admin-forest/30 font-bold italic">Aucune sous-catégorie définie.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </div>
  );
}
