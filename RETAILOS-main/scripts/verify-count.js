const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.product.count()
  .then(c => { 
    console.log('Product count:', c); 
    process.exit(0); 
  })
  .catch(e => { 
    console.error(e); 
    process.exit(1); 
  });
