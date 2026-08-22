import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Layouts
import { CustomerLayout } from './layouts/CustomerLayout';
import { SellerLayout } from './layouts/SellerLayout';

// Customer Pages
import { Home } from './pages/Home';
import { ProductList } from './pages/ProductList';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderHistory } from './pages/OrderHistory';
import { OrderDetail } from './pages/OrderDetail';
import { Login } from './pages/Login';

// Seller Pages
import { SellerDashboard } from './pages/SellerDashboard';
import { SellerProducts } from './pages/SellerProducts';
import { SellerOrders } from './pages/SellerOrders';
import { SellerInventory } from './pages/SellerInventory';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          
          {/* Customer Routes (Navbar + Footer) */}
          <Route path="/" element={<CustomerLayout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<ProductList />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="login" element={<Login />} />
          </Route>

          {/* Seller Routes (Sidebar + Admin Header) */}
          <Route path="/seller" element={<SellerLayout />}>
            <Route index element={<SellerDashboard />} />
            <Route path="products" element={<SellerProducts />} />
            <Route path="orders" element={<SellerOrders />} />
            <Route path="inventory" element={<SellerInventory />} />
          </Route>

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
