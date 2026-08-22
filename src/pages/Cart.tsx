import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Cart: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, cartTotal, cartCount } = useApp();
  const navigate = useNavigate();

  // Shipping logic: Free shipping over ₹1000, else ₹50
  const shippingThreshold = 1000;
  const shippingCharge = cartTotal >= shippingThreshold || cartTotal === 0 ? 0 : 50;
  const grandTotal = cartTotal + shippingCharge;

  const freeShippingProgress = Math.min((cartTotal / shippingThreshold) * 100, 100);
  const remainingForFreeShipping = shippingThreshold - cartTotal;

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-6 bg-white border border-onam-gold/25 rounded-3xl p-8 shadow-sm">
        <span className="text-6xl block">🧺</span>
        <h2 className="font-serif text-2xl font-bold text-onam-green mt-4">Your Cart is Empty</h2>
        <p className="text-sm text-onam-charcoal/60 font-sans mt-2 mb-6">
          Looks like you haven't added any traditional Onam products to your cart yet.
        </p>
        <button
          onClick={() => navigate('/products')}
          className="bg-onam-green hover:bg-onam-green-light text-onam-cream font-bold px-6 py-3 rounded-full flex items-center justify-center gap-2 mx-auto shadow transition-all hover:scale-[1.02]"
        >
          <ShoppingBag className="w-4 h-4 text-onam-gold" />
          Shop the Collection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b border-onam-gold/20 pb-4">
        <h2 className="font-serif text-3xl font-bold text-onam-green">Shopping Cart</h2>
        <p className="text-sm text-onam-charcoal/60 font-light mt-1">
          Review your basket of {cartCount} festive items before checkout
        </p>
      </div>

      {/* Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Cart Items List (Left Column) */}
        <div className="flex-1 space-y-4">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="flex flex-col sm:flex-row items-center gap-4 bg-white border border-onam-gold/20 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative"
            >
              {/* Product Thumbnail */}
              <Link
                to={`/product/${item.product.id}`}
                className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-onam-gold/15 bg-onam-cream-dark/20 aspect-square"
              >
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </Link>

              {/* Title & Seller details */}
              <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
                <Link
                  to={`/product/${item.product.id}`}
                  className="font-serif font-bold text-base text-onam-green hover:underline hover:text-onam-green-light transition-colors line-clamp-1 block"
                >
                  {item.product.name}
                </Link>
                
                <span className="text-[11px] text-onam-charcoal/50 block font-sans">
                  Sourced from: <strong className="text-onam-green/80 font-medium">{item.product.seller_name}</strong>
                </span>

                <span className="text-xs font-bold text-onam-green block font-serif">
                  ₹{item.product.price} <span className="text-[10px] text-onam-charcoal/40 font-sans font-light">each</span>
                </span>
              </div>

              {/* Quantity Selector controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-onam-gold/30 rounded-xl bg-onam-cream">
                  <button
                    onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                    className="px-2.5 py-1 text-onam-green hover:bg-onam-cream-dark rounded-l-xl font-bold font-sans transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-onam-green min-w-[28px] text-center font-sans">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                    className="px-2.5 py-1 text-onam-green hover:bg-onam-cream-dark disabled:opacity-30 rounded-r-xl font-bold font-sans transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Remove Item"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Item Total Price */}
              <div className="text-right sm:pl-4 shrink-0">
                <span className="text-[10px] text-onam-charcoal/40 block font-sans">Subtotal</span>
                <span className="font-serif font-bold text-sm text-onam-green">
                  ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>

            </div>
          ))}

          {/* Quick Shop Action */}
          <Link
            to="/products"
            className="inline-flex items-center gap-1 text-xs font-bold text-onam-green hover:text-onam-gold hover:underline transition-colors font-sans pt-2"
          >
            <ArrowLeft className="w-4 h-4" /> Add more products
          </Link>
        </div>

        {/* Order Receipt Card Summary (Right Column) */}
        <div className="w-full lg:w-96 space-y-4 shrink-0">
          
          {/* Free Shipping Alert banner */}
          {cartTotal < shippingThreshold && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs font-sans text-amber-950 space-y-2.5">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-onam-gold-dark shrink-0 mt-0.5" />
                <span>
                  Add <strong className="text-onam-green">₹{remainingForFreeShipping}</strong> more to qualify for <strong>FREE Delivery</strong>!
                </span>
              </div>
              <div className="w-full bg-amber-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-onam-gold h-full rounded-full transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {cartTotal >= shippingThreshold && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs font-sans text-emerald-950 flex items-center gap-2">
              <span className="text-base">🎉</span>
              <span>Congratulations! Your order qualifies for <strong>FREE Shipping</strong>.</span>
            </div>
          )}

          {/* Receipt details */}
          <div className="bg-white border border-onam-gold/25 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="font-serif font-bold text-lg text-onam-green border-b border-onam-gold/15 pb-2.5">
              Price Details
            </h3>

            <div className="space-y-3 font-sans text-xs">
              <div className="flex justify-between text-onam-charcoal/80">
                <span>Items Subtotal ({cartCount} units)</span>
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

              <div className="flex justify-between text-base font-serif font-bold text-onam-green pt-1">
                <span>Order Total</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-onam-green hover:bg-onam-green-light text-onam-cream font-bold py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] transition-all cursor-pointer text-sm"
            >
              Proceed to Secure Checkout
              <ArrowRight className="w-4 h-4 text-onam-gold" />
            </button>
          </div>

          <div className="text-center text-[10px] text-onam-charcoal/50 leading-relaxed font-sans px-4">
            Secured demo checkout. Orders placed are simulated and fulfilled via local store mock adapters.
          </div>

        </div>

      </div>

    </div>
  );
};
export default Cart;
