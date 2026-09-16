const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);

  const tenant = await prisma.tenant.create({
    data: {
      name: 'Tech Contabilidade (Teste)',
      cnpj: '11.222.333/0001-44',
      isAnnualContract: false,
    }
  });

  const user = await prisma.user.create({
    data: {
      email: 'teste@efconte.com',
      passwordHash,
      role: 'CLIENTE',
      tenants: {
        create: {
          tenantId: tenant.id
        }
      }
    }
  });

  console.log('Seed completo!');
  console.log('Email:', 'teste@efconte.com');
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
