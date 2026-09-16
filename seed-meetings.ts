const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const t1 = await prisma.tenant.findFirst({ where: { name: { contains: 'Tech' } }});
  const t2 = await prisma.tenant.findFirst({ where: { name: { contains: 'Teste' } }});
  
  if (!t1 || !t2) return console.log('Tenants not found');

  await prisma.meeting.createMany({
    data: [
      { tenantId: t1.id, title: 'Reunião de Fechamento (Mensal)', date: new Date(Date.now() + 86400000), status: 'SCHEDULED' }, // Tomorrow
      { tenantId: t2.id, title: 'Dúvida sobre Admissões', date: new Date(Date.now() + 172800000), status: 'SCHEDULED', meetingUrl: 'https://meet.google.com/abc-defg-hij' }, // In 2 days
      { tenantId: t1.id, title: 'Planejamento Tributário', date: new Date(Date.now() - 86400000), status: 'COMPLETED', meetingUrl: 'https://meet.google.com/xyz' }, // Yesterday
    ]
  });
  console.log("Meetings seeded!");
}

main().catch(e => console.error(e)).finally(async () => await prisma.$disconnect());
