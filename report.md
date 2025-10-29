1. Rationale Behind Rendering Choices

The project uses a hybrid rendering strategy — combining Static Site Generation (SSG) and Client-Side Rendering (CSR) depending on the use case of each page:

a)  **Page** :/ (Home Page)	
    **Rendering Type**: Static Site Generation (SSG)	
    **Rationale**:The product list on the homepage doesn’t change frequently, so generating it at build time gives faster load  speed,    better SEO, and reduced server load.

b)  **Page** :/products/[slug]	
    **Rendering Type**:Static Site Generation (Dynamic Paths)	
    **Rationale**:Each product page is pre-rendered with product details, improving performance and making the pages SEO-friendly for search engines.

c)  **Page** :/admin (Dashboard)	
    **Rendering Type**:Client-Side Rendering (CSR)	
    **Rationale**:The admin panel requires live updates (adding, editing, deleting products). CSR allows instant updates through SWR without reloading or rebuilding pages, creating a smoother experience.


2. Data Flow Between Frontend and Backend

Here’s how the data moves through the app:
Frontend Request
            The frontend (Next.js React components) makes API calls using the fetch function or SWR hooks (useSWR("/api/products", fetcher)).
            These requests go to the backend API routes defined in /pages/api/.
Backend Processing
            The backend API routes (/api/products and /api/products/update/[id]) handle CRUD operations.
            The logic for reading, writing, or updating data is defined in /lib/data.ts.
            Data is stored in a simple JSON file, simulating a small database.
Response to Frontend
            The backend returns the updated product data as JSON.   
            SWR automatically revalidates and refreshes the UI with the latest data after any operation (add, update, delete).

3. Challenges Faced and How I Solved Them

One challenge was keeping the product list updated in real-time after any CRUD operation. I solved this by using SWR’s mutate function, which automatically refreshes the data on the client side after an update.
Another issue was handling both adding and editing products within the same form. I used a single React state object (form) and checked whether an id existed — if yes, it was an edit; if not, it created a new product.
To prevent unauthorized access, I implemented a simple secret key system where the admin must enter a key before performing any write or delete action.
The form also wasn’t resetting after saving a product, which I fixed by calling setForm(null) after a successful save.
Finally, to keep the code organized, I created a reusable Layout component and structured the app neatly with separate folders for components, API routes, and data logic.

4. Screenshots
Home Page
    Displays a list of all products using Static Site Generation.

Product Page
    Shows product details using SSG with Dynamic Routes.

Admin Dashboard
    Manages CRUD operations using Client-Side Rendering and SWR.