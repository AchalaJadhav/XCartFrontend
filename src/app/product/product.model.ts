// src/app/models/product.model.ts
export interface Product {
  id: string; // MongoDB ObjectId as a string
  productName: string; // Name of the product
  price: number; // Price of the product
  productShortDescription: string; // Short description
  stock: number; // Available stock
  productDiscount: number; // Discount percentage
  path: string; // Path to the product image
  tagLine: string; // Tagline of the product
  status: string; // Availability status
  quantity: number; // Quantity available
}
