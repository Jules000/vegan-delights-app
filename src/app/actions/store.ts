"use server";

import prisma from "@/lib/prisma";

export async function getTrendingProducts(limit = 10) {
  // Try to pick recent products for trending as fallback 
  // You would build a more robust trending algorithm based on actual orders eventually
  return await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getAllStoreProducts() {
  return await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getStoreProductById(id: string) {
  return await prisma.product.findUnique({
    where: { id }
  });
}

export async function getStoreProductBySlug(slug: string) {
  const products = await prisma.product.findMany();
  return products.find(p => {
    const slugEn = p.nameEn ? p.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '';
    const slugFr = p.nameFr ? p.nameFr.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '';
    return slugEn === slug || slugFr === slug;
  }) || null;
}
