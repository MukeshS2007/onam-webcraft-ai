import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, MapPin, Phone, CreditCard, XSquare, AlertTriangle } from 'lucide-react';
import { dbService, Order } from '../services/db';
import { OrderStatus } from '../components/OrderStatus';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/Modal';

export const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useApp();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const fetchOrderDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const found = await dbService.getOrderById(id);
      setOrder(found);
    } catch (e) {
      console.error("Failed to load order detail", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!order) return;
    try {
      const updated = await dbService.updateOrderStatus(order.id, 'cancelled');
      if (updated) {
        setOrder(updated);
        addToast("Order cancelled successfully", "success");
      }
    } catch (err) {
      console.error(err);
      addToast("Failed to cancel order", "error");
    } finally {
      setIsCancelModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto animate-pulse py-6">
        <div className="h-6 bg-onam-cream-dark w-1/4 rounded" />
        <div className="bg-white border border-onam-gold/15 h-48 rounded-2xl" />
        <div className="bg-white border border-onam-gold/15 h-36 rounded-2xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16 max-w-md mx-auto space-y-4 bg-white border border-onam-gold/25 rounded-3xl p-8 shadow-sm">
        <span className="text-5xl">🌾</span>
        <h3 className="font-serif font-bold text-xl text-onam-green">Order Not Found</h3>
        <p className="text-sm text-onam-charcoal/60 font-sans">
          The order ID you requested does not exist or you do not have permission to view it.
        </p>
        <Link
          to="/orders"
          className="bg-onam-green hover:bg-onam-green-light text-onam-cream text-xs font-bold px-6 py-2.5 rounded-full inline-flex items-center gap-1.5 transition-all shadow"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
      </div>
    );
  }

  // Can cancel only if order status is placed, confirmed, or packed (not reached shipped)
  const canCancel = order.status === 'placed' || order.status === 'confirmed' || order.status === 'packed';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Back to Orders */}
      <Link
        to="/orders"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-onam-green hover:text-onam-gold transition-colors font-sans"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Order History
      </Link>

      {/* Main Details Panel */}
      <div className="bg-white border border-onam-gold/20 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-onam-gold/15 pb-6">
          <div className="space-y-1">
            <span className="text-[10px] text-onam-charcoal/50 uppercase tracking-widest font-sans font-semibold">Festive Dispatch Detail</span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-onam-green">
              Order ID: <span className="text-onam-gold-dark">{order.id}</span>
            </h2>
            <div className="flex items-center gap-2 text-xs text-onam-charcoal/60 font-sans pt-0.5">
              <Calendar className="w-3.5 h-3.5 text-onam-gold" />
              Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>

          {/* Cancel button action */}
          {canCancel && (
            <button
              onClick={() => setIsCancelModalOpen(true)}
              className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <XSquare className="w-4 h-4" /> Cancel Order
            </button>
          )}
        </div>

        {/* Visual Timeline Tracker */}
        <div className="bg-onam-cream-dark/20 border border-onam-gold/10 p-6 rounded-2xl">
          <h3 className="font-serif font-bold text-sm text-onam-green mb-6 border-b border-onam-gold/10 pb-2">
            Shipment Tracking Timeline
          </h3>
          <OrderStatus status={order.status} />
        </div>

        {/* Shipping & Payment Grid Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Shipping Address */}
          <div className="border border-onam-gold/15 rounded-2xl p-5 space-y-4">
            <h3 className="font-serif font-bold text-sm text-onam-green border-b border-onam-gold/10 pb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-onam-gold" /> Shipping Address
            </h3>
            <div className="text-xs font-sans space-y-2 leading-relaxed text-onam-charcoal/80">
              <div className="flex items-center gap-2 font-bold text-onam-green">
                <User className="w-3.5 h-3.5 text-onam-gold-dark" />
                {order.customer_name}
              </div>
              <div className="pl-5">
                {order.customer_address}<br />
                {order.customer_city} - {order.customer_pincode}
              </div>
              <div className="flex items-center gap-2 pl-5 pt-1 text-[11px]">
                <Phone className="w-3.5 h-3.5 text-onam-gold-dark" />
                Ph: {order.customer_phone}
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="border border-onam-gold/15 rounded-2xl p-5 space-y-4">
            <h3 className="font-serif font-bold text-sm text-onam-green border-b border-onam-gold/10 pb-2 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-onam-gold" /> Payment Summary
            </h3>
            
            <div className="space-y-3.5 text-xs font-sans">
              <div className="flex justify-between">
                <span className="text-onam-charcoal/60">Method of Payment</span>
                <span className="font-bold text-onam-green uppercase">
                  {order.payment_method === 'cod' ? 'Cash on Delivery' : 'UPI / Online Payment'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-onam-charcoal/60">Shipping Fee</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>

              <hr className="border-onam-gold/10" />

              <div className="flex justify-between text-sm font-bold text-onam-green font-serif">
                <span>Total Amount Paid</span>
                <span>₹{order.total_amount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Itemized Table purchased */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-sm text-onam-green border-b border-onam-gold/15 pb-2">
            Items in Shipment
          </h3>

          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center gap-4 bg-onam-cream-dark/15 border border-onam-gold/10 p-4 rounded-xl text-xs font-sans"
              >
                <img
                  src={item.image_url}
                  alt={item.product_name}
                  className="w-12 h-12 object-cover rounded-lg border border-onam-gold/15 shrink-0 bg-white"
                />

                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <span className="font-semibold text-onam-green text-sm block truncate">
                    {item.product_name}
                  </span>
                  <span className="text-[10px] text-onam-charcoal/50 mt-0.5 block">
                    Seller: <strong className="font-medium text-onam-green/80">{item.seller_id}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-12 shrink-0">
                  <div className="text-center">
                    <span className="text-onam-charcoal/50 block text-[9px]">Price</span>
                    <span className="font-semibold text-onam-green">₹{item.price}</span>
                  </div>

                  <div className="text-center">
                    <span className="text-onam-charcoal/50 block text-[9px]">Quantity</span>
                    <span className="font-bold text-onam-green">x{item.quantity}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-onam-charcoal/50 block text-[9px]">Subtotal</span>
                    <span className="font-serif font-bold text-sm text-onam-green">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Cancellation Confirmation Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Confirm Cancellation"
      >
        <div className="space-y-4">
          <div className="flex gap-3 text-rose-700 bg-rose-50 border border-rose-100 p-3.5 rounded-xl text-xs leading-relaxed font-sans">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>
              Are you sure you want to cancel this order? This action is irreversible. The seller will be notified immediately and the items will be returned to stock.
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsCancelModalOpen(false)}
              className="px-4 py-2 border border-onam-gold/40 text-onam-green rounded-xl text-xs font-bold font-sans cursor-pointer hover:bg-onam-cream-dark/20"
            >
              No, Keep Order
            </button>
            <button
              onClick={handleCancelOrder}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold font-sans cursor-pointer shadow"
            >
              Yes, Cancel Order
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
export default OrderDetail;
