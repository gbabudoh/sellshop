const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const tables = await prisma.$queryRaw`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public';`;
    console.log('Tables in public schema:', JSON.stringify(tables, null, 2));
    
    const userCount = await prisma.user.count();
    console.log('Number of users:', userCount);
  } catch (error) {
    console.error('Database query failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
