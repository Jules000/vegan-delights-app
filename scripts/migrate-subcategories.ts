import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const initialSubcategories = [
  // Restaurant
  { slug: 'DAILY_MENU', nameFr: 'Le Menu du Jour', nameEn: 'Daily Menu', productType: 'RESTAURANT', order: 1 },
  { slug: 'HOT_DISHES', nameFr: 'Plats Chauds', nameEn: 'Hot Dishes', productType: 'RESTAURANT', order: 2 },
  { slug: 'SALADS_WRAPS', nameFr: 'Salades et Wraps', nameEn: 'Salads & Wraps', productType: 'RESTAURANT', order: 3 },
  { slug: 'SIDES', nameFr: 'Accompagnement', nameEn: 'Sides', productType: 'RESTAURANT', order: 4 },
  { slug: 'DESSERTS_DRINKS', nameFr: 'Desserts & Boissons', nameEn: 'Desserts & Drinks', productType: 'RESTAURANT', order: 5 },
  // Shop
  { slug: 'VEGAN_BUTCHERY', nameFr: 'Boucherie Vegan & Végétarienne', nameEn: 'Vegan Butchery', productType: 'SHOP', order: 1 },
  { slug: 'PANTRY', nameFr: 'Épicerie (Pantry)', nameEn: 'Pantry', productType: 'SHOP', order: 2 },
  { slug: 'SNACKING', nameFr: 'Snacking', nameEn: 'Snacking', productType: 'SHOP', order: 3 },
  { slug: 'LIFESTYLE_HEALTH', nameFr: 'Lifestyle & Health', nameEn: 'Lifestyle & Health', productType: 'SHOP', order: 4 },
];

async function main() {
  console.log('Starting migration...');

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
    console.log(`Subcategory ${created.slug} created/found.`);
  }

  // Link existing products
  const products = await prisma.product.findMany({
    where: { subcategoryId: null, subcategory: { not: null } }
  });

  console.log(`Linking ${products.length} products...`);

  for (const product of products) {
    const sub = await prisma.subcategory.findUnique({
      where: { slug: product.subcategory || '' }
    });

    if (sub) {
      await prisma.product.update({
        where: { id: product.id },
        data: { subcategoryId: sub.id }
      });
      console.log(`Product ${product.sku} linked to ${sub.slug}.`);
    } else {
      console.warn(`Subcategory ${product.subcategory} not found for product ${product.sku}.`);
    }
  }

  console.log('Migration finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
