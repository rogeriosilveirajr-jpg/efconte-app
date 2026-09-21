const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
console.log(prisma._engineConfig.activeProvider);
