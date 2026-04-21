import CheckoutSuccessClient from "./CheckoutSuccessClient";
import prisma from "@/lib/prisma";
import { verifyTransactionStatus } from "@/app/actions/payment";
import { redirect } from "next/navigation";
import { sendInvoiceEmail } from "@/lib/email";

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ txRef?: string; transactionId?: string }>;
}) {
  const { locale } = await params;
  const { txRef, transactionId } = await searchParams;
  let invoiceId = null;

  if (txRef) {
    // 1. Verify actual status with Tranzak
    const isSuccessful = await verifyTransactionStatus(txRef);
    if (!isSuccessful) {
        redirect(`/${locale}/checkout?canceled=true`);
    }

    const order = await prisma.order.findUnique({
      where: { txRef },
      include: { invoice: true }
    });

    if (order) {
      if (order.invoice) {
        invoiceId = order.invoice.id;
      } else {
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: 'SUCCESSFUL' }
        });

        const date = new Date();
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        
        const invoiceCount = await prisma.invoice.count();
        const sequence = String(invoiceCount + 1).padStart(4, '0');
        const invoiceNumber = `INV-${month}-${year}-${sequence}`;

        const invoice = await prisma.invoice.create({
            data: {
                invoiceNumber,
                orderId: order.id,
                customerId: order.customerId,
                amount: order.total,
                status: "PAID"
            }
        });
        invoiceId = invoice.id;

        // Trigger payment confirmation email
        try {
          await sendInvoiceEmail(invoice.id, locale);
        } catch (emailError) {
          console.error("Failed to trigger automated invoice email:", emailError);
        }
      }
    }
  }
  
  return <CheckoutSuccessClient txRef={txRef} transactionId={transactionId} invoiceId={invoiceId} />;
}
