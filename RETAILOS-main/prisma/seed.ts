import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting demo data generation for Sunrise Retail Co...');

  // 1. Clean existing data
  console.log('Cleaning existing data...');
  await prisma.aIInsight.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.product.deleteMany();

  // 2. Create Products (40 products across 6 categories)
  const categories = ['Electronics', 'Clothing', 'Food', 'Home', 'Sports', 'Beauty'];
  const products = [];
  
  const productTemplates = [
    { name: 'Wireless Earbuds Pro', category: 'Electronics', price: 149.99, cost: 45.00 },
    { name: 'Smart Watch Series 5', category: 'Electronics', price: 299.99, cost: 120.00 },
    { name: '4K Action Camera', category: 'Electronics', price: 199.99, cost: 85.00 },
    { name: 'Portable Power Bank 20k', category: 'Electronics', price: 49.99, cost: 15.00 },
    { name: 'Bluetooth Speaker Mini', category: 'Electronics', price: 79.99, cost: 25.00 },
    { name: 'Ultra-thin Laptop Stand', category: 'Electronics', price: 34.99, cost: 10.00 },
    { name: 'Mechanical Keyboard RGB', category: 'Electronics', price: 129.99, cost: 50.00 },
    
    { name: 'Organic Cotton T-Shirt', category: 'Clothing', price: 29.99, cost: 8.00 },
    { name: 'Denim Jacket Classic', category: 'Clothing', price: 89.99, cost: 35.00 },
    { name: 'Yoga Pants High Waist', category: 'Clothing', price: 59.99, cost: 18.00 },
    { name: 'Running Shorts Light', category: 'Clothing', price: 34.99, cost: 12.00 },
    { name: 'Wool Blend Sweater', category: 'Clothing', price: 79.99, cost: 30.00 },
    { name: 'Waterproof Windbreaker', category: 'Clothing', price: 119.99, cost: 45.00 },
    { name: 'Casual Leather Belt', category: 'Clothing', price: 39.99, cost: 14.00 },

    { name: 'Artisan Coffee Beans 1lb', category: 'Food', price: 19.99, cost: 7.00 },
    { name: 'Organic Raw Honey', category: 'Food', price: 14.99, cost: 5.00 },
    { name: 'Matcha Green Tea Powder', category: 'Food', price: 24.99, cost: 9.00 },
    { name: 'Avocado Oil 500ml', category: 'Food', price: 16.99, cost: 6.00 },
    { name: 'Protein Bar 12-Pack', category: 'Food', price: 29.99, cost: 12.00 },
    { name: 'Himalayan Pink Salt', category: 'Food', price: 9.99, cost: 3.00 },

    { name: 'Ceramic Pour-over Maker', category: 'Home', price: 45.00, cost: 15.00 },
    { name: 'Essential Oil Diffuser', category: 'Home', price: 35.00, cost: 12.00 },
    { name: 'Bamboo Cutting Board', category: 'Home', price: 28.00, cost: 9.00 },
    { name: 'Linen Bedsheet Set Queen', category: 'Home', price: 149.00, cost: 60.00 },
    { name: 'Cast Iron Skillet 12"', category: 'Home', price: 65.00, cost: 25.00 },
    { name: 'Velvet Throw Pillow', category: 'Home', price: 24.00, cost: 8.00 },
    { name: 'Insulated Water Bottle', category: 'Home', price: 32.00, cost: 11.00 },

    { name: 'Yoga Mat Non-slip', category: 'Sports', price: 45.00, cost: 14.00 },
    { name: 'Dumbbell Set Adjustable', category: 'Sports', price: 199.00, cost: 80.00 },
    { name: 'Resistance Bands 5-Pack', category: 'Sports', price: 24.00, cost: 6.00 },
    { name: 'Tennis Racket Pro', category: 'Sports', price: 189.00, cost: 75.00 },
    { name: 'Cycling Helmet Aero', category: 'Sports', price: 89.00, cost: 35.00 },
    { name: 'Jump Rope High Speed', category: 'Sports', price: 18.00, cost: 5.00 },

    { name: 'Vitamin C Serum 30ml', category: 'Beauty', price: 45.00, cost: 12.00 },
    { name: 'Hydrating Face Cream', category: 'Beauty', price: 38.00, cost: 10.00 },
    { name: 'Rosewater Facial Toner', category: 'Beauty', price: 22.00, cost: 6.00 },
    { name: 'Clay Detox Mask', category: 'Beauty', price: 28.00, cost: 8.00 },
    { name: 'Argan Hair Oil', category: 'Beauty', price: 34.00, cost: 9.00 },
    { name: 'SPF 50 Sunscreen', category: 'Beauty', price: 26.00, cost: 7.00 },
    { name: 'Bamboo Makeup Brushes', category: 'Beauty', price: 42.00, cost: 14.00 }
  ];

  console.log('Generating 40 products...');
  for (let i = 0; i < productTemplates.length; i++) {
    const t = productTemplates[i];
    // Create 15 low stock situations intentionally
    const isLowStock = i % 3 === 0 && i < 45; 
    const stockLevel = isLowStock ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 150) + 20;
    const reorderPoint = 15;

    const product = await prisma.product.create({
      data: {
        name: t.name,
        sku: `${t.category.substring(0, 3).toUpperCase()}-${1000 + i}`,
        category: t.category,
        price: t.price,
        cost: t.cost,
        stockLevel,
        reorderPoint
      }
    });
    products.push(product);
  }

  // 3. Create Customers (80 customers)
  console.log('Generating 80 customers...');
  const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'William', 'Sophia', 'James', 'Isabella', 'Oliver', 'Mia', 'Benjamin', 'Charlotte', 'Elijah', 'Amelia', 'Lucas', 'Harper', 'Mason', 'Evelyn', 'Logan'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
  
  const customers = [];
  for (let i = 0; i < 80; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    // Determine segment randomly but weighted
    const rand = Math.random();
    let segment = 'New';
    if (rand > 0.8) segment = 'Champion';
    else if (rand > 0.5) segment = 'Loyal';
    else if (rand > 0.3) segment = 'At Risk';
    else if (rand > 0.2) segment = 'Lost';

    const customer = await prisma.customer.create({
      data: {
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
        phone: `555-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        segment,
        // We will update totalSpent and orderCount as we generate orders
        totalSpent: 0,
        orderCount: 0,
        lastSeen: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000) // Random last seen in past 90 days
      }
    });
    customers.push(customer);
  }

  // 4. Create Orders (200 orders over 6 months)
  console.log('Generating 200 orders and updating customer/financials...');
  const now = new Date();
  
  for (let i = 0; i < 200; i++) {
    // Distribute orders: more in last 30 days, spike in December if within 6 mos
    const customer = customers[Math.floor(Math.random() * customers.length)];
    
    // Pick 1-4 random products for the order
    const itemCount = Math.floor(Math.random() * 4) + 1;
    let orderTotal = 0;
    for(let j=0; j < itemCount; j++) {
      orderTotal += products[Math.floor(Math.random() * products.length)].price;
    }

    // Weight dates: 40% in last 30 days, 60% spread over previous 5 months
    let daysAgo = 0;
    if (Math.random() < 0.4) {
      daysAgo = Math.floor(Math.random() * 30);
    } else {
      daysAgo = Math.floor(Math.random() * 150) + 30; // 30 to 180 days ago
    }
    
    const orderDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    
    // Create the order
    await prisma.order.create({
      data: {
        customerId: customer.id,
        total: orderTotal,
        items: itemCount,
        createdAt: orderDate,
        status: Math.random() > 0.05 ? 'completed' : 'processing'
      }
    });

    // Create corresponding transaction (Income)
    await prisma.transaction.create({
      data: {
        type: 'income',
        category: 'Sales',
        amount: orderTotal,
        description: `Order from ${customer.firstName} ${customer.lastName}`,
        date: orderDate
      }
    });

    // Update customer stats inline (in memory, then batch update later, or just simple await here for simplicity in seed)
    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        totalSpent: { increment: orderTotal },
        orderCount: { increment: 1 },
        lastSeen: orderDate > customer.lastSeen ? orderDate : customer.lastSeen
      }
    });
  }

  // 5. Generate Expenses (6 months of operational costs)
  console.log('Generating expenses...');
  const expenseCategories = ['Marketing', 'Software', 'Rent', 'Payroll', 'Shipping', 'Inventory Purchase'];
  for (let i = 0; i < 60; i++) {
    const daysAgo = Math.floor(Math.random() * 180);
    const date = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    const category = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
    
    let amount = Math.floor(Math.random() * 500) + 50;
    if (category === 'Payroll' || category === 'Rent') amount *= 10; // Bigger expenses
    
    await prisma.transaction.create({
      data: {
        type: 'expense',
        category,
        amount,
        description: `${category} expense`,
        date
      }
    });
  }

  // 6. Generate AI Insights (5 insights)
  console.log('Generating AI Insights...');
  await prisma.aIInsight.createMany({
    data: [
      {
        type: 'opportunity',
        content: 'Your "Electronics" category has seen a 24% increase in sales this week. Consider running a weekend flash sale on complimentary accessories to boost AOV.',
        isRead: false,
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        type: 'risk',
        content: 'Stock levels for "Wireless Earbuds Pro" and 6 other high-velocity items will deplete in the next 5 days based on current run rate. Urgent reorder required.',
        isRead: false,
        createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000) // 12 hours ago
      },
      {
        type: 'action',
        content: '14 "At Risk" customers who previously spent >$500 have not purchased in 60 days. Deploying the win-back email sequence could recover ~$2,500 in revenue.',
        isRead: true,
        createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        type: 'insight',
        content: 'Average Order Value (AOV) naturally peaks on Thursdays between 6 PM and 9 PM. Shift ad spend to capitalize on this window.',
        isRead: true,
        createdAt: new Date(now.getTime() - 48 * 60 * 60 * 1000) // 2 days ago
      },
      {
        type: 'opportunity',
        content: 'Your margin on "Organic Cotton T-Shirt" is 73%. Bundling this with lower margin items could improve overall profitability per transaction.',
        isRead: true,
        createdAt: new Date(now.getTime() - 72 * 60 * 60 * 1000) // 3 days ago
      }
    ]
  });

  console.log('Seed completed successfully! 🚀');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
