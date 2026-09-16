const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.lead.createMany({
    data: [
      { name: 'Loja do Carlos', email: 'carlos@loja.com', phone: '11999999999', status: 'NEW', sourceUrl: 'https://efconte.com/lp-google' },
      { name: 'Padaria Pão Quente', phone: '11888888888', status: 'CONTACTED', sourceUrl: 'https://instagram.com/ad-2' },
      { name: 'Tech Startup SA', email: 'ceo@techstartup.com', status: 'PROPOSAL', sourceUrl: 'Indicacao' },
    ]
  });
  console.log("Leads seeded!");
}

main().catch(e => console.error(e)).finally(async () => await prisma.$disconnect());
