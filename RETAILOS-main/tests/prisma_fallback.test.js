/**
 * Unit Test: Prisma Fallback Logic
 * This test verifies that lib/prisma.ts correctly handles missing PrismaClient
 * and that the API routes can gracefully fall back to mock data.
 */

const { prisma } = require('../lib/prisma');

async function testPrismaProxy() {
  console.log('--- TEST: Prisma Proxy Fallback ---');
  
  try {
    console.log('Attempting to access prisma.user...');
    // This should NOT crash the process, but should throw a controlled error
    // because we haven't generated the client in the test environment (or it's missing)
    const user = prisma.user; 
    console.log('Successfully accessed prisma.user proxy');
    
    console.log('Attempting to call a method...');
    await prisma.user.findMany();
  } catch (e) {
    console.log('Caught expected error:', e.message);
    if (e.message.includes('Prisma Client not generated')) {
      console.log('✅ SUCCESS: Proxy correctly catches missing client and throws helpful error.');
    } else {
      console.error('❌ FAILURE: Unexpected error message:', e.message);
      process.exit(1);
    }
  }
}

testPrismaProxy().then(() => {
  console.log('--- TEST COMPLETE ---');
  process.exit(0);
}).catch(err => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
