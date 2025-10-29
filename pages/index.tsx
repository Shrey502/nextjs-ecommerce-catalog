import type { InferGetStaticPropsType, NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { getProducts, Product } from '../lib/data';
import Link from 'next/link';

export async function getStaticProps() {
  console.log('Fetching data for SSG (Home Page)...');
  const products = getProducts();

  return {
    props: { products },
  };
}

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  products,
}) => {
  const [filter, setFilter] = useState('');

  const filteredProducts = products.filter((product: Product) =>
    product.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>E-Commerce Home</title>
      </Head>

      <div style={{ padding: '20px' }}>
        <h1>Product Catalog</h1>

        <input
          type="text"
          placeholder="Search products..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: '8px', width: '300px', marginBottom: '20px' }}
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {filteredProducts.map((product: Product) => (
  <div
    key={product.id}
    style={{
      border: '1px solid #ddd',
      padding: '16px',
      borderRadius: '8px',
      cursor: 'pointer'
    }}
  >
    <Link href={`/products/${product.slug}`}>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <strong>₹{product.price}</strong>
      <p>Stock: {product.inventory}</p>
    </Link>
  </div>
))}
        </div>
      </div>
    </>
  );
};

export default Home;
