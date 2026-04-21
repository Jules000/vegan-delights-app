"use client";

import Link from 'next/link';
import { useState, useActionState } from 'react';
import { updateAdminProduct } from '@/app/actions/admin';

export default function ProductEditForm({ product, subcategories }: { product: any, subcategories: any[] }) {
  const [state, formAction, isPending] = useActionState(updateAdminProduct as any, { success: false, error: '' });

  const [previewInfo, setPreviewInfo] = useState<{url: string, name: string} | null>({
    url: product.image,
    name: "Image Actuelle"
  });
  const [productType, setProductType] = useState<'RESTAURANT' | 'SHOP'>(product.productType || 'SHOP');

  const filteredSubcategories = subcategories.filter((s: any) => s.productType === productType);

  const [isGlutenFree, setIsGlutenFree] = useState(product.isGlutenFree || false);
  const [menuDay, setMenuDay] = useState<string>(product.menuDay || "NONE");
  const [bannerPreview, setBannerPreview] = useState<{url: string, name: string} | null>(product.bannerImage ? {
    url: product.bannerImage,
    name: "Banner Actuelle"
  } : null);

  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerPreview({ url: URL.createObjectURL(file), name: file.name });
    } else {
      setBannerPreview(product.bannerImage ? { url: product.bannerImage, name: "Banner Actuelle" } : null);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewInfo({ url: URL.createObjectURL(file), name: file.name });
    } else {
      setPreviewInfo({ url: product.image, name: "Image Actuelle" });
    }
  };

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={product.id} />
      <input type="hidden" name="isGlutenFree" value={isGlutenFree ? "true" : "false"} />
      <input type="hidden" name="menuDay" value={menuDay} />

      {state?.error && (
        <div className="mb-6 bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
          <span className="material-symbols-outlined">error</span>
          <span>{state.error}</span>
        </div>
      )}

      <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
        <div className="flex flex-col gap-1">
          <Link href="/admin/products" className="text-admin-primary text-sm font-bold flex items-center gap-1 hover:underline mb-2">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Retour aux produits
          </Link>
          <h1 className="text-admin-forest text-4xl font-black leading-tight tracking-tight">Modifier le Produit</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">

          {/* Français Info */}
          <section className="bg-white rounded-xl shadow-sm border border-black/5 p-6">
            <h2 className="text-admin-forest text-[22px] font-bold leading-tight mb-6 flex items-center gap-2">
              <span className="text-lg">🇫🇷</span> Contenu en Français
            </h2>
            <div className="space-y-6">
              <label className="flex flex-col">
                <p className="text-admin-forest/60 text-sm font-bold pb-2 uppercase tracking-wider">Nom du Produit</p>
                <input name="nameFr" defaultValue={product.nameFr} required className="w-full rounded-lg text-admin-forest focus:outline-0 focus:ring-2 focus:ring-admin-primary border border-black/10 bg-admin-cream h-14 p-4 text-base font-normal"/>
              </label>
              <label className="flex flex-col">
                <p className="text-admin-forest/60 text-sm font-bold pb-2 uppercase tracking-wider">Description</p>
                <textarea name="descFr" defaultValue={product.descFr} required className="w-full rounded-lg text-admin-forest focus:outline-0 focus:ring-2 focus:ring-admin-primary border border-black/10 bg-admin-cream p-4 text-base font-normal leading-relaxed" rows={4}></textarea>
              </label>
            </div>
          </section>

          {/* English Info */}
          <section className="bg-white rounded-xl shadow-sm border border-black/5 p-6">
            <h2 className="text-admin-forest text-[22px] font-bold leading-tight mb-6 flex items-center gap-2">
              <span className="text-lg">🇬🇧</span> English Content
            </h2>
            <div className="space-y-6">
              <label className="flex flex-col">
                <p className="text-admin-forest/60 text-sm font-bold pb-2 uppercase tracking-wider">Product Name</p>
                <input name="nameEn" defaultValue={product.nameEn} required className="w-full rounded-lg text-admin-forest focus:outline-0 focus:ring-2 focus:ring-admin-primary border border-black/10 bg-admin-cream h-14 p-4 text-base font-normal"/>
              </label>
              <label className="flex flex-col">
                <p className="text-admin-forest/60 text-sm font-bold pb-2 uppercase tracking-wider">Description</p>
                <textarea name="descEn" defaultValue={product.descEn} required className="w-full rounded-lg text-admin-forest focus:outline-0 focus:ring-2 focus:ring-admin-primary border border-black/10 bg-admin-cream p-4 text-base font-normal leading-relaxed" rows={4}></textarea>
              </label>
            </div>
          </section>

          {/* Categorization */}
          <section className="bg-white rounded-xl shadow-sm border border-black/5 p-6">
            <h2 className="text-admin-forest text-[22px] font-bold leading-tight mb-6">Classification du Produit</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex flex-col">
                <p className="text-admin-forest/60 text-sm font-bold pb-2 uppercase tracking-wider">Type de Produit</p>
                <select 
                  name="productType" 
                  value={productType}
                  onChange={(e) => setProductType(e.target.value as any)}
                  className="w-full rounded-lg text-admin-forest border border-black/10 bg-admin-cream h-14 px-4 text-base font-normal outline-none focus:ring-2 focus:ring-admin-primary"
                >
                  <option value="RESTAURANT">🍴 Restaurant (Nourriture)</option>
                  <option value="SHOP">🛍️ Boutique (Produits)</option>
                </select>
              </label>
              <label className="flex flex-col">
                <p className="text-admin-forest/60 text-sm font-bold pb-2 uppercase tracking-wider">Régime Principal</p>
                <select name="category" defaultValue={product.category} className="w-full rounded-lg text-admin-forest border border-black/10 bg-admin-cream h-14 px-4 text-base font-normal outline-none focus:ring-2 focus:ring-admin-primary">
                  <option value="VEGAN">Vegan</option>
                  <option value="VEGETARIAN">Végétarien</option>
                </select>
              </label>
              <label className="flex flex-col">
                <p className="text-admin-forest/60 text-sm font-bold pb-2 uppercase tracking-wider">Sous-Catégorie</p>
                <select name="subcategoryId" defaultValue={product.subcategoryId} className="w-full rounded-lg text-admin-forest border border-black/10 bg-admin-cream h-14 px-4 text-base font-normal outline-none focus:ring-2 focus:ring-admin-primary">
                  {filteredSubcategories.map((sub: any) => (
                    <option key={sub.id} value={sub.id}>{sub.nameFr}</option>
                  ))}
                  {filteredSubcategories.length === 0 && (
                    <option value="">Aucune sous-catégorie disponible</option>
                  )}
                </select>
              </label>
              <div className="flex flex-col justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsGlutenFree(!isGlutenFree)}
                  className={`flex items-center gap-3 px-6 h-14 rounded-lg font-bold transition-all border ${
                    isGlutenFree 
                    ? 'bg-admin-primary/10 border-admin-primary text-admin-primary' 
                    : 'bg-admin-cream border-black/10 text-admin-forest/40'
                  }`}
                >
                  <span className="material-symbols-outlined">
                    {isGlutenFree ? 'check_box' : 'check_box_outline_blank'}
                  </span>
                  Sans Gluten ?
                </button>
                <div className="flex flex-col gap-2">
                  <p className="text-admin-forest/60 text-sm font-bold uppercase tracking-wider">Mise en avant (Jour du Menu)</p>
                  <div className="flex gap-2">
                    <select 
                      value={menuDay} 
                      onChange={(e) => setMenuDay(e.target.value)}
                      className={`flex-1 h-14 rounded-lg px-4 border font-bold transition-all outline-none focus:ring-2 focus:ring-admin-primary ${
                        menuDay !== "NONE" 
                        ? 'bg-admin-primary/95 border-admin-primary text-white shadow-lg' 
                        : 'bg-admin-cream border-black/10 text-admin-forest/40'
                      }`}
                    >
                      <option value="NONE">Aucun jour (Pas de Menu)</option>
                      <option value="MONDAY">Lundi</option>
                      <option value="TUESDAY">Mardi</option>
                      <option value="WEDNESDAY">Mercredi</option>
                      <option value="THURSDAY">Jeudi</option>
                      <option value="FRIDAY">Vendredi</option>
                      <option value="SATURDAY">Samedi</option>
                      <option value="SUNDAY">Dimanche</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Banner Details (Optional) */}
          <section className="bg-white rounded-xl shadow-sm border border-black/5 p-6">
            <h2 className="text-admin-forest text-[22px] font-bold leading-tight mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-admin-primary">campaign</span> Mise en avant (Banner)
            </h2>
            <div className="space-y-6">
              <label className="flex flex-col">
                <p className="text-admin-forest/60 text-sm font-bold pb-2 uppercase tracking-wider">Texte de Promotion (Français)</p>
                <input name="bannerTextFr" defaultValue={product.bannerTextFr} className="w-full rounded-lg text-admin-forest focus:outline-0 focus:ring-2 focus:ring-admin-primary border border-black/10 bg-admin-cream h-14 p-4 text-base font-normal" placeholder="Ex: Savourez notre plat signature du terroir..."/>
              </label>
              <label className="flex flex-col">
                <p className="text-admin-forest/60 text-sm font-bold pb-2 uppercase tracking-wider">Promotion Text (English)</p>
                <input name="bannerTextEn" defaultValue={product.bannerTextEn} className="w-full rounded-lg text-admin-forest focus:outline-0 focus:ring-2 focus:ring-admin-primary border border-black/10 bg-admin-cream h-14 p-4 text-base font-normal" placeholder="Ex: Savor our signature local dish..."/>
              </label>
            </div>
          </section>

          {/* Pricing & Logistics */}
          <section className="bg-white rounded-xl shadow-sm border border-black/5 p-6">
            <h2 className="text-admin-forest text-[22px] font-bold leading-tight mb-6">Prix et Logistique</h2>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col">
                <p className="text-admin-forest/60 text-sm font-bold pb-2 uppercase tracking-wider">Prix (FCFA)</p>
                <input name="price" defaultValue={product.price} required className="w-full rounded-lg text-admin-forest border border-black/10 bg-admin-cream h-14 p-4 text-base font-normal" type="number" step="0.01"/>
              </label>
              <label className="flex flex-col">
                <p className="text-admin-forest/60 text-sm font-bold pb-2 uppercase tracking-wider">Stock Actuel</p>
                <input name="stock" defaultValue={product.stock} required className="w-full rounded-lg text-admin-forest border border-black/10 bg-admin-cream h-14 p-4 text-base font-normal" type="number"/>
              </label>
              <label className="flex flex-col col-span-2">
                <p className="text-admin-forest/60 text-sm font-bold pb-2 uppercase tracking-wider">SKU</p>
                <input name="sku" defaultValue={product.sku} required className="w-full rounded-lg text-admin-forest border border-black/10 bg-admin-cream h-14 p-4 text-base font-normal"/>
              </label>
            </div>
          </section>

          {/* Nutritional Info */}
          <section className="bg-white rounded-xl shadow-sm border border-black/5 p-6 mb-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-admin-forest text-[22px] font-bold">Valeurs Nutritionnelles</h2>
              <span className="text-xs font-bold text-admin-primary px-3 py-1 bg-admin-primary/10 rounded-full">PAR 100G</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i: number) => (
                <div key={i} className="bg-admin-cream p-4 rounded-lg border border-black/5 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input name={`nutritionLabel${i}Fr`} defaultValue={product[`nutritionLabel${i}Fr`] || ""} className="text-xs font-bold bg-white border border-black/10 p-2 rounded w-1/2" placeholder={`Label FR ${i}`} type="text" />
                    <input name={`nutritionLabel${i}En`} defaultValue={product[`nutritionLabel${i}En`] || ""} className="text-xs font-bold bg-white border border-black/10 p-2 rounded w-1/2" placeholder={`Label EN ${i}`} type="text" />
                  </div>
                  <input name={`nutritionValue${i}`} defaultValue={product[`nutritionValue${i}`] || ""} className="w-full bg-white border border-black/10 p-2 rounded text-lg font-black" placeholder="Valeur" type="text" />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Media */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 space-y-6">
            <section className="bg-white rounded-xl shadow-sm border border-black/5 p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-admin-forest text-[22px] font-bold">Images (Média)</h2>
              </div>
              <div className="relative group cursor-pointer w-full">
                <label htmlFor="imageUpload" className="w-full block">
                  <div className={`border-2 border-dashed ${previewInfo ? 'border-transparent p-0' : 'border-admin-primary/40 group-hover:border-admin-primary p-8'} bg-admin-cream rounded-xl transition-all flex flex-col items-center justify-center min-h-[320px] overflow-hidden relative`}>
                    
                    {previewInfo && previewInfo.url ? (
                      <div className="w-full h-full absolute inset-0">
                         <img src={previewInfo.url} alt="Aperçu" className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-white text-4xl mb-2">replay</span>
                            <span className="text-white font-bold">{previewInfo.name}</span>
                            <span className="text-white/70 text-xs mt-1">Cliquer pour remplacer</span>
                         </div>
                      </div>
                    ) : (
                      <>
                        <div className="size-20 bg-admin-primary/10 rounded-full flex items-center justify-center text-admin-primary mb-4">
                          <span className="material-symbols-outlined text-4xl">cloud_upload</span>
                        </div>
                        <p className="text-admin-forest font-bold text-center">Cliquez pour remplacer l'image</p>
                        <p className="text-sm text-admin-forest/40 text-center mt-2">Optionnel (Laissera l'image actuelle si vide)</p>
                      </>
                    )}
                    
                    {/* Notice the input is NOT required for edit */}
                    <input id="imageUpload" name="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </div>
                </label>
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm border border-black/5 p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-admin-forest text-[22px] font-bold">Image de Bannière</h2>
              </div>
              <div className="relative group cursor-pointer w-full">
                <label htmlFor="bannerUpload" className="w-full block">
                  <div className={`border-2 border-dashed ${bannerPreview ? 'border-transparent p-0' : 'border-admin-primary/40 group-hover:border-admin-primary p-8'} bg-admin-cream rounded-xl transition-all flex flex-col items-center justify-center min-h-[220px] overflow-hidden relative`}>
                    
                    {bannerPreview && bannerPreview.url ? (
                      <div className="w-full h-full absolute inset-0">
                         <img src={bannerPreview.url} alt="Aperçu Bannière" className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-white text-4xl mb-2">replay</span>
                            <span className="text-white font-bold">{bannerPreview.name}</span>
                         </div>
                      </div>
                    ) : (
                      <>
                        <div className="size-14 bg-admin-primary/10 rounded-full flex items-center justify-center text-admin-primary mb-3">
                          <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
                        </div>
                        <p className="text-admin-forest font-bold text-center text-sm">Image Large (Banner)</p>
                        <div className="mt-4 px-4 py-1.5 bg-admin-primary text-white font-bold rounded-lg text-xs cursor-pointer">Parcourir</div>
                      </>
                    )}
                    
                    <input id="bannerUpload" name="bannerImage" type="file" accept="image/*" className="hidden" onChange={handleBannerImageChange} />
                  </div>
                </label>
              </div>
              <p className="text-[10px] text-admin-forest/40 mt-3 italic uppercase tracking-wider text-center">Recommandé: 1200x600px+</p>
            </section>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 px-6 lg:px-40 py-6">
        <div className="max-w-[1280px] mx-auto bg-white/90 backdrop-blur-xl border border-black/5 shadow-2xl rounded-2xl p-4 flex items-center justify-end">
          <div className="flex gap-3">
            <Link href="/admin/products" className="px-8 py-3 rounded-xl border border-black/10 text-admin-forest font-bold hover:bg-gray-50 transition-all flex items-center justify-center">
              Annuler
            </Link>
            <button disabled={isPending} type="submit" className="px-10 py-3 rounded-xl bg-admin-primary text-white font-bold shadow-xl shadow-admin-primary/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {isPending ? (
                 <div className="size-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span className="material-symbols-outlined">save</span>
              )}
              {isPending ? 'Enregistrement...' : 'Mettre à jour'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
