"use client";

import { useState, useActionState, useEffect } from 'react';
import { getNewsletterRecipientCounts, sendNewsletterAction } from '@/app/actions/admin';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminNewsletterPage() {
  const [counts, setCounts] = useState<{ customerCount: number; subscriberCount: number } | null>(null);
  const [target, setTarget] = useState<'subscribers' | 'customers' | 'all'>('subscribers');
  
  const [state, formAction, isPending] = useActionState(sendNewsletterAction as any, { success: false, error: '' });

  useEffect(() => {
    getNewsletterRecipientCounts().then(setCounts);
  }, []);

  const senders = [
    { key: 'hello', label: 'General Greetings (hello@)', email: 'hello@vegandelights.store' },
    { key: 'jules', label: 'Personal Editorial (jules-renaud@)', email: 'jules-renaud@vegandelights.store' },
    { key: 'marketing', label: 'Marketing (marketing@)', email: 'marketing@vegandelights.store' },
    { key: 'community', label: 'Community (community@)', email: 'community@vegandelights.store' },
    { key: 'support', label: 'Service Info (support@)', email: 'support@vegandelights.store' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10">
        <h2 className="text-4xl font-black leading-tight tracking-tight text-admin-forest">Broadcast Newsletter</h2>
        <p className="text-admin-forest/60 font-medium">Communiquez avec votre communauté engagée</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Target */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
            <h3 className="font-bold text-admin-forest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-admin-primary">analytics</span>
              Audience
            </h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border transition-all cursor-pointer ${target === 'subscribers' ? 'bg-admin-primary/10 border-admin-primary shadow-sm' : 'bg-admin-cream border-transparent hover:border-admin-primary/20'}`} onClick={() => setTarget('subscribers')}>
                <p className="text-xs font-black uppercase tracking-widest text-admin-forest/40 mb-1">Abonnés Liste</p>
                <p className="text-2xl font-black text-admin-forest">{counts?.subscriberCount ?? '...'}</p>
              </div>
              <div className={`p-4 rounded-xl border transition-all cursor-pointer ${target === 'customers' ? 'bg-admin-primary/10 border-admin-primary shadow-sm' : 'bg-admin-cream border-transparent hover:border-admin-primary/20'}`} onClick={() => setTarget('customers')}>
                <p className="text-xs font-black uppercase tracking-widest text-admin-forest/40 mb-1">Clients Enregistrés</p>
                <p className="text-2xl font-black text-admin-forest">{counts?.customerCount ?? '...'}</p>
              </div>
              <div className={`p-4 rounded-xl border transition-all cursor-pointer ${target === 'all' ? 'bg-admin-primary/10 border-admin-primary shadow-sm' : 'bg-admin-cream border-transparent hover:border-admin-primary/20'}`} onClick={() => setTarget('all')}>
                <p className="text-xs font-black uppercase tracking-widest text-admin-forest/40 mb-1">Total Unique (Full Broadcast)</p>
                <p className="text-2xl font-black text-admin-forest">{counts ? (counts.subscriberCount + counts.customerCount) : '...'}</p>
                <p className="text-[10px] text-admin-forest/40 mt-1">* Les doublons sont automatiquement supprimés</p>
              </div>
            </div>
          </div>

          <div className="bg-admin-sage/30 p-6 rounded-2xl border border-admin-sage flex flex-col gap-3">
             <span className="material-symbols-outlined text-admin-forest/40">info</span>
             <p className="text-sm font-medium text-admin-forest/60 leading-relaxed">
               L'envoi sera effectué en arrière-plan par batches de 50 pour assurer une délivrabilité maximale.
             </p>
          </div>
        </div>

        {/* Center/Right Column: Composer */}
        <div className="lg:col-span-2">
          <form action={formAction} className="bg-white rounded-3xl border border-black/5 shadow-xl p-8 space-y-6">
            <input type="hidden" name="target" value={target} />
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-admin-forest/60 ml-1">Identité de l'expéditeur</label>
              <select 
                name="sender"
                className="w-full bg-admin-cream border-transparent focus:ring-2 focus:ring-admin-primary rounded-xl px-4 py-4 text-sm font-bold appearance-none outline-none transition-all"
                defaultValue="hello"
              >
                {senders.map(s => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-admin-forest/60 ml-1">Objet du Message</label>
              <input 
                name="subject"
                type="text"
                placeholder="Ex: ✨ Nos nouvelles recettes de printemps sont arrivées !"
                className="w-full bg-admin-cream border-transparent focus:ring-2 focus:ring-admin-primary rounded-xl px-4 py-4 text-sm font-bold outline-none transition-all placeholder:text-admin-forest/20"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-admin-forest/60 ml-1">Contenu (Corps du mail)</label>
              <textarea 
                name="content"
                rows={12}
                placeholder="Écrivez votre message ici. Les sauts de ligne seront respectés."
                className="w-full bg-admin-cream border-transparent focus:ring-2 focus:ring-admin-primary rounded-2xl px-4 py-4 text-sm font-medium outline-none transition-all leading-relaxed placeholder:text-admin-forest/20"
                required
              />
            </div>

            <AnimatePresence>
              {state?.error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-bold text-center"
                >
                  {state.error}
                </motion.div>
              )}
              {state?.success && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-100 text-green-700 p-4 rounded-xl text-sm font-bold text-center flex flex-col gap-1"
                >
                  <p>✨ Succès ! Newsletter envoyée.</p>
                  <p className="text-xs opacity-60 font-medium">Validé pour {state.count} destinataires uniques.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              disabled={isPending}
              className="w-full bg-admin-forest text-white font-black py-5 rounded-2xl shadow-xl hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3 group"
            >
              {isPending ? (
                <>
                  <div className="size-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">send</span>
                  <span>Lancer la diffusion</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
