import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, FormEvent } from 'react';
import useSWR, { mutate } from 'swr';
import Layout from '../components/Layout';
import { Product } from '../lib/data';

// ✅ SWR fetcher function
const fetcher = (url: string) => fetch(url).then(res => res.json());

const Admin: NextPage = () => {
  const { data: products, error } = useSWR<Product[]>('/api/products', fetcher);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [inventory, setInventory] = useState(0);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const secretKey = prompt('Enter API Secret Key:');
    if (!secretKey) return;

    const newProduct = {
      name,
      slug,
      description,
      price,
      inventory,
      category: 'General'
    };

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secretKey}`
      },
      body: JSON.stringify(newProduct),
    });

    if (!res.ok) {
      return alert('Failed to add product');
    }

    setName('');
    setSlug('');
    setDescription('');
    setPrice(0);
    setInventory(0);

    mutate('/api/products'); // ✅ Refresh product list
    alert('✅ Product added successfully!');
  };

  if (error) return <div>❌ Failed to load products</div>;
  if (!products) return <div>⏳ Loading products...</div>;

  return (
    <Layout>
      <Head>
        <title>Admin Panel</title>
      </Head>

      <div style={{ padding: '20px', display: 'flex', gap: '50px' }}>
        
        {/* ✅ Product Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            width: '260px'
          }}
        >
          <h2>Add Product</h2>

          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            placeholder="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(+e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Inventory"
            value={inventory}
            onChange={(e) => setInventory(+e.target.value)}
            required
          />

          <button type="submit" style={{ background: 'black', color: 'white', padding: '8px 10px' }}>
            ➕ Add Product
          </button>
        </form>

        {/* ✅ Product List */}
        <div>
          <h2>Products ({products.length})</h2>
          <ul style={{ lineHeight: '28px' }}>
            {products.map((p) => (
              <li key={p.id}>
                <strong>{p.name}</strong> — ₹{p.price} | Stock: {p.inventory}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </Layout>
  );
};

export default Admin;
