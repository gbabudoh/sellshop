const { prisma } = require('../lib/db');

async function main() {
  try {
    console.log('Testing connection via lib/db...');
    const users = await prisma.user.findMany({ take: 1 });
    console.log('Connection successful, found users:', users.length);
  } catch (e) {
    console.error('Connection failed:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
