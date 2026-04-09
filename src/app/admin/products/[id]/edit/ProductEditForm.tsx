"use client";

import Link from 'next/link';
import { useState } from 'react';
import { updateAdminProduct } from '@/app/actions/admin';

export default function ProductEditForm({ product }: { product: any }) {
  const [previewInfo, setPreviewInfo] = useState<{url: string, name: string} | null>({
    url: product.image,
    name: "Image Actuelle"
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewInfo({ url: URL.createObjectURL(file), name: file.name });
    } else {
      setPreviewInfo({ url: product.image, name: "Image Actuelle" });
    }
  };

  return (
    <form action={updateAdminProduct}>
      <input type="hidden" name="id" value={product.id} />
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

          {/* Pricing & Logistics */}
          <section className="bg-white rounded-xl shadow-sm border border-black/5 p-6">
            <h2 className="text-admin-forest text-[22px] font-bold leading-tight mb-6">Prix et Logistique</h2>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col">
                <p className="text-admin-forest/60 text-sm font-bold pb-2 uppercase tracking-wider">Prix (€ / FCFA)</p>
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
              {[1, 2, 3, 4].map((i) => (
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
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 px-6 lg:px-40 py-6">
        <div className="max-w-[1280px] mx-auto bg-white/90 backdrop-blur-xl border border-black/5 shadow-2xl rounded-2xl p-4 flex items-center justify-end">
          <div className="flex gap-3">
            <Link href="/admin/products" className="px-8 py-3 rounded-xl border border-black/10 text-admin-forest font-bold hover:bg-gray-50 transition-all flex items-center justify-center">
              Annuler
            </Link>
            <button type="submit" className="px-10 py-3 rounded-xl bg-admin-primary text-white font-bold shadow-xl shadow-admin-primary/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">save</span>
              Mettre à jour
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
