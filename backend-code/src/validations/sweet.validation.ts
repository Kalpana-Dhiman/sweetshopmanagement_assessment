import { z } from 'zod';

export const createSweetSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  category: z.string().min(1, 'Category is required').max(50),
  price: z.number().positive('Price must be positive'),
  quantity: z.number().int().min(0, 'Quantity cannot be negative'),
});

export const updateSweetSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  category: z.string().min(1).max(50).optional(),
  price: z.number().positive().optional(),
  quantity: z.number().int().min(0).optional(),
});

export const searchSweetSchema = z.object({
  name: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
});

export const purchaseSchema = z.object({
  quantity: z.number().int().positive('Quantity must be positive').default(1),
});

export const restockSchema = z.object({
  quantity: z.number().int().positive('Quantity must be positive'),
});

export type CreateSweetInput = z.infer<typeof createSweetSchema>;
export type UpdateSweetInput = z.infer<typeof updateSweetSchema>;
export type SearchSweetInput = z.infer<typeof searchSweetSchema>;
export type PurchaseInput = z.infer<typeof purchaseSchema>;
export type RestockInput = z.infer<typeof restockSchema>;
