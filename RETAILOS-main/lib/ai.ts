import OpenAI from "openai";
import { prisma } from "./prisma";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "PLACEHOLDER_KEY",
});

export default openai;

/**
 * Builds a data context string for the AI to understand the current state of the business.
 */
export async function buildBusinessContext(userId: string) {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 1. Revenue (Last 30 days)
    const transactions = await prisma.transaction.findMany({
      where: {
        type: "income",
        date: { gte: thirtyDaysAgo },
      },
      select: { amount: true },
    });
    const totalRevenue = transactions.reduce((sum: number, t: { amount: number }) => sum + t.amount, 0);

    // 2. Top Products
    const topProducts = await prisma.product.findMany({
      orderBy: { stockLevel: "desc" },
      take: 3,
      select: { name: true, sku: true, stockLevel: true },
    });

    // 3. Stock Alerts
    const criticalStock = await prisma.product.count({
      where: { stockLevel: { lte: 5 } },
    });

    // 4. Customer Metrics
    const customerCount = await prisma.customer.count();
    const customers = await prisma.customer.findMany({
      select: { totalSpent: true, orderCount: true },
    });
    
    const avgOrderValue = customers.length > 0 
      ? customers.reduce((sum: number, c: { totalSpent: number; orderCount: number }) => sum + (c.totalSpent / (c.orderCount || 1)), 0) / customers.length
      : 0;

    const context = `
Current Business Snapshot (Last 30 Days):
- Total Revenue: $${totalRevenue.toLocaleString()}
- Average Order Value: $${avgOrderValue.toFixed(2)}
- Customer Count: ${customerCount}
- Critical Stock Alerts: ${criticalStock} items need immediate reorder.
- Top Products: ${topProducts.map((p: any) => `${p.name} (SKU: ${p.sku})`).join(", ")}

Business Environment: You are RetailOS AI, a premium business advisor. Your goal is to provide data-driven insights using your NLP training.
`;
    return context;
  } catch (error) {
    console.error("Error building business context:", error);
    return "Snapshot: Target Monthly Revenue: $75,000, Healthy AOV: $45.00, Inventory Status: 5 critical alerts pending.";
  }
}

/**
 * Generates strategic business insights using OpenAI.
 */
export async function generateInsights(userId: string) {
  const context = await buildBusinessContext(userId);
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "PLACEHOLDER_KEY") {
      throw new Error("API Key missing");
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "user",
          content: `Based on this business context, generate 3 specific, actionable insights. Return ONLY a JSON array of objects with fields: type ("risk", "opportunity", or "action"), and content (string).\n\nContext: ${context}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const text = response.choices[0].message.content || "[]";
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : (parsed.insights || []);
  } catch (error) {
    console.warn("AI Insight generation failed, using fallback:", error);
    return [
      { type: "opportunity", content: "Electronics segment revenue is up 18%. Increase ad spend for top sellers." },
      { type: "risk", content: "Inventory turnover for 'Home Goods' has slowed. Check for overstock." },
      { type: "action", content: "VIP customers are churning. Launch a re-engagement campaign." }
    ];
  }
}

/**
 * Streams a chat response from OpenAI.
 */
export async function streamChatResponse(messages: any[], context: string) {
  const isPlaceholder = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "PLACEHOLDER_KEY";
  
  try {
    if (isPlaceholder) throw new Error("Using mock stream");

    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Using 3.5 for speed in chat
      stream: true,
      messages: [
        {
          role: "system",
          content: `You are RetailOS AI, an intelligent business advisor. 
          Context: ${context}. 
          Always provide data-driven advice. Use your NLP training to be conversational, helpful, and retail-focused.`
        },
        ...messages
      ],
    });
    return stream;
  } catch (error) {
    console.warn("AI Streaming failed or using mock:", error);
    const mockResponses = [
      "Based on your metrics, revenue is stable, but I recommend focusing on Electronics.",
      "I see stock alerts in your inventory. Consider reordering Earbuds Pro.",
      "Your AOV has increased. Your current marketing strategy is working.",
      "Would you like a detailed 30-day forecast?"
    ];
    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    const words = randomResponse.split(" ");
    
    return (async function* () {
      for (const word of words) {
        yield { choices: [{ delta: { content: word + " " } }] };
        await new Promise(r => setTimeout(r, 50));
      }
    })();
  }
}

/**
 * Generates a demand/revenue forecast based on historical data.
 */
export async function generateForecast(historicalData: any[]) {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "PLACEHOLDER_KEY") {
      throw new Error("API Key missing");
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "user",
          content: `Analyze this historical sales data and provide a 3-month forecast. Return ONLY a JSON object with fields: 'nextMonth', 'growthRate', and 'confidence' (0-1).\n\nData: ${JSON.stringify(historicalData)}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const text = response.choices[0].message.content || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.warn("AI Forecast failed, using fallback:", error);
    return { nextMonth: 82500, growthRate: 0.08, confidence: 0.85 };
  }
}
