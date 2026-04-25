import * as fs from "fs";
import * as path from "path";
import prisma from "../src/lib/prisma";

async function main() {
  console.log("Reading local database...");

  const products = await prisma.product.findMany();
  const subcategories = await prisma.subcategory.findMany();
  const customers = await prisma.customer.findMany();
  const orders = await prisma.order.findMany();
  const orderItems = await prisma.orderItem.findMany();
  const invoices = await prisma.invoice.findMany();
  const subscribers = await prisma.subscriber.findMany();

  const fullDump = {
    subcategories,
    products,
    customers,
    orders,
    orderItems,
    invoices,
    subscribers
  };

  const outputPath = path.join(__dirname, "../scratch/db-dump.json");
  
  // Ensure scratch dir exists
  if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(fullDump, null, 2));
  console.log(`Successfully dumped database content to ${outputPath}`);
  console.log(`- Subcategories: ${subcategories.length}`);
  console.log(`- Products: ${products.length}`);
  console.log(`- Customers: ${customers.length}`);
  console.log(`- Orders: ${orders.length}`);
}

main()
  .catch((e) => {
    console.error("Failed to dump local database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
