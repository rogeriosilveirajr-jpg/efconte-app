const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);

  const user = await prisma.user.upsert({
    where: { email: 'contador@efconte.com' },
    update: {},
    create: {
      email: 'contador@efconte.com',
      passwordHash,
      role: 'CONTADOR',
    }
  });

  console.log('Seed contador completo!');
  console.log('Email:', 'contador@efconte.com');
  console.log('Senha:', '123456');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
