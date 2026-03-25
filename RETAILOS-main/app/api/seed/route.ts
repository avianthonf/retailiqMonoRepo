import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Seed operation is only available in development mode' }, 
      { status: 403 }
    );
  }
  
  try {
    console.log('Starting demo data generation for Sunrise Retail Co...');

    // 1. Clean existing data
    await prisma.aIInsight.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.order.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.product.deleteMany();

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
      const isLowStock = i % 3 === 0; 
      const stockLevel = isLowStock ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 150) + 20;
      
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

    // 3. Customers
    const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown'];
    const customers = [];
    
    for (let i = 0; i < 20; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const segment = Math.random() > 0.5 ? 'Champion' : 'New';

      const customer = await prisma.customer.create({
        data: {
          firstName,
          lastName,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
          segment
        }
      });
      customers.push(customer);
    }

    // 4. Orders & Transactions
    const now = new Date();
    for (let i = 0; i < 50; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const product = products[Math.floor(Math.random() * products.length)];
      
      const daysAgo = Math.floor(Math.random() * 30);
      const orderDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
      
      await prisma.order.create({
        data: {
          customerId: customer.id,
          total: product.price,
          items: 1,
          createdAt: orderDate,
        }
      });

      await prisma.transaction.create({
        data: {
          type: 'income',
          category: 'Sales',
          amount: product.price,
          description: `Order from ${customer.firstName}`,
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

    // 5. AI Insights
    await prisma.aIInsight.createMany({
      data: [
        {
          type: 'opportunity',
          content: 'Electronics sales up 24%. Recommended action: Run flash sale on accessories.',
          isRead: false
        },
        {
          type: 'risk',
          content: 'Stock levels for 3 high-velocity items will deplete in 5 days. Urgent reorder required.',
          isRead: false
        }
      ]
    });

    return NextResponse.json({ success: true, message: 'Database seeded successfully perfectly via Next.js.' });
  } catch (error: any) {
    console.error('Seed process failed:', error);
    
    // Check if it's a Prisma generation issue
    if (error.message.includes('PrismaClient') || error.message.includes('prisma-client-js')) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Database connection failed. Please run "npx prisma generate" in your terminal to fix this.',
          details: error.message
        }, 
        { status: 200 } // Return 200 so the UI can show the message instead of crashing
      );
    }

    return NextResponse.json(
      { error: 'Failed to seed database', details: String(error) }, 
      { status: 500 }
    );
  }
}
