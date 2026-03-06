const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const p = await prisma.product.findFirst({
    orderBy: { createdAt: 'desc' },
  });
  console.log("LATEST PRODUCT:", p);
}

main().finally(() => prisma.$disconnect());
