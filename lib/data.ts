import fs from 'fs';
import path from 'path';

// Define the Product type
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category?: string;
  inventory: number;
  lastUpdated: string;
}


// Get the full path to the products.json file
const productsFilePath = path.join(process.cwd(), 'data/products.json');

// Function to read products from the file
export function getProducts(): Product[] {
  const jsonData = fs.readFileSync(productsFilePath, 'utf-8');
  return JSON.parse(jsonData);
}

// Function to write products to the file
export function saveProducts(products: Product[]) {
  const data = JSON.stringify(products, null, 2);
  fs.writeFileSync(productsFilePath, data);
}