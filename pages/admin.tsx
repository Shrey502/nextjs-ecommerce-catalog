import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import Layout from "../components/Layout";
import { Product } from "../lib/data";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Admin: NextPage = () => {
  const { data: products, error } = useSWR<Product[]>("/api/products", fetcher);
  const [form, setForm] = useState<Product | null>(null);

  const handleChange = (field: keyof Product, value: any) => {
    if (!form) return;
    setForm({ ...form, [field]: value });
  };

  const startNewProduct = () => {
    setForm({
      id: "",
      name: "",
      slug: "",
      description: "",
      price: 0,
      inventory: 0,
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleSave = async () => {
    if (!form) return;

    const secretKey = prompt("Enter API Secret Key:");
    if (!secretKey) return;

    const isNew = !form.id;

    const res = await fetch(
      isNew ? "/api/products" : `/api/products/update/${form.id}`,
      {
        method: isNew ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${secretKey}`,
        },
        body: JSON.stringify(form),
      }
    );

    if (!res.ok) return alert("❌ Failed to save product");

    setForm(null);
    mutate("/api/products");
    alert(isNew ? "✅ Product added!" : "✅ Product updated!");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;

    const secretKey = prompt("Enter API Secret Key:");
    if (!secretKey) return;

    const res = await fetch(`/api/products/update/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    });

    if (!res.ok) return alert("❌ Delete failed");

    mutate("/api/products");
    alert("🗑️ Product deleted!");
  };

  if (error) return <Layout>Failed to load products...</Layout>;
  if (!products) return <Layout>Loading...</Layout>;

  return (
    <Layout>
      <Head>
        <title>Admin Panel</title>
      </Head>

      {/* ✅ Create New Product */}
      <button 
        onClick={startNewProduct} 
        style={{ margin: "20px", padding: "8px" }}
      >
        ➕ Add Product
      </button>

      <div style={{ display: "flex", gap: "40px", padding: "20px" }}>
        
        {/* ✅ Product Form */}
        <div>
          <h2>
            {form ? (form.id ? "Edit Product" : "Add Product") : "Select Product"}
          </h2>

          {form && (
            <>
              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />

              <input
                placeholder="Slug"
                value={form.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
              />

              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />

              <input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(e) => handleChange("price", +e.target.value)}
              />

              <input
                type="number"
                placeholder="Inventory"
                value={form.inventory}
                onChange={(e) => handleChange("inventory", +e.target.value)}
              />

              <button style={{ marginTop: 10 }} onClick={handleSave}>
                ✅ Save
              </button>
            </>
          )}
        </div>

        {/* ✅ Product List */}
        <div>
          <h2>Products ({products.length})</h2>
          <ul style={{ lineHeight: "28px" }}>
            {products.map((p) => (
              <li key={p.id}>
                <strong>{p.name}</strong> — ₹{p.price} | Stock: {p.inventory}
                <br />
                <button onClick={() => setForm(p)}>✏️ Edit</button>
                <button 
                  onClick={() => handleDelete(p.id)} 
                  style={{ marginLeft: "10px" }}
                >
                  🗑️ Delete
                </button>
                <hr />
              </li>
            ))}
          </ul>
        </div>

      </div>
    </Layout>
  );
};

export default Admin;
