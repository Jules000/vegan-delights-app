import Link from 'next/link';
import { getAdminProducts, deleteAdminProduct } from "@/app/actions/admin";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <>
      <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
        <div>
          <h2 className="text-4xl font-black leading-tight tracking-tight text-admin-forest">Gestion du Catalogue</h2>
          <p className="text-admin-forest/60 font-medium">Gérez vos produits, prix et traductions locales.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/products/new" className="flex items-center gap-2 px-5 py-3 bg-admin-primary text-white rounded-xl text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-admin-primary/20">
            <span className="material-symbols-outlined text-lg">add</span>
            Nouveau Produit
          </Link>
        </div>
      </div>

      {products.some((p: any) => p.stock < 5) && (
        <div className="mb-6 p-4 bg-orange-100 border-l-4 border-orange-500 rounded-r-xl flex items-center gap-3">
          <span className="material-symbols-outlined text-orange-600">warning</span>
          <div>
            <p className="text-sm font-bold text-orange-800">Alerte de Stock Faible</p>
            <p className="text-xs text-orange-700">Certains produits de votre catalogue ont un stock critique (&lt; 5 unités). Veuillez réapprovisionner rapidement.</p>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-black/5 bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b border-black/5 flex justify-between items-center bg-admin-sage">
          <h3 className="text-lg font-bold text-admin-forest">Tous les produits ({products.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-admin-cream text-xs font-bold uppercase tracking-widest text-admin-forest/50">
              <tr>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Nom (FR)</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Catégorie</th>
                <th className="px-6 py-4">Prix</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {products.map((p: any) => (
                <tr key={p.id} className={`hover:bg-admin-cream/50 transition-colors group ${p.stock < 5 ? 'bg-orange-50/50' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="size-10 bg-black/5 rounded-lg overflow-hidden border border-black/10">
                      <img src={p.image} className="w-full h-full object-cover" alt={p.nameFr} />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-bold text-admin-forest">{p.nameFr}</p>
                      <p className="text-[10px] text-admin-forest/40 uppercase font-black">SKU: {p.sku}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${p.productType === 'RESTAURANT' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                      {p.productType === 'RESTAURANT' ? '🍴 Restaurant' : '🛍️ Boutique'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold text-admin-forest/60 uppercase bg-admin-cream px-2 py-1 rounded">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-admin-forest">{p.price.toFixed(2)} FCFA</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 items-start">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${p.stock < 5 ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-admin-primary/10 text-admin-primary'}`}>
                        {p.stock} unités
                      </span>
                      {p.stock < 5 && <span className="text-[9px] font-bold text-orange-600 uppercase">Stock critique</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 flex justify-end items-center gap-2">
                    <Link href={`/admin/products/${p.id}/edit`} className="p-2 rounded-lg hover:bg-admin-sage transition-colors text-admin-forest/50">
                      <span className="material-symbols-outlined">edit</span>
                    </Link>
                    <form action={deleteAdminProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className="p-2 ml-1 rounded-lg hover:bg-admin-accent/10 hover:text-admin-accent transition-colors text-admin-forest/50">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-admin-forest/50 text-sm font-bold">
                    Aucun produit trouvé dans la base de données.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
