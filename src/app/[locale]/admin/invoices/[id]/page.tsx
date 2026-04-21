import { getInvoiceById } from "@/app/actions/admin";
import { notFound } from "next/navigation";
import PrintButton from "@/components/ui/PrintButton";
import Link from "next/link";

export default async function AdminInvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);

  if (!invoice) return notFound();

  return (
    <div className="max-w-4xl mx-auto bg-admin-cream min-h-screen p-8 text-admin-forest print:bg-white print:p-0">
      <div className="flex justify-between items-center mb-8 print:hidden">
        <Link href="/admin/invoices" className="text-sm font-bold text-admin-forest/60 hover:text-admin-primary flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Retour aux factures
        </Link>
        <PrintButton />
      </div>

      <div className="bg-white p-12 rounded-2xl shadow-xl border border-black/5 print:border-none print:shadow-none print:p-0 print:m-0">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-black text-admin-primary tracking-tighter mb-2">FACTURE</h1>
            <p className="text-2xl font-bold tracking-tight text-admin-forest/80 uppercase">{invoice.invoiceNumber}</p>
            <p className="text-sm font-bold text-admin-forest/60 uppercase mt-4">Date : {new Date(invoice.issuedAt).toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-black text-admin-forest">Vegan Delights</h2>
            <p className="text-sm font-medium text-admin-forest/70 mt-1">123 Rue de la Nature, Douala</p>
            <p className="text-sm font-medium text-admin-forest/70">contact@vegandelights.com</p>
            <p className="text-sm font-medium text-admin-forest/70">+237 600 000 000</p>
          </div>
        </div>

        <div className="mb-12 border-l-4 border-admin-sage pl-6">
          <p className="text-xs font-black uppercase tracking-widest text-admin-forest/50 mb-2">Facturé à</p>
          <h3 className="text-xl font-bold text-admin-forest">{invoice.customer.name}</h3>
          <p className="text-sm font-medium text-admin-forest/80">{invoice.customer.email}</p>
          <p className="text-xs font-bold text-admin-forest/50 uppercase mt-2">Réf Cmd: {invoice.orderId.slice(0, 8)}</p>
        </div>

        <table className="w-full text-left mb-12">
          <thead>
            <tr className="border-b-2 border-black/10">
              <th className="py-3 text-xs font-black uppercase tracking-widest text-admin-forest/60">Description</th>
              <th className="py-3 text-xs font-black uppercase tracking-widest text-admin-forest/60 text-center">Quantité</th>
              <th className="py-3 text-xs font-black uppercase tracking-widest text-admin-forest/60 text-right">Prix Unitaire</th>
              <th className="py-3 text-xs font-black uppercase tracking-widest text-admin-forest/60 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {invoice.order.items.map((item: any) => (
              <tr key={item.id}>
                <td className="py-4 text-sm font-bold text-admin-forest">
                  {item.product.nameFr}
                </td>
                <td className="py-4 text-sm font-bold text-center text-admin-forest/80">
                  {item.quantity}
                </td>
                <td className="py-4 text-sm font-bold text-right text-admin-forest/80">
                  {item.priceAtPurchase.toFixed(2)} FCFA
                </td>
                <td className="py-4 text-sm font-black text-right text-admin-forest">
                  {(item.priceAtPurchase * item.quantity).toFixed(2)} FCFA
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-col items-end gap-2 text-right border-t-2 border-black/10 pt-6">
          <div className="flex justify-between w-64 items-center">
            <span className="text-sm font-bold text-admin-forest/60 uppercase">Sous-total</span>
            <span className="text-sm font-bold text-admin-forest">{(invoice.order.total - invoice.order.deliveryFee).toFixed(2)} FCFA</span>
          </div>
          <div className="flex justify-between w-64 items-center">
            <span className="text-sm font-bold text-admin-forest/60 uppercase">Frais de livraison</span>
            <span className={`text-sm font-bold ${invoice.order.deliveryFee === 0 ? 'text-admin-primary' : 'text-admin-forest'}`}>
              {invoice.order.deliveryFee === 0 ? 'GRATUIT' : `${invoice.order.deliveryFee.toFixed(2)} FCFA`}
            </span>
          </div>
          <div className="flex justify-between w-64 items-center font-black text-lg text-admin-primary mt-2">
            <span className="uppercase">Net à Payer</span>
            <span>{invoice.order.total.toFixed(2)} FCFA</span>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-black/10 text-center text-xs font-bold text-admin-forest/40">
          <p>Merci pour votre commande chez Vegan Delights.</p>
          <p className="mt-1">Cette facture tient lieu de reçu officiel.</p>
        </div>
      </div>
    </div>
  );
}
