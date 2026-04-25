import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const localData = {
      "subcategories": [
        { "id": "cmnyb5olu000094h9o1tpixtp", "nameFr": "Le Menu du Jour", "nameEn": "Daily Menu", "slug": "DAILY_MENU", "productType": "RESTAURANT", "order": 1 },
        { "id": "cmnyb5om7000194h9c5vr5bi9", "nameFr": "Plats Chauds", "nameEn": "Hot Dishes", "slug": "HOT_DISHES", "productType": "RESTAURANT", "order": 2 },
        { "id": "cmnyb5omb000294h9x74psd65", "nameFr": "Salades et Wraps", "nameEn": "Salads & Wraps", "slug": "SALADS_WRAPS", "productType": "RESTAURANT", "order": 3 },
        { "id": "cmnyb5omf000394h9qqifkwg7", "nameFr": "Accompagnement", "nameEn": "Sides", "slug": "SIDES", "productType": "RESTAURANT", "order": 4 },
        { "id": "cmnyb5omi000494h9ybkadjss", "nameFr": "Desserts & Boissons", "nameEn": "Desserts & Drinks", "slug": "DESSERTS_DRINKS", "productType": "RESTAURANT", "order": 5 },
        { "id": "cmnyb5omn000594h9lqfg9vym", "nameFr": "Boucherie Vegan & Végétarienne", "nameEn": "Vegan Butchery", "slug": "VEGAN_BUTCHERY", "productType": "SHOP", "order": 1 },
        { "id": "cmnyb5omq000694h95l967anr", "nameFr": "Épicerie (Pantry)", "nameEn": "Pantry", "slug": "PANTRY", "productType": "SHOP", "order": 2 },
        { "id": "cmnyb5omx000794h9jq1t16l5", "nameFr": "Snacking", "nameEn": "Snacking", "slug": "SNACKING", "productType": "SHOP", "order": 3 },
        { "id": "cmnyb5on1000894h9e9i9gms8", "nameFr": "Lifestyle & Health", "nameEn": "Lifestyle & Health", "slug": "LIFESTYLE_HEALTH", "productType": "SHOP", "order": 4 }
      ],
      "products": [
        { "id": "cmnt630pe0000ngh9v7izxruw", "sku": "VEG-0001", "price": 3000, "stock": 49, "productType": "RESTAURANT", "category": "VEGAN", "subcategory": "HOT_DISHES", "isGlutenFree": false, "nameFr": "Porc sauté vegan", "nameEn": "Sauteed vegan porc", "descFr": "Delicieux Porc vegan", "descEn": "Delicious vegan porc", "image": "/media/1775841341504_pork_vegan.webp", "subcategoryId": "cmnyb5om7000194h9c5vr5bi9" },
        { "id": "cmo2mhuin00002ch9l5q0ffj1", "sku": "REST-001", "price": 3500, "stock": 48, "productType": "RESTAURANT", "category": "VEGAN", "nameFr": "Mbongo tchobi", "nameEn": "Mbongo tchobi", "descFr": "Abc", "descEn": "Abc", "image": "/media/1776413102556_Gemini_Generated_Image_2lzxzz2lzxzz2lzx.png", "subcategoryId": "cmnyb5olu000094h9o1tpixtp", "bannerImage": "/media/banner_1776413102595_Gemini_Generated_Image_bgn914bgn914bgn9.png", "bannerTextEn": "Today’s Special: Dark & Delicious Mbongo.", "bannerTextFr": "Noir & délicieux. Laissez-vous envoûter.", "menuDay": "FRIDAY" },
        { "id": "cmo60ptm300005gh9py800sev", "sku": "VEG-0003", "price": 1500, "stock": 30, "productType": "RESTAURANT", "category": "VEGAN", "isGlutenFree": false, "nameFr": "Kebab de Seitan Mariné", "nameEn": "Marinated Seitan Kebab", "descFr": "Retrouvez le plaisir d'un vrai kebab !", "descEn": "Experience the joy of a real kebab!", "image": "/media/1776618387991_kebab_2.jpeg", "subcategoryId": "cmnyb5omb000294h9x74psd65" },
        { "id": "cmo60w94u00015gh9msg82s0z", "sku": "VEG-0004", "price": 1500, "stock": 30, "productType": "RESTAURANT", "category": "VEGAN", "isGlutenFree": true, "nameFr": "Kebab de Tofu aux Herbes", "nameEn": "Herbed Tofu Kebab", "descFr": "Des dés de tofu fondants...", "descEn": "Diced tofu...", "image": "/media/1776618688058_kebab_chiccken.jpg", "subcategoryId": "cmnyb5omb000294h9x74psd65" },
        { "id": "cmo6l5bh900055gh9x8kbnq1r", "sku": "VEG-0008", "price": 1000, "stock": 50, "productType": "RESTAURANT", "category": "VEGAN", "isGlutenFree": true, "nameFr": "Brochettes de Tofu au Curry Doux", "nameEn": "Mild Curry Tofu Skewers", "descFr": "Une marinade savoureuse...", "descEn": "A flavorful...", "image": "/media/1776652703308_brochette_tofu2.webp", "subcategoryId": "cmnyb5om7000194h9c5vr5bi9" },
        { "id": "cmo6kn9wb00025gh9wab66gog", "sku": "VEG-0005", "price": 750, "stock": 50, "productType": "RESTAURANT", "category": "VEGETARIAN", "isGlutenFree": false, "nameFr": "Crêpes Salées Panées & Fourrées", "nameEn": "Breaded Stuffed Crepes", "descFr": "Une création originale !", "descEn": "An original...", "image": "/media/1776652009995_crepes_pannees.jfif", "subcategoryId": "cmnyb5omi000494h9ybkadjss" },
        { "id": "cmo6kuk2400035gh9c4xibcn0", "sku": "VEG-0006", "price": 1000, "stock": 50, "productType": "RESTAURANT", "category": "VEGAN", "isGlutenFree": false, "nameFr": "Duo de Crêpes Sucrées Maison", "nameEn": "Duo of Homemade Sweet Crepes", "descFr": "De fines crêpes...", "descEn": "Thin, light...", "image": "/media/1776652201220_crepes.jpg", "subcategoryId": "cmnyb5omi000494h9ybkadjss" },
        { "id": "cmo6l2ruv00045gh9z0v5m89x", "sku": "VEG-0007", "price": 2000, "stock": 50, "productType": "RESTAURANT", "category": "VEGAN", "isGlutenFree": true, "nameFr": "Boulettes de Falafel Authentiques", "nameEn": "Authentic Falafel Balls", "descFr": "Préparés à base de pois chiches...", "descEn": "Made from...", "image": "/media/1776652584574_fallafell_boulettes.jpg", "subcategoryId": "cmnyb5om7000194h9c5vr5bi9" },
        { "id": "cmo6l8h4200065gh9qj6hqiko", "sku": "VEG-0009", "price": 1000, "stock": 50, "productType": "RESTAURANT", "category": "VEGETARIAN", "isGlutenFree": false, "nameFr": "Brochettes de Seitan Façon Barbecue", "nameEn": "BBQ Style Seitan Skewers", "descFr": "Parfaites pour vos grillades !", "descEn": "Perfect for...", "image": "/media/1776652850585_brochettes_de_seitan.jpg", "subcategoryId": "cmnyb5om7000194h9c5vr5bi9" },
        { "id": "cmo6ld23m00075gh9ocbogz5f", "sku": "VEG-0010", "price": 2000, "stock": 48, "productType": "RESTAURANT", "category": "VEGETARIAN", "isGlutenFree": false, "nameFr": "Pavé de Seitan Poêlé", "nameEn": "Pan-Seared Seitan Steak", "descFr": "Une texture bluffante...", "descEn": "An amazingly...", "image": "/media/1776653064408_vegan_steak.jpg", "subcategoryId": "cmnyb5om7000194h9c5vr5bi9" },
        { "id": "cmo6lftm200085gh9cc0xonox", "sku": "VEG-0011", "price": 2000, "stock": 50, "productType": "RESTAURANT", "category": "VEGAN", "isGlutenFree": false, "nameFr": "Steak Haché Végétal", "nameEn": "Plant-Based Minced Steak", "descFr": "La base parfaite...", "descEn": "The perfect...", "image": "/media/1776653193370_steak_hache_2.webp", "subcategoryId": "cmnyb5om7000194h9c5vr5bi9" },
        { "id": "cmo6lk4ru00095gh9672hpnow", "sku": "VEG-0012", "price": 2000, "stock": 50, "productType": "RESTAURANT", "category": "VEGETARIAN", "isGlutenFree": false, "nameFr": "Saucisses Végétales Fumé​es", "nameEn": "Smoked Plant-Based Sausages", "descFr": "Un goût légèrement fumé...", "descEn": "A slightly smoky...", "image": "/media/1776653394464_vegan_saucisses.jpg", "subcategoryId": "cmnyb5om7000194h9c5vr5bi9" },
        { "id": "cmo6lpu2e000a5gh9zkqpad02", "sku": "VEG-0013", "price": 2500, "stock": 50, "productType": "RESTAURANT", "category": "VEGAN", "isGlutenFree": false, "nameFr": "Double Cheeseburger Gourmand", "nameEn": "Gourmet Double Cheeseburger", "descFr": "Pour les grosses faims !", "descEn": "For the big...", "image": "/media/1776653660515_double_cheeseburger.jpg", "subcategoryId": "cmnyb5omb000294h9x74psd65" },
        { "id": "cmo6lsl60000b5gh95ey2hgr9", "sku": "VEG-0014", "price": 1500, "stock": 50, "productType": "RESTAURANT", "category": "VEGETARIAN", "isGlutenFree": false, "nameFr": "Le Végé Cheeseburger", "nameEn": "The Veggie Cheeseburger", "descFr": "Le grand classique...", "descEn": "The great classic...", "image": "/media/1776653788960_vegan_cheese_burger.jpg", "subcategoryId": "cmnyb5omb000294h9x74psd65" }
      ],
      "customers": [
        {
          "id": "cmo85o2x300004ch99nobn9k3",
          "email": "julesrenaud10@gmail.com",
          "password": "$2b$10$XQqMNMn0ZCtoCjBVn7guvege6PcFJALGVHy59UDR03BJ9h8zMAfA6",
          "name": "Jules Renaud Tjahe Essomba",
          "totalSpent": 0,
          "isVerified": true,
          "phone": "+237656092056",
          "role": "ADMIN"
        }
      ]
    };

    // Drop existing entries to clean slate
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.product.deleteMany();
    await prisma.subcategory.deleteMany();
    await prisma.customer.deleteMany();

    let subOutput = "";
    for (const sub of localData.subcategories) {
      await prisma.subcategory.create({ data: sub });
      subOutput += `${sub.slug} `;
    }

    let prodOutput = "";
    for (const prod of localData.products) {
      await prisma.product.create({ data: prod as any });
      prodOutput += `${prod.sku} `;
    }

    let custOutput = "";
    for (const cust of localData.customers) {
      await prisma.customer.create({ data: cust as any });
      custOutput += `${cust.email} `;
    }

    return NextResponse.json({
      status: "success",
      message: "Local database mirrors established remotely successfully!",
      subcategories: subOutput,
      products: prodOutput,
      customers: custOutput
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      message: "Sync migration failed",
      error: error.message || String(error)
    }, { status: 500 });
  }
}
