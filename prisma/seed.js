const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@demo.com';
  const adminExists = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!adminExists) {
    const passwordHash = await bcrypt.hash('Admin123!', 10);
    await prisma.user.create({
      data: { name: 'Admin', email: adminEmail, passwordHash, role: 'ADMIN' }
    });
    console.log('Seeded admin:', adminEmail, 'password: Admin123!');
  } else {
    console.log('Admin already exists');
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
