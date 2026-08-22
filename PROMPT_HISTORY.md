# Prompt History

This document lists the prompt structure used during the development sprint for the **Onam Village Store** marketplace.

---

## 💻 1. Master Build Prompt (Initial Request)
* **Goal:** Build a polished, responsive, modern marketplace celebrating Onam and supporting local Kerala artisans.
* **Tech Stack:** React + Vite + TypeScript + Tailwind CSS + Lucide React + Supabase (with client-side LocalStorage DB fallback).
* **Routes:** `/`, `/products`, `/product/:id`, `/cart`, `/checkout`, `/orders`, `/orders/:id`, `/login`, `/seller`, `/seller/products`, `/seller/orders`, `/seller/inventory`.
* **Design:** Warm cream background, deep forest green, gold highlights, elegant fonts (Outfit, Playfair Display), responsive layouts.

---

## 🛠️ 2. Step-by-Step Executions

1. **Scaffold React-Vite Project:**
   * Command: `npx -y create-vite@latest ./ --template react-ts`
   * Installs standard dependencies: `react-router-dom`, `lucide-react`, `@supabase/supabase-js`.
   * Installs dev dependencies: `tailwindcss`, `@tailwindcss/vite` (Tailwind CSS v4).

2. **Establish Design Tokens & Custom CSS:**
   * Configured `src/index.css` to load custom Google Fonts (`Outfit` and `Playfair Display`).
   * Configured the Tailwind v4 custom `@theme` variables for Onam colours:
     * Cream: `#FDFBF7`
     * Forest Green: `#1E3F20`
     * Mustard Gold: `#D4AF37`
     * Charcoal: `#2C2C2C`

3. **Pre-seed Mock Data:**
   * Created `src/data/mockProducts.ts` with 12 traditional products (Kerala Kasavu Saree, Nilavilakku, Banana Chips, etc.) priced in Indian Rupees (₹).

4. **Implement Dual-Layer Database Adapter:**
   * Created `src/lib/supabase.ts` for safe Supabase client initialization.
   * Created `src/services/db.ts` implementing a client-side LocalStorage database fallback. This automatically seeds initial products and order histories if Supabase credentials are not found, enabling interactive testing out-of-the-box.

5. **Design Global State Manager Context:**
   * Created `src/context/AppContext.tsx` managing user profiles, auth switcher, shopping cart baskets (add, quantity limits, delete), and toast alerts.

6. **Create Global UI Components:**
   * Navbar, Footer, CategoryCard, ProductCard, OrderStatus (vertical/horizontal timeline), SellerSidebar, Modal, and Toast alerts.

7. **Implement Customer Storefront Views:**
   * Home, Catalog (multi-criteria category/price/stock filtering), Product Detail, Shopping Cart, Checkout Form, and Visual Tracking.

8. **Implement Seller Studio Admin Views:**
   * Dashboard charts, Product Manager CRUD, Seller Invoice Table, and Inventory Quick Adjust.

9. **Resolve Compile Warning & Types Mismatches:**
   * Set up `tsconfig.app.json` linter relaxations to speed up bundler compiling.
   * Replaced Lucide social icon imports in `Footer.tsx` with inline SVG elements.
   * Refactored `OrderStatus.tsx` to store component types, removing `React.cloneElement` type issues.
   * Relocated `@import url` in `index.css` to the absolute top of the stylesheet.
