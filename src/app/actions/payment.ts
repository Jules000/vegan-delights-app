"use server";


import { redirect } from "next/navigation";
// @ts-ignore
import TRANZAK from "tranzak-node";
import { randomBytes } from "crypto";
import { headers } from "next/headers";

import prisma from "@/lib/prisma";

const getTranzakConfig = () => {
  const mode = process.env.TRANZAK_MODE === "live" ? "live" : "sandbox";
  const isLive = mode === "live";
  
  const appId = isLive 
    ? process.env.TRANZAK_LIVE_APP_ID 
    : process.env.TRANZAK_SANDBOX_APP_ID;
    
  const appKey = isLive 
    ? process.env.TRANZAK_LIVE_APP_KEY 
    : process.env.TRANZAK_SANDBOX_APP_KEY;

  if (!appId || !appKey) {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      console.warn("Tranzak API credentials missing during build phase. Using placeholder config.");
      return { appId: "BUILD_PLACEHOLDER", appKey: "BUILD_PLACEHOLDER", mode };
    }
    throw new Error(
      `CRITICAL: Tranzak API credentials missing for mode [${mode}]. ` +
      `Please check TRANZAK_${isLive ? 'LIVE' : 'SANDBOX'}_APP_ID and APP_KEY in your .env file.`
    );
  }

  return { appId, appKey, mode };
};

export async function initializePayment(formData: FormData) {
  const config = getTranzakConfig();
  const client = new TRANZAK(config);
  
  const email = formData.get("email") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const address = formData.get("address") as string;
  const formDataAmount = parseFloat(formData.get("amount") as string);
  const deliveryFee = parseFloat(formData.get("deliveryFee") as string) || 0;
  const amount = !isNaN(formDataAmount) ? formDataAmount : 15350;
  
  // Create or find customer
  let customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        email,
        name: `${firstName} ${lastName}`,
      },
    });
  }

  const txRef = `VD_${Date.now()}_${randomBytes(4).toString("hex")}`;

  const cartItemsStr = formData.get("cartItems") as string;
  const cartItems = cartItemsStr ? JSON.parse(cartItemsStr) : [];

  // Create order
  const order = await prisma.order.create({
    data: {
      customerId: customer.id,
      total: amount,
      deliveryFee,
      txRef,
      paymentStatus: "PENDING",
      status: "PENDING",
      items: {
        create: cartItems.map((item: any) => ({
          productId: item.id,
          quantity: item.quantity,
          priceAtPurchase: item.price
        }))
      }
    },
  });

  // Get current origin
  const originList = await headers();
  const origin = originList.get("origin") || "http://localhost:3000";

  let paymentUrl = "";

  const locale = formData.get("locale") as string || "fr";

  // Create Tranzak transaction
  try {
    const transaction = await client.payment.collection.simple.chargeByWebRedirect({
      mchTransactionRef: txRef,
      amount: amount,
      currencyCode: "XAF",
      description: `Commande sur Vegan Delights - Order ${order.id}`,
      returnUrl: `${origin}/api/checkout/verify?txRef=${txRef}&locale=${locale}`,
      cancelUrl: `${origin}/api/checkout/verify?txRef=${txRef}&locale=${locale}`,
    });
    
    // Redirect user to payment auth URL
    if (transaction && transaction.links && transaction.links.paymentAuthUrl) {
      paymentUrl = transaction.links.paymentAuthUrl;
    } else if (transaction && transaction.data && transaction.data.links && transaction.data.links.paymentAuthUrl) {
      // In case the SDK wraps it in .data
      paymentUrl = transaction.data.links.paymentAuthUrl;
    } else {
      throw new Error(`Unable to obtain payment URL from Tranzak. Raw Response: ${JSON.stringify(transaction)}`);
    }
  } catch (error: any) {
    console.error("Tranzak payment initialization failed:", error);
    const details = error?.response?.data ? JSON.stringify(error.response.data) : error.message;
    throw new Error(`Tranzak API Error: ${details}`);
  }

  // Execute Next.js redirect outside of try/catch
  if (paymentUrl) {
    redirect(paymentUrl);
  }
}

export async function verifyTransactionStatus(txRef: string) {
  const config = getTranzakConfig();
  const client = new TRANZAK(config);

  try {
    const transaction = await client.payment.collection.simple.find({ mchTransactionRef: txRef });
    const status = transaction?.data?.status;
    return status === "SUCCESSFUL" || status === "SUCCESS";
  } catch (error) {
    console.error("Tranzak status verification failed:", error);
    return false;
  }
}
