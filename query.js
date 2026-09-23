const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: "file:./dev.db" } } });
async function main() {
  const users = await prisma.$queryRawUnsafe('SELECT id, email, role FROM User');
  console.log(users);
}
main().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect() });
