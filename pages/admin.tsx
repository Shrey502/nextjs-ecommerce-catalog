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

  const handleChange = (
    field: keyof Product,
    value: string | number | string[]
  ) => {
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
      // Add 'categories' if it's part of your Product type
      // categories: [], 
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async () => {
    if (!form) return;

    const secretKey = prompt("Enter API Secret Key:");
    if (!secretKey) return;

    const isNew = !form.id;

    // Make sure price and inventory are numbers
    const submissionData = {
      ...form,
      price: Number(form.price) || 0,
      inventory: Number(form.inventory) || 0,
    };

    const res = await fetch(
      isNew ? "/api/products" : `/api/products/update/${form.id}`,
      {
        method: isNew ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${secretKey}`,
        },
        body: JSON.stringify(submissionData),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      return alert(`❌ Failed to save product: ${err.message || 'Unknown error'}`);
    }

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

  // Simple inline styles for the form
  const formStyles: React.CSSProperties = {
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    maxWidth: "500px",
  };

  const inputGroupStyles: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  };

  const inputStyles: React.CSSProperties = {
    padding: "8px",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "1px solid #ddd",
  };

  const saveButtonStyles: React.CSSProperties = {
    padding: "10px 15px",
    backgroundColor: "#0070f3",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
    marginTop: "10px",
  };

  return (
    <Layout>
      <Head>
        <title>Admin Panel</title>
      </Head>

      {/* ✅ Create New Product */}
      <button
        onClick={startNewProduct}
        style={{ margin: "20px", padding: "10px 15px", fontSize: '1rem', cursor: 'pointer' }}
      >
        ➕ Add Product
      </button>

      {/* --- THIS LINE IS MODIFIED --- */}
      <div style={{ display: "flex", gap: "40px", padding: "20px", flexWrap: 'wrap', justifyContent: 'center' }}>
        
        {/* ✅ Product Form */}
        <div style={{ flex: "1 1 500px", maxWidth: '500px' /* Added maxWidth to constrain form */ }}>
          <h2>
            {form ? (form.id ? "Edit Product" : "Add Product") : "Select Product to Edit"}
          </h2>

          {form && (
            <div style={formStyles}>
              <div style={inputGroupStyles}>
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  style={inputStyles}
                />
              </div>

              <div style={inputGroupStyles}>
                <label htmlFor="slug">Slug</label>
                <input
                  id="slug"
                  placeholder="Slug"
                  value={form.slug}
                  onChange={(e) => handleChange("slug", e.target.value)}
                  style={inputStyles}
                />
              </div>

              <div style={inputGroupStyles}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  style={{...inputStyles, minHeight: '100px'}}
                  rows={4}
                />
              </div>

              <div style={inputGroupStyles}>
                <label htmlFor="price">Price (₹)</label>
                <input
                  id="price"
                  type="number"
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  style={inputStyles}
                />
              </div>

              <div style={inputGroupStyles}>
                <label htmlFor="inventory">Inventory (Stock)</label>
                <input
                  id="inventory"
                  type="number"
                  placeholder="Inventory"
                  value={form.inventory}
                  onChange={(e) => handleChange("inventory", e.target.value)}
                  style={inputStyles}
                />
              </div>

              <button style={saveButtonStyles} onClick={handleSave}>
                ✅ Save
              </button>
            </div>
          )}
        </div>

        {/* ✅ Product List */}
        <div style={{ flex: "1 1 300px", minWidth: '300px', maxWidth: '400px' /* Added maxWidth */ }}>
          <h2>Products ({products.length})</h2>
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {products.map((p) => (
              <li key={p.id} style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                <strong>{p.name}</strong>
                <br />
                <span>₹{p.price} | Stock: {p.inventory}</span>
                <br />
                <div style={{ marginTop: '10px' }}>
                  <button onClick={() => setForm(p)} style={{ padding: '5px 10px', cursor: 'pointer' }}>✏️ Edit</button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    style={{ marginLeft: "10px", padding: '5px 10px', cursor: 'pointer' }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;

