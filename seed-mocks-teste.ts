const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.findFirst({
    where: { name: { contains: 'Teste' } }
  });

  if (!tenant) return;

  await prisma.employee.createMany({
    data: [
      { tenantId: tenant.id, name: 'Lucas Programador' },
    ]
  });

  await prisma.notification.createMany({
    data: [
      { tenantId: tenant.id, type: 'ADMISSAO', message: 'Nova solicitação de admissão para: Lucas Programador' },
    ]
  });

  console.log("Mock data inserted successfully!");
}

main().catch(e => console.error(e)).finally(async () => await prisma.$disconnect());
