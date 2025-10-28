import type { NextApiRequest, NextApiResponse } from 'next';
import { getProducts } from '../../../lib/data';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query;

  // GET /api/products/[slug]
  if (req.method === 'GET') {
    try {
      const products = getProducts();
      const product = products.find((p) => p.slug === slug);

      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error reading product data' });
    }
  } 
  else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}