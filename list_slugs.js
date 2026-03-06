const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const products = await prisma.product.findMany({
    select: { id: true, title: true, slug: true },
    take: 10
  });
  console.log(JSON.stringify(products, null, 2));
}

run().catch(console.error).finally(() => prisma.$disconnect());
