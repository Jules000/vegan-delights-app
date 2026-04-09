"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import path from "path";
import { writeFile } from "fs/promises";
import { redirect } from "next/navigation";

// Dashboard
export async function getDashboardStats() {
  const [revenueAggregation, activeOrdersCount, customersCount] = await Promise.all([
    prisma.order.aggregate({
      where: { status: { not: "CANCELLED" } },
      _sum: { total: true },
      _count: { id: true },
    }),
    prisma.order.count({
      where: { status: "PENDING" },
    }),
    prisma.customer.count(),
  ]);

  const totalRevenue = revenueAggregation._sum.total || 0;
  const totalOrders = revenueAggregation._count.id || 1; // Prevent division by 0
  const avgOrderValue = totalRevenue / totalOrders;

  return {
    totalRevenue,
    activeOrdersCount,
    avgOrderValue,
    newCustomersCount: customersCount, // Assuming all time for now, realistically would filter by last 30 days
  };
}

// Products
export async function getAdminProducts() {
  return await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminProductById(id: string) {
  return await prisma.product.findUnique({
    where: { id }
  });
}

export async function createAdminProduct(formData: FormData) {
  // Parsing simple fields
  const nameFr = formData.get("nameFr") as string;
  const nameEn = formData.get("nameEn") as string;
  const descFr = formData.get("descFr") as string;
  const descEn = formData.get("descEn") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string, 10);
  const sku = formData.get("sku") as string;
  
  // Category fallback
  const category = "Catalogue"; 

  // Image Upload Logic
  const imageFile = formData.get("image") as File;
  let imageUrl = "/placeholder.jpg"; // Default fallback

  if (imageFile && imageFile.name && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Replace spaces and special characters
    const safeName = imageFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const uniqueName = `${Date.now()}_${safeName}`;
    const uploadPath = path.join(process.cwd(), "public", "media", uniqueName);
    
    await writeFile(uploadPath, buffer);
    imageUrl = `/media/${uniqueName}`;
  }

  // Extract Nutritional info dynamically (max 4)
  const productData: any = {
    nameFr,
    nameEn,
    descFr,
    descEn,
    price,
    stock,
    sku,
    category,
    image: imageUrl,
  };

  for (let i = 1; i <= 4; i++) {
    const lFr = formData.get(`nutritionLabel${i}Fr`) as string;
    const lEn = formData.get(`nutritionLabel${i}En`) as string;
    const val = formData.get(`nutritionValue${i}`) as string;

    if (lFr || lEn || val) {
      productData[`nutritionLabel${i}Fr`] = lFr || "";
      productData[`nutritionLabel${i}En`] = lEn || "";
      productData[`nutritionValue${i}`] = val || "";
    }
  }

  await prisma.product.create({
    data: productData
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateAdminProduct(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  const nameFr = formData.get("nameFr") as string;
  const nameEn = formData.get("nameEn") as string;
  const descFr = formData.get("descFr") as string;
  const descEn = formData.get("descEn") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string, 10);
  const sku = formData.get("sku") as string;

  const productData: any = {
    nameFr, nameEn, descFr, descEn, price, stock, sku,
  };

  const imageFile = formData.get("image") as File | null;
  if (imageFile && imageFile.name && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeName = imageFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const uniqueName = `${Date.now()}_${safeName}`;
    const uploadPath = path.join(process.cwd(), "public", "media", uniqueName);
    
    await writeFile(uploadPath, buffer);
    productData.image = `/media/${uniqueName}`;
  }

  for (let i = 1; i <= 4; i++) {
    const lFr = formData.get(`nutritionLabel${i}Fr`) as string;
    const lEn = formData.get(`nutritionLabel${i}En`) as string;
    const val = formData.get(`nutritionValue${i}`) as string;
    productData[`nutritionLabel${i}Fr`] = lFr || "";
    productData[`nutritionLabel${i}En`] = lEn || "";
    productData[`nutritionValue${i}`] = val || "";
  }

  await prisma.product.update({
    where: { id },
    data: productData
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteAdminProduct(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.product.delete({
    where: { id },
  });

  revalidatePath("/admin/products");
}

// Orders

export async function getAdminOrders() {
  return await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: true,
      invoice: true,
      items: {
        include: { product: true },
      },
    },
  });
}

export async function updateOrderStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;

  if (!id || !status) return;

  const currentOrder = await prisma.order.findUnique({
    where: { id },
    include: { items: true, customer: true, invoice: true }
  });

  if (!currentOrder) return;
  if (currentOrder.status === status) return; // No change

  // Transition to COMPLETED (Validated)
  if (status === "COMPLETED" && currentOrder.status !== "COMPLETED") {
    // 1. Decrease Stock
    for (const item of currentOrder.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });
    }

    // 2. Generate Invoice if doesn't exist
    if (!currentOrder.invoice) {
        const date = new Date();
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        
        // Count existing invoices for sequence
        const invoiceCount = await prisma.invoice.count();
        const sequence = String(invoiceCount + 1).padStart(4, '0');
        const invoiceNumber = `INV-${month}-${year}-${sequence}`;

        await prisma.invoice.create({
            data: {
                invoiceNumber,
                orderId: id,
                customerId: currentOrder.customerId,
                amount: currentOrder.total,
                status: "ISSUED"
            }
        });
    }
  }

  // Transition to CANCELLED from COMPLETED (restore stock)
  if (status === "CANCELLED" && currentOrder.status === "COMPLETED") {
    for (const item of currentOrder.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } }
      });
    }
  }

  await prisma.order.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/orders");
}

// Customers
export async function getAdminCustomers() {
  return await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
  });
}

// Invoices
export async function getAdminInvoices() {
  return await prisma.invoice.findMany({
    orderBy: { issuedAt: "desc" },
    include: {
      customer: true,
      order: true
    }
  });
}

export async function getInvoiceById(id: string) {
  return await prisma.invoice.findUnique({
    where: { id },
    include: {
      customer: true,
      order: {
        include: {
          items: {
            include: { product: true }
          }
        }
      }
    }
  });
}
