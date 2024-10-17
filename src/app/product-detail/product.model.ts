export interface Product {
    id: string;                  // Unique identifier for the product
    productName: string;          // Name of the product
    description: string;          // Description of the product
    price: number;                // Price of the product
    productDiscount: number;      // Discount percentage on the product
    productImagePath: string;                 // Path for the product image (relative path)
    imagePath?: string;           // Full image path (absolute path, optional)
    category: string;             // Category the product belongs to
    stock: number;                // Available stock for the product
    rating?: number;              // Optional product rating (if applicable)
    createdAt: Date;              // Date when the product was added
    updatedAt: Date;              // Date when the product was last updated
    tagLine: string;
    productShortDescription: string;
  }
  