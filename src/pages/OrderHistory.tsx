import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Calendar, AlertCircle } from 'lucide-react';
import { dbService, Order, OrderStatus as StatusType } from '../services/db';
import { useApp } from '../context/AppContext';

export const OrderHistory: React.FC = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const allOrders = await dbService.getOrders();
      // Filter orders by current customer
      const customerId = user?.id || 'cust-1'; // fallback to demo customer
      const filtered = allOrders.filter(o => o.customer_id === customerId);
      setOrders(filtered);
    } catch (e) {
      console.error("Failed to load orders", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  // Status Badge Helper
  const getStatusBadge = (status: StatusType) => {
    switch (status) {
      case 'pending':
        return <span className="bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full font-sans">Pending</span>;
      case 'confirmed':
        return <span className="bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full font-sans">Confirmed</span>;
      case 'packed':
        return <span className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full font-sans">Packed</span>;
      case 'shipped':
        return <span className="bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full font-sans">Shipped</span>;
      case 'out_for_delivery':
        return <span className="bg-orange-50 border border-orange-200 text-orange-700 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full font-sans">Out For Delivery</span>;
      case 'delivered':
        return <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full font-sans">Delivered</span>;
      case 'cancelled':
        return <span className="bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full font-sans">Cancelled</span>;
      default:
        return <span className="bg-gray-50 border border-gray-200 text-gray-700 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full font-sans">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto animate-pulse py-6">
        <div className="h-8 bg-onam-cream-dark rounded w-1/3" />
        <div className="space-y-4">
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="bg-white border border-onam-gold/15 h-36 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Page Title */}
      <div className="border-b border-onam-gold/20 pb-4">
        <h2 className="font-serif text-3xl font-bold text-onam-green">Your Order History</h2>
        <p className="text-sm text-onam-charcoal/60 font-light mt-1">
          Review shipping progress and details for your traditional bookings
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-onam-gold/25 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
          <span className="text-5xl block">📦</span>
          <h3 className="font-serif font-bold text-xl text-onam-green">No Orders Found</h3>
          <p className="text-sm text-onam-charcoal/60 font-sans">
            You haven't placed any orders yet. Let's fill your home with Onam joy!
          </p>
          <button
            onClick={() => navigate('/products')}
            className="bg-onam-green hover:bg-onam-green-light text-onam-cream text-xs font-bold px-6 py-2.5 rounded-full transition-all shadow cursor-pointer inline-block"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-onam-gold/20 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              
              {/* Order Box Top Header */}
              <div className="bg-onam-cream-dark/30 border-b border-onam-gold/15 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6 text-xs text-onam-charcoal/70 font-sans">
                  <div>
                    <span className="text-onam-charcoal/50 block text-[10px] uppercase tracking-wider">Date Placed</span>
                    <span className="font-semibold flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-onam-gold-dark" />
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <div>
                    <span className="text-onam-charcoal/50 block text-[10px] uppercase tracking-wider">Order Reference ID</span>
                    <span className="font-bold text-onam-green mt-0.5 block">{order.id}</span>
                  </div>

                  <div>
                    <span className="text-onam-charcoal/50 block text-[10px] uppercase tracking-wider">Total Amount</span>
                    <span className="font-bold text-onam-green mt-0.5 block">₹{order.total_amount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Order Box Body Content */}
              <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Thumbnails of Items inside Order */}
                <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto">
                  {order.items.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="relative w-16 h-16 rounded-xl border border-onam-gold/15 overflow-hidden shrink-0 bg-onam-cream-dark/20 aspect-square group"
                      title={item.product_name}
                    >
                      <img
                        src={item.image_url}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0 right-0 bg-onam-green text-onam-cream text-[9px] font-bold px-1 rounded-tl shadow">
                        x{item.quantity}
                      </span>
                    </div>
                  ))}
                  
                  <div className="pl-2">
                    <span className="text-xs font-semibold text-onam-charcoal block leading-tight font-sans">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </span>
                    <span className="text-[10px] text-onam-charcoal/50 font-sans block mt-0.5">
                      Delivering to: <strong className="text-onam-green/80 font-medium">{order.customer_name}</strong>
                    </span>
                  </div>
                </div>

                {/* Track Button */}
                <button
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="w-full md:w-auto bg-onam-cream-dark/40 hover:bg-onam-green border border-onam-gold/40 hover:border-onam-green text-onam-green hover:text-onam-cream font-bold px-5 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  Track Order
                  <ArrowRight className="w-4 h-4" />
                </button>

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
export default OrderHistory;
