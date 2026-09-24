import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  const t = await prisma.tenant.findFirst();
  if(!t) return;
  console.log(t.id);
}
run();
