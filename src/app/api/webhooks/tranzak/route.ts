import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Webhook validation logic (in production, verify signature if Tranzak provides one)
    console.log("Tranzak Webhook received:", body);

    // According to typical Tranzak webhooks, they send event type and data
    // Assuming a structure like body.data.mchTransactionRef and body.event === 'payment.collection.completed'
    // Let's implement a generic update based on mchTransactionRef

    const txRef = body?.data?.mchTransactionRef || body?.mchTransactionRef;
    const isCompleted = body?.event === "payment.collection.completed" || body?.status === "SUCCESSFUL";
    const isFailed = body?.event === "payment.collection.failed" || body?.status === "FAILED";

    if (txRef) {
      if (isCompleted) {
        await prisma.order.update({
          where: { txRef },
          data: { paymentStatus: "SUCCESSFUL", status: "PROCESSING" },
        });
      } else if (isFailed) {
        await prisma.order.update({
          where: { txRef },
          data: { paymentStatus: "FAILED", status: "CANCELLED" },
        });
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook Error" }, { status: 500 });
  }
}
