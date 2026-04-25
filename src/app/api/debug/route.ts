import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const sqlScript = `
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('RESTAURANT', 'SHOP');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'ADMIN');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "productType" "ProductType" NOT NULL DEFAULT 'SHOP',
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "isGlutenFree" BOOLEAN NOT NULL DEFAULT false,
    "nameFr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "descFr" TEXT NOT NULL,
    "descEn" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "nutritionLabel1Fr" TEXT,
    "nutritionLabel1En" TEXT,
    "nutritionValue1" TEXT,
    "nutritionLabel2Fr" TEXT,
    "nutritionLabel2En" TEXT,
    "nutritionValue2" TEXT,
    "nutritionLabel3Fr" TEXT,
    "nutritionLabel3En" TEXT,
    "nutritionValue3" TEXT,
    "nutritionLabel4Fr" TEXT,
    "nutritionLabel4En" TEXT,
    "nutritionValue4" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subcategoryId" TEXT,
    "bannerImage" TEXT,
    "bannerTextEn" TEXT,
    "bannerTextFr" TEXT,
    "menuDay" "DayOfWeek",

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "txRef" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "total" DOUBLE PRECISION NOT NULL,
    "deliveryFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "priceAtPurchase" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "name" TEXT NOT NULL,
    "totalSpent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "otp" TEXT,
    "otpExpires" TIMESTAMP(3),
    "phone" TEXT,
    "resetToken" TEXT,
    "resetTokenExpires" TIMESTAMP(3),
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ISSUED',
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subcategory" (
    "id" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "productType" "ProductType" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subcategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Order_txRef_key" ON "Order"("txRef");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phone_key" ON "Customer"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_resetToken_key" ON "Customer"("resetToken");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_orderId_key" ON "Invoice"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Subcategory_slug_key" ON "Subcategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_email_key" ON "Subscriber"("email");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
`;

    // Split by semicolon to run queries independently
    const queries = sqlScript
      .split(';')
      .map(q => q.trim())
      .filter(q => q.length > 0);

    let executionResults = [];
    
    // Execute each DDL query sequentially
    for (const query of queries) {
      try {
        await prisma.$executeRawUnsafe(query);
        executionResults.push({ query: query.substring(0, 50) + "...", status: "ok" });
      } catch (e: any) {
        executionResults.push({ 
          query: query.substring(0, 50) + "...", 
          status: "error", 
          error: e.message || String(e) 
        });
      }
    }

    // Seed subcategories directly after schema creation
    const initialSubcategories = [
      { slug: 'DAILY_MENU', nameFr: 'Le Menu du Jour', nameEn: 'Daily Menu', productType: 'RESTAURANT', order: 1 },
      { slug: 'HOT_DISHES', nameFr: 'Plats Chauds', nameEn: 'Hot Dishes', productType: 'RESTAURANT', order: 2 },
      { slug: 'SALADS_WRAPS', nameFr: 'Salades et Wraps', nameEn: 'Salads & Wraps', productType: 'RESTAURANT', order: 3 },
      { slug: 'SIDES', nameFr: 'Accompagnement', nameEn: 'Sides', productType: 'RESTAURANT', order: 4 },
      { slug: 'DESSERTS_DRINKS', nameFr: 'Desserts & Boissons', nameEn: 'Desserts & Drinks', productType: 'RESTAURANT', order: 5 },
      { slug: 'VEGAN_BUTCHERY', nameFr: 'Boucherie Vegan & Végétarienne', nameEn: 'Vegan Butchery', productType: 'SHOP', order: 1 },
      { slug: 'PANTRY', nameFr: 'Épicerie (Pantry)', nameEn: 'Pantry', productType: 'SHOP', order: 2 },
      { slug: 'SNACKING', nameFr: 'Snacking', nameEn: 'Snacking', productType: 'SHOP', order: 3 },
      { slug: 'LIFESTYLE_HEALTH', nameFr: 'Lifestyle & Health', nameEn: 'Lifestyle & Health', productType: 'SHOP', order: 4 },
    ];

    let seedOutput = "";
    let seedError = null;

    try {
      for (const sub of initialSubcategories) {
        const created = await prisma.subcategory.upsert({
          where: { slug: sub.slug },
          update: {},
          create: {
            slug: sub.slug,
            nameFr: sub.nameFr,
            nameEn: sub.nameEn,
            productType: sub.productType as any,
            order: sub.order,
          },
        });
        seedOutput += `Subcategory ${created.slug} created/found. `;
      }
    } catch (e: any) {
      seedError = e.message || String(e);
    }
    
    return NextResponse.json({
      status: seedError ? "partial_success" : "success",
      message: seedError ? "Schema pushed but seeding failed" : "Database raw SQL schema and seed pushed successfully!",
      executionResults,
      seedOutput,
      seedError
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      message: "Internal execution failed completely",
      error: error.message || String(error),
    }, { status: 500 });
  }
}
