import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../../components/Layout';
import useSWR from 'swr';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getProducts } from '../../../lib/data';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query;

  if (req.method === 'GET') {
    try {
      const products = getProducts();
      const product = products.find((p) => p.slug === slug);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      return res.status(200).json(product);

    } catch (error) {
      return res.status(500).json({ message: 'Error reading product data' });
    }
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}