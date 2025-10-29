import type { NextApiRequest, NextApiResponse } from 'next';
import { getProducts, saveProducts, Product } from '../../../lib/data';
import { v4 as uuidv4 } from 'uuid';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const products = getProducts();
      return res.status(200).json(products);
    } catch {
      return res.status(500).json({ message: 'Error reading product data' });
    }
  }

  if (req.method === 'POST') {
    if (req.headers.authorization !== `Bearer ${process.env.API_SECRET_KEY}`) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const products = getProducts();

      const newProduct: Product = {
        ...req.body,
        id: uuidv4(),
        lastUpdated: new Date().toISOString(),
      };

      products.push(newProduct);
      saveProducts(products);

      return res.status(201).json(newProduct);
    } catch {
      return res.status(500).json({ message: 'Error creating product' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
