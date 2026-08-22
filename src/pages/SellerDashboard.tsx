import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TrendingUp, ShoppingBag, Package, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { dbService, Order, OrderStatus } from '../services/db';
import { Product } from '../data/mockProducts';
import { useApp } from '../context/AppContext';

export const SellerDashboard: React.FC = () => {
  const { user } = useApp();
  const navigate = useNavigate();

  // Metrics
  const [metrics, setMetrics] = useState({
    sales: 0,
    ordersCount: 0,
    productsCount: 0,
    lowStockCount: 0,
    pendingOrdersCount: 0
  });

  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const computeAndSetMetrics = (allProducts: Product[], allOrders: Order[], sellerId: string) => {
    // Filter products
    const sProducts = allProducts.filter(p => p.seller_id === sellerId);
    setSellerProducts(sProducts);

    // Filter orders and calculate sales
    let totalSales = 0;
    let sellerOrderCount = 0;
    let pendingCount = 0;
    const sPendingOrders: Order[] = [];

    allOrders.forEach(order => {
      // Check if order contains seller's items
      const sellerItems = order.items.filter(item => item.seller_id === sellerId);
      
      if (sellerItems.length > 0) {
        sellerOrderCount++;
        
        if (order.status !== 'cancelled') {
          const orderSubtotal = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          totalSales += orderSubtotal;
        }

        if (order.status !== 'delivered' && order.status !== 'cancelled') {
          pendingCount++;
          sPendingOrders.push(order);
        }
      }
    });

    setPendingOrders(sPendingOrders.slice(0, 5)); // show top 5 pending orders

    // Calculate stock status
    const lowStock = sProducts.filter(p => p.stock > 0 && p.stock <= 10).length;

    setMetrics({
      sales: totalSales,
      ordersCount: sellerOrderCount,
      productsCount: sProducts.length,
      lowStockCount: lowStock,
      pendingOrdersCount: pendingCount
    });
  };

  const fetchDashboardData = async () => {
    const sellerId = user?.seller_id || 'seller-5';
    
    // 1. Try to load from local storage cache instantly
    const cachedProducts = localStorage.getItem('onam_products_cache');
    const cachedOrders = localStorage.getItem('onam_orders_cache');
    
    let parsedProducts: Product[] = [];
    let parsedOrders: Order[] = [];
    
    try {
      if (cachedProducts) {
        parsedProducts = JSON.parse(cachedProducts);
      }
      if (cachedOrders) {
        parsedOrders = JSON.parse(cachedOrders);
      } else {
        const localOrders = localStorage.getItem('onam_orders');
        parsedOrders = localOrders ? JSON.parse(localOrders) : [];
      }
      
      if (parsedProducts.length > 0) {
        computeAndSetMetrics(parsedProducts, parsedOrders, sellerId);
        setLoading(false);
      } else {
        setLoading(true);
      }
    } catch (e) {
      setLoading(true);
    }

    // 2. Fetch fresh dashboard data from Supabase in the background
    try {
      const allProducts = await dbService.getProducts();
      const allOrders = await dbService.getOrders();

      // Recalculate metrics
      computeAndSetMetrics(allProducts, allOrders, sellerId);

      // Save to localStorage caches
      localStorage.setItem('onam_products_cache', JSON.stringify(allProducts));
      localStorage.setItem('onam_orders_cache', JSON.stringify(allOrders));
    } catch (e) {
      console.error("Dashboard fetch failed", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse py-4">
        <div className="h-8 bg-onam-cream-dark rounded w-1/4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="bg-white border border-onam-gold/15 h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  // Categories distribution for analytics visual
  const categorySummary = sellerProducts.reduce((acc: { [key: string]: number }, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const orderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-100 uppercase">Pending</span>;
      case 'confirmed':
        return <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-100 uppercase">Confirmed</span>;
      case 'packed':
        return <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-100 uppercase">Packed</span>;
      case 'shipped':
        return <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-100 uppercase">Shipped</span>;
      case 'out_for_delivery':
        return <span className="bg-orange-50 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded border border-orange-100 uppercase">Out For Delivery</span>;
      default:
        return <span className="bg-gray-50 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded border border-gray-100 uppercase">{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div>
        <h2 className="font-serif text-3xl font-bold text-onam-green">Seller Overview</h2>
        <p className="text-sm text-onam-charcoal/60 font-light mt-1">
          Monitor your studio sales, stock alerts, and prepare shipments
        </p>
      </div>

      {/* Metrics Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        
        {/* Metric 1: Sales */}
        <div className="bg-white border border-onam-gold/20 hover:border-onam-gold p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <span className="text-[10px] text-onam-charcoal/50 uppercase tracking-widest font-sans block font-semibold">Total Revenue</span>
            <span className="font-serif font-extrabold text-xl text-onam-green block mt-1">
              ₹{metrics.sales.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Metric 2: Orders */}
        <div className="bg-white border border-onam-gold/20 hover:border-onam-gold p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <span className="text-[10px] text-onam-charcoal/50 uppercase tracking-widest font-sans block font-semibold">Total Orders</span>
            <span className="font-serif font-extrabold text-xl text-onam-green block mt-1">
              {metrics.ordersCount}
            </span>
          </div>
        </div>

        {/* Metric 3: Active Products */}
        <div className="bg-white border border-onam-gold/20 hover:border-onam-gold p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0 shadow-sm">
            <Package className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <span className="text-[10px] text-onam-charcoal/50 uppercase tracking-widest font-sans block font-semibold">Listed Products</span>
            <span className="font-serif font-extrabold text-xl text-onam-green block mt-1">
              {metrics.productsCount}
            </span>
          </div>
        </div>

        {/* Metric 4: Low Stock Alerts */}
        <div className="bg-white border border-onam-gold/20 hover:border-onam-gold p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0 shadow-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <span className="text-[10px] text-onam-charcoal/50 uppercase tracking-widest font-sans block font-semibold">Low Inventory</span>
            <span className="font-serif font-extrabold text-xl text-onam-green block mt-1">
              {metrics.lowStockCount}
            </span>
          </div>
        </div>

        {/* Metric 5: Pending Orders */}
        <div className="bg-white border border-onam-gold/20 hover:border-onam-gold p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0 shadow-sm">
            <Clock className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <span className="text-[10px] text-onam-charcoal/50 uppercase tracking-widest font-sans block font-semibold">Pending Orders</span>
            <span className="font-serif font-extrabold text-xl text-onam-green block mt-1">
              {metrics.pendingOrdersCount}
            </span>
          </div>
        </div>

      </div>

      {/* Grid: Charts & Pending Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Analytics Visual (Categories chart & targets) */}
        <div className="bg-white border border-onam-gold/20 rounded-2xl p-6 shadow-sm space-y-6 lg:col-span-1">
          <h3 className="font-serif font-bold text-base text-onam-green border-b border-onam-gold/15 pb-2">
            Catalog Inventory Distribution
          </h3>

          <div className="space-y-4">
            {Object.keys(categorySummary).length === 0 ? (
              <span className="text-xs text-onam-charcoal/50 italic block">No items added to catalog.</span>
            ) : (
              Object.keys(categorySummary).map(cat => {
                const count = categorySummary[cat];
                const percentage = (count / metrics.productsCount) * 100;
                return (
                  <div key={cat} className="space-y-1 font-sans text-xs">
                    <div className="flex justify-between font-semibold">
                      <span className="text-onam-charcoal">{cat}</span>
                      <span className="text-onam-green font-bold">{count} {count === 1 ? 'item' : 'items'}</span>
                    </div>
                    <div className="w-full bg-onam-cream-dark h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-onam-gold h-full rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="bg-onam-cream-dark/30 border border-onam-gold/15 rounded-xl p-4 space-y-3 font-sans text-xs">
            <h4 className="font-serif font-bold text-onam-green">Demo Performance Target</h4>
            <div className="flex justify-between">
              <span className="text-onam-charcoal/60">Festive Sales Goal</span>
              <span className="font-bold text-onam-green">₹50,000</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-onam-green h-full rounded-full"
                style={{ width: `${Math.min((metrics.sales / 50000) * 100, 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-onam-charcoal/50 block text-right font-light">
              {Math.min(Math.round((metrics.sales / 50000) * 100), 100)}% of target met
            </span>
          </div>
        </div>

        {/* Right Column: Pending Orders Details */}
        <div className="bg-white border border-onam-gold/20 rounded-2xl p-6 shadow-sm space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-onam-gold/15 pb-2">
            <h3 className="font-serif font-bold text-base text-onam-green">
              Active Orders Requiring Action
            </h3>
            <button
              onClick={() => navigate('/seller/orders')}
              className="text-xs font-bold text-onam-gold-dark hover:underline font-sans"
            >
              Manage All Orders
            </button>
          </div>

          {pendingOrders.length === 0 ? (
            <div className="text-center py-12 space-y-3 font-sans">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
              <h4 className="font-serif font-bold text-sm text-onam-green">All caught up!</h4>
              <p className="text-xs text-onam-charcoal/60 max-w-xs mx-auto">
                No orders are currently pending confirmation or dispatch. Enjoy your sadya!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-onam-gold/10">
              {pendingOrders.map(order => {
                const sellerItems = order.items.filter(item => item.seller_id === (user?.seller_id || 'seller-5'));
                const subtotal = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                
                return (
                  <div key={order.id} className="py-4 flex flex-col sm:flex-row items-center justify-between gap-4 first:pt-0 last:pb-0 text-xs font-sans">
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-onam-green">{order.id}</span>
                        {orderStatusBadge(order.status)}
                      </div>
                      <div className="text-onam-charcoal/60 text-[10px]">
                        Customer: <strong className="text-onam-charcoal font-semibold">{order.customer_name}</strong> &middot; {sellerItems.length} products
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="text-onam-charcoal/50 block text-[9px]">Your Subtotal</span>
                        <span className="font-serif font-bold text-onam-green text-sm">₹{subtotal}</span>
                      </div>

                      <button
                        onClick={() => navigate('/seller/orders')}
                        className="bg-onam-cream-dark/40 hover:bg-onam-green border border-onam-gold/45 text-onam-green hover:text-onam-cream px-3.5 py-1.5 rounded-lg font-bold text-[10px] transition-colors cursor-pointer"
                      >
                        Update Order
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
export default SellerDashboard;
