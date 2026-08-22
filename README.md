# Onam Village Store

A polished, responsive, and modern marketplace designed for the Onam festival, enabling local weavers, farmers, and artisans of Kerala to list products, manage inventory, and receive orders. Customers can browse, search, purchase via simulated checkout, and track their order status visually.

**Tagline:** Celebrate Onam. Support Local. Shop Traditionally.

---

## 🚀 Key Features

### Customer Experience
* **Sticky Navigation Header:** Includes responsive hamburger drawer, active cart counters, and search redirection.
* **Artisanal Catalog:** Category shortcuts, search matching, price slide filters, and in-stock toggle filters.
* **Product Details:** Incremental basket counters matching inventory ceilings, seller spotlight cards, and delivery estimates.
* **Basket & Sandbox Checkout:** Shipping form validation, free shipping thresholds (over ₹1000), Cash on Delivery and simulated UPI payment options.
* **Visual Tracking:** Live vertical/horizontal shipment progress timeline reflecting seller updates.

### Seller Studio Dashboard
* **Metrics Console:** Tracks total revenue, sales quantities, active products, and low stock alarms.
* **Inventory Control:** Direct in-row quick stock increment/decrement and instant save overrides.
* **Product CRUD Manager:** Create, update, toggle status, and delete products using custom forms modals.
* **Order Status Modifier:** Seller step-actions (`Confirm Order`, `Mark Packed`, `Ship Package`, `Mark Delivered`) updating customer order cards immediately.

---

## ⚙️ Technology Stack

* **Core Framework:** React 19 + TypeScript + Vite
* **Routing:** React Router v6
* **Styling:** Tailwind CSS v4
* **Icons:** Lucide React
* **Database & Adaptability:** Dual-layer database configuration. It connects to Supabase if config variables are found, or automatically falls back to an interactive client-side LocalStorage DB pre-seeded with 12 traditional items in Rupees.

---

## 🛠️ Installation & Running Locally

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Supabase (Optional):**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   *If `.env` is omitted, the application automatically runs in a fully featured offline Demo Mode using local storage.*

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

4. **Production Build:**
   ```bash
   npm run build
   ```

---

## 📁 File Structure

```
src/
├── components/          # Reusable UI components (Navbar, Footer, ProductCard, CategoryCard, Toast, Modal, OrderStatus, SellerSidebar)
├── context/             # AppContext.tsx for global Cart, Auth, and Toast notifications
├── data/                # Seed database parameters (12 detailed mock products)
├── layouts/             # CustomerLayout and SellerLayout grid systems
├── lib/                 # Supabase client instantiation
├── pages/               # Functional routes (Home, ProductList, ProductDetail, Cart, Checkout, Orders, Tracking, Login, Seller panels)
├── services/            # dbService.ts implementing dynamic Supabase/LocalStorage CRUD adapters
├── index.css            # Base stylesheet registering Google fonts and custom Onam color theme variables
└── App.tsx              # Router routing configurations
```
