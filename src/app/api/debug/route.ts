import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch subcategories to link them correctly
    const subcategories = await prisma.subcategory.findMany();
    if (subcategories.length === 0) {
      return NextResponse.json({ status: "error", message: "No subcategories found to link products to." });
    }

    const dailyMenu = subcategories.find(s => s.slug === 'DAILY_MENU');
    const hotDishes = subcategories.find(s => s.slug === 'HOT_DISHES');
    const snacking = subcategories.find(s => s.slug === 'SNACKING');
    const butchery = subcategories.find(s => s.slug === 'VEGAN_BUTCHERY');

    const products = [
      {
        sku: "MOCK_TOFU_BROCHETTE",
        price: 12.5,
        stock: 50,
        productType: "RESTAURANT",
        category: "VEGAN",
        isGlutenFree: true,
        nameFr: "Brochettes de Tofu Grillées",
        nameEn: "Grilled Tofu Skewers",
        descFr: "Délicieuses brochettes de tofu mariné, grillées à la perfection avec des légumes de saison.",
        descEn: "Delicious marinated tofu skewers, grilled to perfection with seasonal vegetables.",
        image: "/media/1775271831454_brochette_tofu3.webp",
        subcategoryId: hotDishes?.id || subcategories[0].id
      },
      {
        sku: "MOCK_VEGAN_BURGER",
        price: 15.0,
        stock: 30,
        productType: "RESTAURANT",
        category: "VEGETARIAN",
        isGlutenFree: false,
        nameFr: "Burger Vegan au Fromage",
        nameEn: "Vegan Cheese Burger",
        descFr: "Steak végétal juteux, fromage fondant vegan, salade et sauce maison sur pain artisanal.",
        descEn: "Juicy plant patty, melting vegan cheese, fresh lettuce, and house sauce on artisan bun.",
        image: "/media/1775545212230_vegan_cheese_burger.jpg",
        subcategoryId: snacking?.id || subcategories[0].id,
        menuDay: "MONDAY"
      },
      {
        sku: "MOCK_VEGAN_KEBAB",
        price: 13.5,
        stock: 40,
        productType: "RESTAURANT",
        category: "VEGAN",
        isGlutenFree: false,
        nameFr: "Kebab Vegan Authentique",
        nameEn: "Authentic Vegan Kebab",
        descFr: "Seitan épicé façon kebab, légumes croquants et sauce blanche à l'ail vegan.",
        descEn: "Spiced seitan kebab style, crisp greens, and vegan garlic white sauce.",
        image: "/media/1776618387991_kebab_2.jpeg",
        subcategoryId: dailyMenu?.id || subcategories[0].id
      },
      {
        sku: "MOCK_VEGAN_STEAK",
        price: 18.0,
        stock: 25,
        productType: "SHOP",
        category: "VEGAN",
        isGlutenFree: true,
        nameFr: "Steak Végétal Premium",
        nameEn: "Premium Plant Steak",
        descFr: "Parfait pour vos barbecues. Un steak riche en protéines végétales sans compromis.",
        descEn: "Perfect for your BBQs. A plant protein rich steak without compromise.",
        image: "/media/1776653064408_vegan_steak.jpg",
        subcategoryId: butchery?.id || subcategories[0].id
      }
    ];

    let productOutput = "";
    for (const prod of products) {
      const created = await prisma.product.upsert({
        where: { sku: prod.sku },
        update: {},
        create: {
          sku: prod.sku,
          price: prod.price,
          stock: prod.stock,
          productType: prod.productType as any,
          category: prod.category,
          isGlutenFree: prod.isGlutenFree,
          nameFr: prod.nameFr,
          nameEn: prod.nameEn,
          descFr: prod.descFr,
          descEn: prod.descEn,
          image: prod.image,
          subcategoryId: prod.subcategoryId,
          menuDay: prod.menuDay as any
        }
      });
      productOutput += `Product ${created.sku} created. `;
    }

    return NextResponse.json({
      status: "success",
      message: "Initial mock products seeded successfully!",
      productOutput
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      message: "Mock seeding failed",
      error: error.message || String(error)
    }, { status: 500 });
  }
}
