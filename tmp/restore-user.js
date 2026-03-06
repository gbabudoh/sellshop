const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  try {
    const hashedPassword = await bcrypt.hash('password101', 10);
    const user = await prisma.user.upsert({
      where: { email: 'godwin@egobas.com' },
      update: { hashedPassword },
      create: {
        email: 'godwin@egobas.com',
        name: 'Godwin',
        hashedPassword,
        role: 'ADMIN' // Making them admin just in case
      }
    });
    console.log('User godwin@egobas.com restored successfully:', JSON.stringify(user, null, 2));
  } catch (error) {
    console.error('Failed to restore user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
