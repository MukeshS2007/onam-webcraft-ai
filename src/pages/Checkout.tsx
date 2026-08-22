import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ShoppingBag, ShieldCheck, CreditCard, Banknote } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { dbService, Order } from '../services/db';

export const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart, user, addToast } = useApp();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Sync profile details if logged in
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        pincode: user.pincode || ''
      });
    }
  }, [user]);

  // Shipping math
  const shippingThreshold = 1000;
  const shippingCharge = cartTotal >= shippingThreshold ? 0 : 50;
  const grandTotal = cartTotal + shippingCharge;

  // Protect route
  useEffect(() => {
    if (cart.length === 0 && !placedOrder) {
      navigate('/cart');
    }
  }, [cart, placedOrder, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      addToast("Please fill in all shipping details", "error");
      return;
    }

    if (formData.phone.length < 10) {
      addToast("Please enter a valid 10-digit phone number", "error");
      return;
    }

    if (formData.pincode.length !== 6) {
      addToast("Please enter a valid 6-digit Indian PIN code", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      // Map to dbService inputs
      const orderInputs = {
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_address: formData.address,
        customer_city: formData.city,
        customer_pincode: formData.pincode,
        payment_method: paymentMethod
      };

      const newOrder = await dbService.createOrder(orderInputs, cart);
      
      // Store locally to render success screen
      setPlacedOrder(newOrder);
      clearCart();
      addToast("Order placed successfully!", "success");
    } catch (err: any) {
      console.error(err);
      const msg = err.message || "Failed to place order. Please try again.";
      addToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (placedOrder) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
        <div className="bg-white border border-onam-gold/25 rounded-3xl p-8 sm:p-12 text-center shadow-lg space-y-8 animate-in zoom-in-95 duration-300">
          
          {/* Success Checkmark overlay */}
          <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-500 shadow-md">
            <CheckCircle className="w-12 h-12 text-emerald-600 fill-emerald-50" />
          </div>

          <div className="space-y-3">
            <span className="text-sm font-bold uppercase tracking-widest text-onam-gold-dark font-sans">Artisans Notified</span>
            <h2 className="font-serif text-3xl font-extrabold text-onam-green">
              Order Placed Successfully!
            </h2>
            <p className="text-sm text-onam-charcoal/70 max-w-md mx-auto font-sans leading-relaxed">
              Thank you for shopping at the **Onam Village Store**. Your purchase directly supports rural Kerala weavers, snack makers, and brass artisans.
            </p>
          </div>

          {/* Order Snapshot details */}
          <div className="bg-onam-cream-dark/30 border border-onam-gold/15 rounded-2xl p-6 text-left space-y-4 text-xs font-sans max-w-lg mx-auto">
            <div className="grid grid-cols-2 gap-4 border-b border-onam-gold/10 pb-3">
              <div>
                <span className="text-onam-charcoal/50 block">Order Reference ID</span>
                <span className="font-bold text-onam-green text-sm">{placedOrder.id}</span>
              </div>
              <div className="text-right">
                <span className="text-onam-charcoal/50 block">Amount Paid ({placedOrder.payment_method === 'cod' ? 'COD' : 'UPI'})</span>
                <span className="font-bold text-onam-green text-sm">₹{placedOrder.total_amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div>
              <span className="text-onam-charcoal/50 block">Shipment Delivery Address</span>
              <span className="font-semibold text-onam-charcoal mt-1 block">
                {placedOrder.customer_name}<br />
                {placedOrder.customer_address}, {placedOrder.customer_city} - {placedOrder.customer_pincode}<br />
                Ph: {placedOrder.customer_phone}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(`/orders/${placedOrder.id}`)}
              className="bg-onam-green hover:bg-onam-green-light text-onam-cream font-bold px-8 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              Track Order Status
              <ShieldCheck className="w-4 h-4 text-onam-gold" />
            </button>
            <button
              onClick={() => navigate('/products')}
              className="border-2 border-onam-gold-dark text-onam-green font-bold px-8 py-3.5 rounded-xl hover:bg-onam-gold hover:text-onam-green transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              Continue Shopping
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Back button */}
      <Link
        to="/cart"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-onam-green hover:text-onam-gold transition-colors font-sans"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>

      <div className="border-b border-onam-gold/20 pb-4">
        <h2 className="font-serif text-3xl font-bold text-onam-green">Secure Checkout</h2>
        <p className="text-sm text-onam-charcoal/60 font-light mt-1">
          Provide your shipment details and select payment preference
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
        
        {/* Shipping Form Panel (Left Column) */}
        <div className="flex-1 bg-white border border-onam-gold/20 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
          
          <h3 className="font-serif font-bold text-lg text-onam-green border-b border-onam-gold/15 pb-2.5">
            Shipping Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Customer Name */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-onam-charcoal/70 uppercase tracking-wide block">Full Name</label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Anjali Nair"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-onam-cream-dark/30 text-sm px-4 py-2.5 rounded-xl border border-onam-gold/25 focus:outline-none focus:ring-1 focus:ring-onam-green"
              />
            </div>

            {/* Customer Phone */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-onam-charcoal/70 uppercase tracking-wide block">Contact Phone Number</label>
              <input
                type="tel"
                name="phone"
                required
                maxLength={10}
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-onam-cream-dark/30 text-sm px-4 py-2.5 rounded-xl border border-onam-gold/25 focus:outline-none focus:ring-1 focus:ring-onam-green"
              />
            </div>

            {/* Address */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-onam-charcoal/70 uppercase tracking-wide block">Street Address</label>
              <textarea
                name="address"
                required
                rows={3}
                placeholder="House No, Street Name, Locality details..."
                value={formData.address}
                onChange={handleInputChange}
                className="w-full bg-onam-cream-dark/30 text-sm px-4 py-2.5 rounded-xl border border-onam-gold/25 focus:outline-none focus:ring-1 focus:ring-onam-green resize-none"
              />
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-onam-charcoal/70 uppercase tracking-wide block">Town / City</label>
              <input
                type="text"
                name="city"
                required
                placeholder="e.g. Kochi"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full bg-onam-cream-dark/30 text-sm px-4 py-2.5 rounded-xl border border-onam-gold/25 focus:outline-none focus:ring-1 focus:ring-onam-green"
              />
            </div>

            {/* Pincode */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-onam-charcoal/70 uppercase tracking-wide block">PIN Code (6 Digits)</label>
              <input
                type="text"
                name="pincode"
                required
                maxLength={6}
                placeholder="e.g. 682030"
                value={formData.pincode}
                onChange={handleInputChange}
                className="w-full bg-onam-cream-dark/30 text-sm px-4 py-2.5 rounded-xl border border-onam-gold/25 focus:outline-none focus:ring-1 focus:ring-onam-green"
              />
            </div>

          </div>

          {/* Payment Method Selector */}
          <div className="pt-4 border-t border-onam-gold/15 space-y-3">
            <h3 className="font-serif font-bold text-lg text-onam-green">
              Select Payment Method
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* UPI Online option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`flex items-center gap-3 p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  paymentMethod === 'upi'
                    ? 'bg-onam-green text-onam-cream border-onam-green-dark shadow-sm'
                    : 'bg-onam-cream-dark/20 text-onam-charcoal border-onam-gold/25 hover:bg-onam-cream-dark/30'
                }`}
              >
                <CreditCard className={`w-6 h-6 ${paymentMethod === 'upi' ? 'text-onam-gold' : 'text-onam-green'}`} />
                <div>
                  <h4 className="text-xs font-bold font-sans">UPI / Online Payment</h4>
                  <p className={`text-[10px] mt-0.5 font-light font-sans ${paymentMethod === 'upi' ? 'text-onam-cream-dark/80' : 'text-onam-charcoal/60'}`}>
                    Simulated netbanking sandbox.
                  </p>
                </div>
              </button>

              {/* COD option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`flex items-center gap-3 p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'bg-onam-green text-onam-cream border-onam-green-dark shadow-sm'
                    : 'bg-onam-cream-dark/20 text-onam-charcoal border-onam-gold/25 hover:bg-onam-cream-dark/30'
                }`}
              >
                <Banknote className={`w-6 h-6 ${paymentMethod === 'cod' ? 'text-onam-gold' : 'text-onam-green'}`} />
                <div>
                  <h4 className="text-xs font-bold font-sans">Cash on Delivery (COD)</h4>
                  <p className={`text-[10px] mt-0.5 font-light font-sans ${paymentMethod === 'cod' ? 'text-onam-cream-dark/80' : 'text-onam-charcoal/60'}`}>
                    Pay in cash upon arrival.
                  </p>
                </div>
              </button>

            </div>
          </div>

        </div>

        {/* Cart Review Summary (Right Column) */}
        <div className="w-full lg:w-96 shrink-0 space-y-4">
          <div className="bg-white border border-onam-gold/25 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="font-serif font-bold text-lg text-onam-green border-b border-onam-gold/15 pb-2.5">
              Order Summary
            </h3>

            {/* Items scroll block */}
            <div className="space-y-3.5 max-h-56 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded-lg border border-onam-gold/15 shrink-0 bg-onam-cream-dark/10"
                  />
                  <div className="flex-1 min-w-0 font-sans">
                    <span className="font-semibold text-onam-green block truncate">{item.product.name}</span>
                    <span className="text-[10px] text-onam-charcoal/60 block mt-0.5">
                      Qty: {item.quantity} &middot; ₹{item.product.price}
                    </span>
                  </div>
                  <span className="font-serif font-semibold text-onam-green shrink-0">
                    ₹{item.product.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals panel */}
            <div className="space-y-3 font-sans text-xs border-t border-onam-gold/15 pt-4">
              <div className="flex justify-between text-onam-charcoal/80">
                <span>Items Subtotal</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-onam-charcoal/80">
                <span>Festive Delivery Charge</span>
                {shippingCharge === 0 ? (
                  <span className="text-emerald-600 font-bold">FREE</span>
                ) : (
                  <span>₹{shippingCharge}</span>
                )}
              </div>
              
              <hr className="border-onam-gold/15" />

              <div className="flex justify-between text-base font-serif font-bold text-onam-green">
                <span>Grand Total</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-onam-green hover:bg-onam-green-light disabled:bg-gray-400 text-onam-cream font-bold py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] transition-all cursor-pointer text-sm"
            >
              {isSubmitting ? (
                <span>Securing Order...</span>
              ) : (
                <>
                  Place Order (₹{grandTotal.toLocaleString('en-IN')})
                  <ShieldCheck className="w-4 h-4 text-onam-gold" />
                </>
              )}
            </button>
          </div>

          <div className="text-center text-[10px] text-onam-charcoal/50 leading-relaxed font-sans px-4">
            Security sandbox. Online payments are simulated immediately without real charges.
          </div>
        </div>

      </form>

    </div>
  );
};
export default Checkout;
