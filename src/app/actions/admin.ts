"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import path from "path";
import { writeFile, appendFile } from "fs/promises";
import { redirect } from "next/navigation";

import { getSession } from "@/app/actions/auth";

// Authorization helper to ensure deep security (defense-in-depth)
async function ensureAdmin() {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN" || !session.mfaVerified) {
    throw new Error("UNAUTHORIZED_ACCESS: Administrative privileges and MFA verification required.");
  }
  return session;
}

// Logging helper for Server Actions - sanitized for security (OWASP A09)
async function logActionError(action: string, error: any) {
  const logPath = path.join(process.cwd(), "src/app/actions/error-log.txt");
  const timestamp = new Date().toISOString();
  
  // Sanitize: Avoid logging potential sensitive stack traces or raw JSON that might contain credentials
  const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
  const sanitizedAction = action.replace(/[^a-zA-Z0-9_]/g, "");
  
  const message = `[${timestamp}] ${sanitizedAction}: ${errorMessage}\n---\n`;
  try {
    await appendFile(logPath, message);
  } catch (e) {
    console.error("FAILED TO LOG ERROR TO FILE:", e);
  }
}

// Dashboard
export async function getDashboardStats() {
  await ensureAdmin();
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
  await ensureAdmin();
  return await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminProductById(id: string) {
  await ensureAdmin();
  return await prisma.product.findUnique({
    where: { id }
  });
}

export async function createAdminProduct(prevState: any, formData: FormData) {
  await ensureAdmin();
  // Parsing simple fields
  const nameFr = formData.get("nameFr") as string;
  const nameEn = formData.get("nameEn") as string;
  const descFr = formData.get("descFr") as string;
  const descEn = formData.get("descEn") as string;
  const price = parseFloat(formData.get("price") as string) || 0;
  const stock = parseInt(formData.get("stock") as string, 10) || 0;
  const sku = formData.get("sku") as string || `SKU-${Date.now()}`;
  const productType = formData.get("productType") as any; // RESTAURANT or SHOP
  const category = formData.get("category") as string; // VEGAN, VEGETARIAN, GLUTEN_FREE
  const subcategoryId = (formData.get("subcategoryId") as string) || null;
  const isGlutenFree = formData.get("isGlutenFree") === "true";
  const menuDay = formData.get("menuDay") as any;
  const bannerTextFr = formData.get("bannerTextFr") as string || "";
  const bannerTextEn = formData.get("bannerTextEn") as string || "";

  // Image Upload Logic
  const imageFile = formData.get("image") as File;
  let imageUrl = "/placeholder.jpg"; // Default fallback

    // OWASP A04: Insecure Design - Validate MIME type and size
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(imageFile.type)) {
      return { success: false, error: "Type de fichier non supporté. Utilisez JPG, PNG ou WEBP." };
    }
    if (imageFile.size > 5 * 1024 * 1024) { // 5MB limit
      return { success: false, error: "L'image est trop volumineuse (max 5Mo)." };
    }

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Replace spaces and special characters for security
    const safeName = imageFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const uniqueName = `${Date.now()}_${safeName}`;
    const uploadPath = path.join(process.cwd(), "public", "media", uniqueName);
    
    await writeFile(uploadPath, buffer);
    imageUrl = `/media/${uniqueName}`;
  }

  // Banner Image Upload Logic
  const bannerImageFile = formData.get("bannerImage") as File;
  let bannerImageUrl = null;

  if (bannerImageFile && bannerImageFile.name && bannerImageFile.size > 0) {
    // OWASP A04: Insecure Design - Validate MIME type and size
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(bannerImageFile.type)) {
      return { success: false, error: "Type de bannière non supporté. Utilisez JPG, PNG ou WEBP." };
    }
    if (bannerImageFile.size > 5 * 1024 * 1024) {
      return { success: false, error: "La bannière est trop volumineuse (max 5Mo)." };
    }

    const bBytes = await bannerImageFile.arrayBuffer();
    const bBuffer = Buffer.from(bBytes);
    const bSafeName = bannerImageFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const bUniqueName = `banner_${Date.now()}_${bSafeName}`;
    const bUploadPath = path.join(process.cwd(), "public", "media", bUniqueName);
    
    await writeFile(bUploadPath, bBuffer);
    bannerImageUrl = `/media/${bUniqueName}`;
  }

  // Handle exclusivity of Menu of the Day for a specific day
  try {
    if (menuDay && menuDay !== "NONE") {
      await prisma.product.updateMany({
        where: { menuDay: menuDay },
        data: { menuDay: null }
      });
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
      productType,
      category,
      subcategoryId,
      isGlutenFree,
      menuDay: (menuDay && menuDay !== "NONE") ? menuDay : null,
      image: imageUrl,
      bannerImage: bannerImageUrl,
      bannerTextFr,
      bannerTextEn,
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
  } catch (error) {
    await logActionError("createAdminProduct", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }

  redirect("/admin/products");
}

export async function updateAdminProduct(formData: FormData) {
  await ensureAdmin();
  const id = formData.get("id") as string;
  if (!id) return;

  const nameFr = formData.get("nameFr") as string;
  const nameEn = formData.get("nameEn") as string;
  const descFr = formData.get("descFr") as string;
  const descEn = formData.get("descEn") as string;
  const sku = formData.get("sku") as string || `SKU-${Date.now()}`;
  const price = parseFloat(formData.get("price") as string) || 0;
  const stock = parseInt(formData.get("stock") as string, 10) || 0;
  const productType = formData.get("productType") as any;
  const category = formData.get("category") as string;
  const subcategoryId = (formData.get("subcategoryId") as string) || null;
  const isGlutenFree = formData.get("isGlutenFree") === "true";
  const menuDay = formData.get("menuDay") as any;
  const bannerTextFr = formData.get("bannerTextFr") as string || "";
  const bannerTextEn = formData.get("bannerTextEn") as string || "";

  const productData: any = {
    nameFr, nameEn, descFr, descEn, price, stock, sku, productType, category, subcategoryId, isGlutenFree, menuDay: (menuDay && menuDay !== "NONE") ? menuDay : null, bannerTextFr, bannerTextEn
  };

  const imageFile = formData.get("image") as File | null;
  if (imageFile && imageFile.name && imageFile.size > 0) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(imageFile.type)) {
      return { success: false, error: "Type de fichier non supporté. Utilisez JPG, PNG ou WEBP." };
    }
    if (imageFile.size > 5 * 1024 * 1024) {
      return { success: false, error: "L'image est trop volumineuse (max 5Mo)." };
    }

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeName = imageFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const uniqueName = `${Date.now()}_${safeName}`;
    const uploadPath = path.join(process.cwd(), "public", "media", uniqueName);
    
    await writeFile(uploadPath, buffer);
    productData.image = `/media/${uniqueName}`;
  }

  const bannerImageFile = formData.get("bannerImage") as File | null;
  if (bannerImageFile && bannerImageFile.name && bannerImageFile.size > 0) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(bannerImageFile.type)) {
      return { success: false, error: "Type de bannière non supporté. Utilisez JPG, PNG ou WEBP." };
    }
    if (bannerImageFile.size > 5 * 1024 * 1024) {
      return { success: false, error: "La bannière est trop volumineuse (max 5Mo)." };
    }

    const bBytes = await bannerImageFile.arrayBuffer();
    const bBuffer = Buffer.from(bBytes);
    const bSafeName = bannerImageFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const bUniqueName = `banner_${Date.now()}_${bSafeName}`;
    const bUploadPath = path.join(process.cwd(), "public", "media", bUniqueName);
    
    await writeFile(bUploadPath, bBuffer);
    productData.bannerImage = `/media/${bUniqueName}`;
  }

  // Handle exclusivity of Menu of the Day for a specific day
  try {
    if (menuDay && menuDay !== "NONE") {
      await prisma.product.updateMany({
        where: { 
          menuDay: menuDay,
          NOT: { id: id }
        },
        data: { menuDay: null }
      });
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
  } catch (error) {
    console.error("UPDATE_ADMIN_PRODUCT_ERROR:", error);
    throw error;
  }

  redirect("/admin/products");
}

