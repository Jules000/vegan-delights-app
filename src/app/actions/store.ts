"use server";

import prisma from "@/lib/prisma";

export async function getTrendingProducts(limit = 6) {
  // Try to find products that appear most in orders
  const topSellers = await prisma.orderItem.groupBy({
    by: ['productId'],
    _sum: {
      quantity: true
    },
    orderBy: {
      _sum: {
        quantity: 'desc'
      }
    },
    take: limit
  });

  if (topSellers.length > 0) {
    const productIds = topSellers.map(item => item.productId);
    return await prisma.product.findMany({
      where: {
        id: { in: productIds }
      }
    });
  }

  // Fallback to most recent products if no sales data exists
  return await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getAllStoreProducts(options: { 
  type?: 'RESTAURANT' | 'SHOP', 
  category?: string, 
  subcategory?: string | string[],
  isGlutenFree?: boolean,
  page?: number,
  limit?: number
} = {}) {
  const { type, category, subcategory, isGlutenFree, page = 1, limit = 12 } = options;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (type) where.productType = type;
  if (category && category !== 'ALL') where.category = category;
  
  // Handle subcategory multi-selection using subcategoryId
  if (subcategory) {
    if (Array.isArray(subcategory)) {
      where.subcategoryId = { in: subcategory };
    } else if (typeof subcategory === 'string' && subcategory.includes(',')) {
      where.subcategoryId = { in: subcategory.split(',') };
    } else {
      where.subcategoryId = subcategory;
    }
  }

  if (isGlutenFree) {
    where.isGlutenFree = true;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.product.count({ where })
  ]);

  return {
    products,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    totalCount: total
  };
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

export async function getStoreSubcategories(type?: 'RESTAURANT' | 'SHOP') {
  return await prisma.subcategory.findMany({
    where: type ? { productType: type } : {},
    orderBy: { order: 'asc' },
  });
}

export async function getMenuOfTheDay() {
  const day = new Intl.DateTimeFormat('en-US', { 
    timeZone: 'Africa/Douala', 
    weekday: 'long' 
  }).format(new Date()).toUpperCase();
  
  return await prisma.product.findFirst({
    where: { menuDay: day as any }
  });
}

export async function searchProducts(query: string, type: 'RESTAURANT' | 'SHOP' = 'RESTAURANT', limit = 8) {
  if (!query || query.length < 2) return [];

  return await prisma.product.findMany({
    where: {
      productType: type,
      OR: [
        { nameEn: { contains: query, mode: 'insensitive' } },
        { nameFr: { contains: query, mode: 'insensitive' } },
        { descEn: { contains: query, mode: 'insensitive' } },
        { descFr: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } }
      ]
    },
    take: limit,
    orderBy: { createdAt: 'desc' }
  });
}

