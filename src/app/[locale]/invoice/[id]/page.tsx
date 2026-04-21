import { getInvoiceById } from "@/app/actions/admin";
import { notFound } from "next/navigation";
import PrintButton from "@/components/ui/PrintButton";
import Link from "next/link";
import { headers } from "next/headers";

export default async function ClientInvoiceDetailPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);

  if (!invoice) return notFound();

  return (
    <div className="max-w-4xl mx-auto bg-soft-cream min-h-screen p-8 text-forest print:bg-white print:p-0">
      <div className="flex justify-between items-center mb-8 print:hidden">
        <Link href="/" className="text-sm font-bold text-forest/60 hover:text-earth flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">home</span>
          Retour à la boutique
        </Link>
        <PrintButton />
      </div>

      <div className="bg-white p-12 rounded-2xl shadow-xl border border-black/5 print:border-none print:shadow-none print:p-0 print:m-0">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-serif text-earth tracking-tighter mb-2">FACTURE</h1>
            <p className="text-xl font-medium tracking-tight text-forest uppercase">{invoice.invoiceNumber}</p>
            <p className="text-sm font-medium text-forest/60 mt-4">Date : {new Date(invoice.issuedAt).toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-serif text-forest">Vegan Delights</h2>
            <p className="text-sm font-medium text-forest/70 mt-1">123 Rue de la Nature, Douala</p>
            <p className="text-sm font-medium text-forest/70">contact@vegandelights.com</p>
            <p className="text-sm font-medium text-forest/70">+237 600 000 000</p>
          </div>
        </div>

        <div className="mb-12 border-l-4 border-sage pl-6">
          <p className="text-xs font-black uppercase tracking-widest text-forest/50 mb-2">Facturé à</p>
          <h3 className="text-xl font-bold text-forest">{invoice.customer.name}</h3>
          <p className="text-sm font-medium text-forest/80">{invoice.customer.email}</p>
          <p className="text-xs font-medium text-forest/50 mt-2">Réf Cmd: {invoice.orderId.slice(0, 8)}</p>
        </div>

        <table className="w-full text-left mb-12">
          <thead>
            <tr className="border-b border-black/10">
              <th className="py-3 text-sm font-bold text-forest/80">Description</th>
              <th className="py-3 text-sm font-bold text-forest/80 text-center">Quantité</th>
              <th className="py-3 text-sm font-bold text-forest/80 text-right">Prix Unitaire</th>
              <th className="py-3 text-sm font-bold text-forest/80 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {invoice.order.items.map((item: any) => (
              <tr key={item.id}>
                <td className="py-4 text-sm font-medium text-forest">
                  {item.product.nameFr}
                </td>
                <td className="py-4 text-sm font-medium text-center text-forest/80">
                  {item.quantity}
                </td>
                <td className="py-4 text-sm font-medium text-right text-forest/80">
                  {item.priceAtPurchase.toFixed(2)} FCFA
                </td>
                <td className="py-4 text-sm font-bold text-right text-forest">
                  {(item.priceAtPurchase * item.quantity).toFixed(2)} FCFA
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-col items-end gap-2 text-right border-t border-black/10 pt-6">
          <div className="flex justify-between w-64 items-center">
            <span className="text-sm font-medium text-forest/60">Sous-total</span>
            <span className="text-sm font-bold text-forest">{(invoice.order.total - invoice.order.deliveryFee).toFixed(2)} FCFA</span>
          </div>
          <div className="flex justify-between w-64 items-center">
            <span className="text-sm font-medium text-forest/60">Frais de livraison</span>
            <span className={`text-sm font-bold ${invoice.order.deliveryFee === 0 ? 'text-earth' : 'text-forest'}`}>
              {invoice.order.deliveryFee === 0 ? 'GRATUIT' : `${invoice.order.deliveryFee.toFixed(2)} FCFA`}
            </span>
          </div>
          <div className="flex justify-between w-64 items-center font-bold text-xl text-earth mt-2">
            <span>Net à Payer</span>
            <span>{invoice.order.total.toFixed(2)} FCFA</span>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-black/10 text-center text-xs font-medium text-forest/50">
          <p>Merci pour votre commande chez Vegan Delights.</p>
          <p className="mt-1">Cette facture tient lieu de reçu officiel.</p>
        </div>
      </div>
    </div>
  );
}