export async function deleteAdminProduct(formData: FormData) {
  await ensureAdmin();
  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.product.delete({
    where: { id },
  });

  revalidatePath("/admin/products");
}

// Orders

export async function getAdminOrders() {
  await ensureAdmin();
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
  await ensureAdmin();
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
  await ensureAdmin();
  return await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
  });
}

// Invoices
export async function getAdminInvoices() {
  await ensureAdmin();
  return await prisma.invoice.findMany({
    orderBy: { issuedAt: "desc" },
    include: {
      customer: true,
      order: true
    }
  });
}

export async function getInvoiceById(id: string) {
  await ensureAdmin();
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
// Subcategories
export async function getAdminSubcategories() {
  await ensureAdmin();
  return await prisma.subcategory.findMany({
    orderBy: [
        { productType: 'asc' },
        { order: 'asc' }
    ],
  });
}

export async function createAdminSubcategory(formData: FormData) {
  await ensureAdmin();
  const nameFr = formData.get("nameFr") as string;
  const nameEn = formData.get("nameEn") as string;
  const productType = formData.get("productType") as any;
  const order = parseInt(formData.get("order") as string, 10) || 0;

  // Generate slug from nameEn
  const slug = nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  await prisma.subcategory.create({
    data: {
      nameFr,
      nameEn,
      slug,
      productType,
      order,
    },
  });

  revalidatePath("/admin/subcategories");
  revalidatePath("/admin/products");
}

export async function updateAdminSubcategory(formData: FormData) {
  await ensureAdmin();
  const id = formData.get("id") as string;
  const nameFr = formData.get("nameFr") as string;
  const nameEn = formData.get("nameEn") as string;
  const productType = formData.get("productType") as any;
  const order = parseInt(formData.get("order") as string, 10) || 0;

  const slug = nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  await prisma.subcategory.update({
    where: { id },
    data: {
      nameFr,
      nameEn,
      slug,
      productType,
      order,
    },
  });

  revalidatePath("/admin/subcategories");
  revalidatePath("/admin/products");
}

export async function deleteAdminSubcategory(formData: FormData) {
  await ensureAdmin();
  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.subcategory.delete({
    where: { id },
  });

  revalidatePath("/admin/subcategories");
  revalidatePath("/admin/products");
}

// Newsletter
export async function getNewsletterRecipientCounts() {
  await ensureAdmin();
  // Defensive check for model existence
  if (!(prisma as any).subscriber) {
    console.error("PRISMA_ERROR: 'subscriber' model missing from client keys:", Object.keys(prisma));
    return { customerCount: 0, subscriberCount: 0, error: "Modèle Subscriber introuvable dans le client." };
  }

  const [customerCount, subscriberCount] = await Promise.all([
    prisma.customer.count({ where: { password: { not: null } } }), 
    prisma.subscriber.count()
  ]);

  return {
    customerCount,
    subscriberCount,
  };
}

export async function sendNewsletterAction(prevState: any, formData: FormData) {
  await ensureAdmin();
  const target = formData.get("target") as string; // 'subscribers', 'customers', 'all'
  const senderKey = formData.get("sender") as any;
  const subject = formData.get("subject") as string;
  const content = formData.get("content") as string;

  if (!subject || !content) {
    return { error: "Veuillez remplir le sujet et le contenu." };
  }

  try {
    let emails: string[] = [];

    if (target === 'subscribers' || target === 'all') {
      const subs = await prisma.subscriber.findMany({ select: { email: true } });
      emails.push(...subs.map(s => s.email));
    }

    if (target === 'customers' || target === 'all') {
      const custs = await prisma.customer.findMany({ 
        where: { password: { not: null } },
        select: { email: true } 
      });
      emails.push(...custs.map(c => c.email));
    }

    // Deduplicate
    const uniqueEmails = Array.from(new Set(emails));

    if (uniqueEmails.length === 0) {
      return { error: "Aucun destinataire trouvé pour ce segment." };
    }

    const { sendNewsletterMassEmail } = await import("@/lib/email");
    await sendNewsletterMassEmail(uniqueEmails, subject, content, senderKey);

    return { success: true, count: uniqueEmails.length };
  } catch (error) {
    await logActionError("sendNewsletterAction", error);
    return { error: "Une erreur est survenue lors de l'envoi du mailing." };
  }
}

// Finance
export async function getFinanceStats() {
  await ensureAdmin();
  const [revenueAggregation, pendingAggregation] = await Promise.all([
    prisma.order.aggregate({
      where: { status: "COMPLETED" },
      _sum: { total: true, deliveryFee: true },
      _count: { id: true }
    }),
    prisma.order.aggregate({
      where: { status: "PENDING" },
      _sum: { total: true }
    })
  ]);

  const totalGross = revenueAggregation._sum.total || 0;
  const totalDeliveryFees = revenueAggregation._sum.deliveryFee || 0;
  const netRevenue = totalGross - totalDeliveryFees; // Simplified net: total minus shipping
  const pendingAmount = pendingAggregation._sum.total || 0;

  return {
    totalGross,
    totalDeliveryFees,
    netRevenue,
    pendingAmount,
    completedCount: revenueAggregation._count.id
  };
}

export async function getMonthlyRevenueData() {
  await ensureAdmin();
  // Fetch orders from last 12 months
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);

  const orders = await prisma.order.findMany({
    where: {
      status: "COMPLETED",
      createdAt: { gte: oneYearAgo }
    },
    select: {
      total: true,
      createdAt: true
    }
  });

  // Group by month
  const monthlyData: { [key: string]: number } = {};
  
  // Initialize last 12 months with 0
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString('fr-FR', { month: 'short', year: '2-digit' });
    monthlyData[label] = 0;
  }

  orders.forEach(order => {
    const label = order.createdAt.toLocaleString('fr-FR', { month: 'short', year: '2-digit' });
    if (monthlyData.hasOwnProperty(label)) {
      monthlyData[label] += order.total;
    }
  });

  // Convert to array and reverse to handle chronological order
  return Object.entries(monthlyData)
    .map(([name, total]) => ({ name, total }))
    .reverse();
}

export async function getPaymentTransactions() {
  await ensureAdmin();
  return await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: true,
    },
    take: 50 // Recent 50 for reconciliation
  });
}
