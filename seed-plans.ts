const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const plans = [
      { id: 'start', name: 'Start', basePrice: 199, maxEmployees: 0 },
      { id: 'gestao', name: 'Gestão', basePrice: 349, maxEmployees: 3 },
      { id: 'prime', name: 'Prime', basePrice: 549, maxEmployees: 5 },
  ];
  for (const p of plans) {
    await prisma.plan.upsert({
      where: { id: p.id },
      update: {},
      create: p
    });
  }
  console.log("Plans seeded!");
}

main().catch(e => console.error(e)).finally(async () => await prisma.$disconnect());
