const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  console.log('Starting Supabase seeding...');

  // 1. Clean existing data
  await prisma.aIInsight.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.product.deleteMany();

  console.log('Cleaned existing data.');

  // 2. Create Products
  const productTemplates = [
    { name: 'Wireless Earbuds Pro', category: 'Electronics', price: 149.99, cost: 45.00 },
    { name: 'Smart Watch Series 5', category: 'Electronics', price: 299.99, cost: 120.00 },
    { name: '4K Action Camera', category: 'Electronics', price: 199.99, cost: 85.00 },
    { name: 'Portable Power Bank 20k', category: 'Electronics', price: 49.99, cost: 15.00 },
    { name: 'Organic Cotton T-Shirt', category: 'Clothing', price: 29.99, cost: 8.00 },
    { name: 'Denim Jacket Classic', category: 'Clothing', price: 89.99, cost: 35.00 },
    { name: 'Artisan Coffee Beans 1lb', category: 'Food', price: 19.99, cost: 7.00 },
    { name: 'Ceramic Pour-over Maker', category: 'Home', price: 45.00, cost: 15.00 },
    { name: 'Yoga Mat Non-slip', category: 'Sports', price: 45.00, cost: 14.00 },
    { name: 'Vitamin C Serum 30ml', category: 'Beauty', price: 45.00, cost: 12.00 }
  ];

  const products = [];
  for (let i = 0; i < productTemplates.length; i++) {
    const t = productTemplates[i];
    const stockLevel = Math.floor(Math.random() * 150) + 5;
    const product = await prisma.product.create({
      data: {
        name: t.name,
        sku: `${t.category.substring(0, 3).toUpperCase()}-${1000 + i}`,
        category: t.category,
        price: t.price,
        cost: t.cost,
        stockLevel,
        reorderPoint: 15
      }
    });
    products.push(product);
  }
  console.log(`Created ${products.length} products.`);

  // 3. Customers
  const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'];
  const customers = [];
  
  for (let i = 0; i < 15; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const customer = await prisma.customer.create({
      data: {
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@retailos-demo.com`,
        segment: i % 3 === 0 ? 'Champion' : 'New'
      }
    });
    customers.push(customer);
  }
  console.log(`Created ${customers.length} customers.`);

  // 4. Orders & Transactions
  const now = new Date();
  for (let i = 0; i < 40; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    const daysAgo = Math.floor(Math.random() * 30);
    const orderDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    
    await prisma.order.create({
      data: {
        customerId: customer.id,
        total: product.price,
        status: 'completed',
        items: 1,
        createdAt: orderDate
      }
    });

    await prisma.transaction.create({
      data: {
        type: 'income',
        category: 'Sales',
        amount: product.price,
        description: `Sale: ${product.name}`,
        date: orderDate
      }
    });

    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        totalSpent: { increment: product.price },
        orderCount: { increment: 1 },
        lastSeen: orderDate
      }
    });
  }
  console.log('Created 40 orders and transactions.');

  // 5. AI Insights
  await prisma.aIInsight.createMany({
    data: [
      {
        type: 'opportunity',
        content: 'Electronics category is up 18% this week. Consider stocking more Wireless Earbuds.',
        createdAt: new Date()
      },
      {
        type: 'risk',
        content: 'Stock for "Action Camera" is below reorder point (currently 3).',
        createdAt: new Date()
      }
    ]
  });
  console.log('Created AI Insights.');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
