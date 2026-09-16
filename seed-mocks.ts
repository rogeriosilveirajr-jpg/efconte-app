const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.findFirst({
    where: { name: { contains: 'Tech Contabilidade' } }
  });

  if (!tenant) return;

  await prisma.employee.createMany({
    data: [
      { tenantId: tenant.id, name: 'Ana Silva' },
      { tenantId: tenant.id, name: 'Carlos Santos' },
      { tenantId: tenant.id, name: 'Beatriz Lima' },
    ]
  });

  await prisma.partner.createMany({
    data: [
      { tenantId: tenant.id, name: 'João Roberto' },
      { tenantId: tenant.id, name: 'Fernanda Costa' },
    ]
  });

  await prisma.notification.createMany({
    data: [
      { tenantId: tenant.id, type: 'DOCUMENTO', message: 'Cliente enviou 2 novos documentos (extrato_agosto.ofx, notas_fiscais.pdf)', metadata: JSON.stringify({ fileNames: ['extrato_agosto.ofx', 'notas_fiscais.pdf'] }) },
      { tenantId: tenant.id, type: 'ADMISSAO', message: 'Nova solicitação de admissão para: Marcos Souza' },
      { tenantId: tenant.id, type: 'REUNIAO', message: 'Reunião agendada para 20/09 às 14:00' },
    ]
  });

  console.log("Mock data inserted successfully!");
}

main().catch(e => console.error(e)).finally(async () => await prisma.$disconnect());
