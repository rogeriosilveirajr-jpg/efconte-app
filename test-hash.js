const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.findUnique({ where: { email: 'contador@efconte.com' }});
    console.log("User:", user?.email);
    console.log("Hash in DB:", user?.passwordHash);
    const isValid = await bcrypt.compare('123456', user.passwordHash);
    console.log("Is 123456 valid?", isValid);
  } catch(e) {
    console.error(e);
  } finally {
    prisma.$disconnect();
  }
}
main();
