import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, ShoppingBag, Eye, RefreshCw, ChevronRight } from 'lucide-react';
import { dbService, Order, OrderStatus } from '../services/db';
import { useApp } from '../context/AppContext';

export const SellerOrders: React.FC = () => {
  const { user, addToast } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const sellerId = user?.seller_id || 'seller-5';

  const fetchSellerOrders = async () => {
    setLoading(true);
    try {
      const allOrders = await dbService.getOrders();
      // Filter orders containing items belonging to this seller
      const filtered = allOrders.filter(order =>
        order.items.some(item => item.seller_id === sellerId)
      );
      setOrders(filtered);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerOrders();
  }, [user]);

  const isValidTransition = (oldStatus: OrderStatus, newStatus: OrderStatus): boolean => {
    if (oldStatus === newStatus) return true;
    if (oldStatus === 'cancelled' || oldStatus === 'delivered') return false;
    
    const sequence: OrderStatus[] = ['pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered'];
    const oldIdx = sequence.indexOf(oldStatus);
    const newIdx = sequence.indexOf(newStatus);
    
    if (newStatus === 'cancelled') {
      return oldStatus === 'pending' || oldStatus === 'confirmed' || oldStatus === 'packed';
    }
    
    if (oldIdx === -1 || newIdx === -1) return false;
    return newIdx > oldIdx;
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    if (!isValidTransition(order.status, newStatus)) {
      addToast(`Invalid transition from ${order.status} to ${newStatus}`, "error");
      return;
    }

    try {
      const updated = await dbService.updateOrderStatus(orderId, newStatus);
      if (updated) {
        addToast(`Order updated to ${newStatus} successfully!`, 'success');
        fetchSellerOrders();
      }
    } catch (e) {
      addToast("Failed to update status", "error");
    }
  };

  // Helper to determine the next status in the sequence for quick action buttons
  const getNextStatusAction = (status: OrderStatus): { nextStatus: OrderStatus; label: string } | null => {
    switch (status) {
      case 'pending':
        return { nextStatus: 'confirmed', label: 'Confirm Order' };
      case 'confirmed':
        return { nextStatus: 'packed', label: 'Mark Packed' };
      case 'packed':
        return { nextStatus: 'shipped', label: 'Ship Package' };
      case 'shipped':
        return { nextStatus: 'out_for_delivery', label: 'Out for Delivery' };
      case 'out_for_delivery':
        return { nextStatus: 'delivered', label: 'Mark Delivered' };
      case 'delivered':
      case 'cancelled':
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse py-4">
        <div className="h-8 bg-onam-cream-dark rounded w-1/4" />
        <div className="h-48 bg-white border border-onam-gold/15 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-onam-gold/20 pb-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-onam-green">Manage Seller Orders</h2>
          <p className="text-sm text-onam-charcoal/60 font-light mt-1">
            Track customer invoices, review shipping schedules, and update order statuses
          </p>
        </div>
        
        <button
          onClick={fetchSellerOrders}
          className="p-2.5 bg-white hover:bg-onam-cream-dark/50 text-onam-green hover:text-onam-gold rounded-xl border border-onam-gold/25 transition-colors cursor-pointer"
          title="Refresh List"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <div className="bg-white border border-onam-gold/20 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
          <span className="text-5xl block">🛍️</span>
          <h3 className="font-serif font-bold text-xl text-onam-green">No Orders Found</h3>
          <p className="text-sm text-onam-charcoal/60 font-sans leading-relaxed">
            No customer orders containing your products have been placed yet. When orders arrive, they will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-onam-gold/20 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans border-collapse">
              <thead>
                <tr className="bg-onam-cream-dark/40 text-onam-green border-b border-onam-gold/20 font-bold">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Date Placed</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Items / Details</th>
                  <th className="px-6 py-4">Your Revenue</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Dispatch Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-onam-gold/10">
                {orders.map((order) => {
                  const sellerItems = order.items.filter(item => item.seller_id === sellerId);
                  const revenueSubtotal = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                  const nextAction = getNextStatusAction(order.status);
                  
                  return (
                    <tr key={order.id} className="hover:bg-onam-cream-dark/10 transition-colors">
                      
                      {/* ID */}
                      <td className="px-6 py-4 font-bold text-onam-green">
                        {order.id}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 font-medium text-onam-charcoal/70">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>

                      {/* Customer Info */}
                      <td className="px-6 py-4 font-semibold text-onam-charcoal">
                        <div>{order.customer_name}</div>
                        <div className="text-[10px] text-onam-charcoal/50 font-normal mt-0.5 font-sans">
                          {order.customer_city} &bull; Ph: {order.customer_phone}
                        </div>
                      </td>

                      {/* Purchased products info */}
                      <td className="px-6 py-4">
                        <div className="space-y-1 max-w-xs">
                          {sellerItems.map((item, idx) => (
                            <div key={item.id || idx} className="truncate text-onam-charcoal/80 flex justify-between gap-4 font-medium">
                              <span>{item.product_name}</span>
                              <span className="font-bold text-onam-green shrink-0">x{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 font-bold text-onam-green text-sm">
                        ₹{revenueSubtotal.toLocaleString('en-IN')}
                      </td>

                      {/* Dropdown status update */}
                      <td className="px-6 py-4 text-center">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-colors outline-none cursor-pointer border ${
                            order.status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : order.status === 'cancelled'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="packed">Packed</option>
                          <option value="shipped">Shipped</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Step Actions */}
                      <td className="px-6 py-4 text-center">
                        {nextAction ? (
                          <button
                            onClick={() => handleUpdateStatus(order.id, nextAction.nextStatus)}
                            className="bg-onam-green hover:bg-onam-green-light text-onam-cream font-bold px-3 py-2 rounded-xl text-[9px] flex items-center justify-center gap-1 transition-all shadow-sm cursor-pointer mx-auto"
                          >
                            {nextAction.label}
                            <ChevronRight className="w-3 h-3 text-onam-gold" />
                          </button>
                        ) : order.status === 'delivered' ? (
                          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                            ✅ Order Dispatched
                          </span>
                        ) : (
                          <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                            ❌ Order Cancelled
                          </span>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
export default SellerOrders;
