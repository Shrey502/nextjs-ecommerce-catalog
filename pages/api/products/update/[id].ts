import type { NextApiRequest, NextApiResponse } from 'next';
import { getProducts, saveProducts } from '../../../../lib/data';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  if (req.method === 'PUT') {
    if (req.headers.authorization !== `Bearer ${process.env.API_SECRET_KEY}`) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const products = getProducts();
      const index = products.findIndex((p) => p.id === id);

      if (index === -1) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const updatedProduct = {
        ...products[index],
        ...req.body,
        lastUpdated: new Date().toISOString(),
      };

      products[index] = updatedProduct;
      saveProducts(products);

      return res.status(200).json(updatedProduct);
    } catch {
      return res.status(500).json({ message: 'Error updating product' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const products = getProducts();
      const updatedProducts = products.filter((p) => p.id !== id);

      if (updatedProducts.length === products.length) {
        return res.status(404).json({ message: 'Product not found' });
      }

      saveProducts(updatedProducts);

      return res.status(200).json({ message: 'Product deleted successfully!' });
    } catch {
      return res.status(500).json({ message: 'Error deleting product' });
    }
  }

  res.setHeader('Allow', ['PUT', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
