const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);

  // Garante que o tenant existe
  const tenant = await prisma.tenant.upsert({
    where: { cnpj: '11.222.333/0001-44' },
    update: {},
    create: {
      name: 'Tech Contabilidade (Teste)',
      cnpj: '11.222.333/0001-44',
      isAnnualContract: false,
    }
  });

  // Garante que o usuário cliente existe
  await prisma.user.upsert({
    where: { email: 'teste@efconte.com' },
    update: { passwordHash }, // Reseta a senha para 123456 por garantia
    create: {
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

  // Garante que o usuário contador existe
  await prisma.user.upsert({
    where: { email: 'contador@efconte.com' },
    update: { passwordHash },
    create: {
      email: 'contador@efconte.com',
      passwordHash,
      role: 'CONTADOR',
    }
  });

  console.log('Todos os logins foram forçados e recriados com sucesso!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
