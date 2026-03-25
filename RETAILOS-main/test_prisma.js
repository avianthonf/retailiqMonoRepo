try {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  console.log('Prisma client initialized');
} catch (e) {
  console.error('Prisma failed:', e.message);
}
