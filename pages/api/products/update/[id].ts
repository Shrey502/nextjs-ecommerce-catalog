import type { NextApiRequest, NextApiResponse } from 'next';
import { getProducts, saveProducts } from '../../../../lib/data';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  // PUT /api/products/update/[id]
  if (req.method === 'PUT') {
    // Simple key-based authentication
    if (req.headers.authorization !== `Bearer ${process.env.API_SECRET_KEY}`) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      let products = getProducts();
      const productIndex = products.findIndex((p) => p.id === id);

      if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Update the product
      const updatedProduct = {
        ...products[productIndex],
        ...req.body, // Apply updates from request body
        id: products[productIndex].id, // Ensure ID is not overwritten
        lastUpdated: new Date().toISOString(),
      };

      products[productIndex] = updatedProduct;
      saveProducts(products);

      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: 'Error updating product' });
    }
  } 
  else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}