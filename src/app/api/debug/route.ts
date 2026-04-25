import { NextResponse } from "next/server";
import { execSync } from "child_process";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Run local prisma binary directly to bypass Vercel read-only restrictions
    const pushOutput = execSync("node ./node_modules/prisma/build/index.js db push --accept-data-loss", {
      env: {
        ...process.env,
        HOME: "/tmp",
        npm_config_cache: "/tmp/.npm",
        PRISMA_CLI_BINARY_TARGETS: "debian-openssl-1.1.x,rhel-openssl-3.0.x"
      }
    }).toString();

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
    
    return NextResponse.json({
      status: "success",
      message: "Database schema and seed pushed successfully!",
      pushOutput,
      seedOutput
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      message: "Internal execution failed",
      error: error.message || String(error),
      stdout: error.stdout?.toString(),
      stderr: error.stderr?.toString()
    }, { status: 500 });
  }
}
