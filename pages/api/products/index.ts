import type { NextApiRequest, NextApiResponse } from 'next';
import { getProducts, saveProducts, Product } from '../../../lib/data';
import { v4 as uuidv4 } from 'uuid';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GET /api/products
  if (req.method === 'GET') {
    try {
      const products = getProducts();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error reading product data' });
    }
  } 
  // POST /api/products
  else if (req.method === 'POST') {
    // Simple key-based authentication
    if (req.headers.authorization !== `Bearer ${process.env.API_SECRET_KEY}`) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const products = getProducts();
      const newProduct: Product = {
        ...req.body,
        id: uuidv4(), // Generate a new unique ID
        lastUpdated: new Date().toISOString(),
      };

      products.push(newProduct);
      saveProducts(products);

      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ message: 'Error creating product' });
    }
  } 
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}