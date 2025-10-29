Project Title: Product Management Admin Dashboard
Name: Shreyas Anil Patil
Date: October 2025


## ⚙️ Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/nextjs-admin-dashboard.git

npm install --install dependencies 

npm run dev --simplly run this command to run the project



A simple **Next.js-based Product Management Admin Panel** with CRUD functionality — allowing admins to **view, add, update, and delete** products through a clean interface.

---

## Features
-  Next.js frontend using **SWR** for live data fetching.
-  API routes (`pages/api/products`) for CRUD operations.
-  JSON file (or database ready) as backend data source.
-  Simple secret-key–based protection for update/delete.
-  Minimal and intuitive UI for managing product data.

---

## Project Structure
📁 ASSIGNMENT
├── 📁 next-ecommerce-project
│   ├── 📁 components
│   ├── 📁 data
│   │   └── 📄 products.json
│   ├── 📁 lib
│   │   └── 📄 data.ts
│   ├── 📁 node_modules
│   ├── 📁 pages
│   │   ├── 📁 api
│   │   │   └── 📁 products
│   │   │       ├── 📁 update
│   │   │       ├── 📄 [id].ts
│   │   │       ├── 📄 [slug].ts
│   │   │       └── 📄 index.ts
│   │   ├── 📁 products
│   │   │   └── 📄 [slug].tsx
│   │   ├── 📄 _app.tsx
│   │   ├── 📄 admin.tsx
│   │   ├── 📄 dashboard.tsx
│   │   └── 📄 index.tsx
│   ├── 📁 public
│   ├── 📁 src
│   ├── 📁 styles
│   ├── 📄 .env
│   ├── 📄 .gitignore
│   ├── 📄 next-env.d.ts
│   ├── 📄 next.config.js
│   ├── 📄 package-lock.json
│   ├── 📄 package.json
│   ├── 📄 postcss.config.mjs
│   ├── 📄 README.md
│   └── 📄 tsconfig.json
├── 📄 debug.log
├── 📄 NextJs Assignment.pdf
├── 📄 package-lock.json
└── 📄 package.json


**Authuntication**

If you’d like to review my authentication and authorization implementation, please visit "https://github.com/Shrey502/Auth-portfolio"
The project also includes a two-step verification feature.
