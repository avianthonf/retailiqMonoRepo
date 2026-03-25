import { z } from "zod";

export const CreateOrderSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
  })).min(1, "At least one item is required"),
  discount: z.number().min(0).optional(),
  notes: z.string().optional(),
});

export const CreateProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  category: z.string().min(1, "Category is required"),
  price: z.number().min(0.01, "Price must be positive"),
  costPrice: z.number().min(0, "Cost price must be non-negative"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  reorderPoint: z.number().int().min(0, "Reorder point cannot be negative"),
});

export const CreateCustomerSchema = z.object({
  name: z.string().min(1, "Name is required"), // Note: Maps to firstName/lastName in DB
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const CreateTransactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Category is required"),
  amount: z.number().min(0.01, "Amount must be positive"),
  description: z.string().optional(),
  date: z.date().optional(),
});

export const UpdateStockSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int(),
  reason: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type CreateCustomerInput = z.infer<typeof CreateCustomerSchema>;
export type CreateTransactionInput = z.infer<typeof CreateTransactionSchema>;
export type UpdateStockInput = z.infer<typeof UpdateStockSchema>;
