import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, ArrowRight, ShieldCheck, Truck, Sparkles, MessageSquare } from 'lucide-react';
import { productService } from '../services/productService';
import { Product } from '../data/mockProducts';
import { useApp } from '../context/AppContext';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      // 1. Try to load match from local cache instantly
      const cached = localStorage.getItem('onam_products_cache');
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as Product[];
          const matched = parsed.find(p => p.id === id);
          if (matched) {
            setProduct(matched);
            setLoading(false);
          }
        } catch (e) {}
      }

      // 2. Fetch fresh details from Supabase in the background
      try {
        const found = await productService.getProductById(id);
        if (found) {
          setProduct(found);
          // Also update the item inside onam_products_cache
          if (cached) {
            try {
              const parsed = JSON.parse(cached) as Product[];
              const index = parsed.findIndex(p => p.id === id);
              if (index > -1) {
                parsed[index] = found;
              } else {
                parsed.push(found);
              }
              localStorage.setItem('onam_products_cache', JSON.stringify(parsed));
            } catch (e) {}
          }
        }
      } catch (e) {
        console.error("Failed to load product details", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleIncrement = () => {
    if (!product) return;
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigate('/cart');
  };

  // Render Rating Stars
  const renderStars = (rating: number) => {
    const stars = [];
    const floorRating = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= floorRating ? 'text-onam-gold fill-onam-gold' : 'text-gray-300'
          }`}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto animate-pulse py-6">
        <div className="h-6 bg-onam-cream-dark w-1/4 rounded" />
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 bg-onam-cream-dark h-80 rounded-2xl" />
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-onam-cream-dark rounded w-3/4" />
            <div className="h-4 bg-onam-cream-dark rounded w-1/3" />
            <div className="h-20 bg-onam-cream-dark rounded w-full" />
            <div className="h-10 bg-onam-cream-dark rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-16 max-w-md mx-auto space-y-4 bg-white border border-onam-gold/25 rounded-3xl p-8 shadow-sm">
        <span className="text-5xl">🌾</span>
        <h3 className="font-serif font-bold text-xl text-onam-green">Product Not Found</h3>
        <p className="text-sm text-onam-charcoal/60 font-sans">
          The product you are looking for does not exist or has been removed.
        </p>
        <Link
          to="/products"
          className="bg-onam-green hover:bg-onam-green-light text-onam-cream text-xs font-bold px-6 py-2.5 rounded-full inline-flex items-center gap-1.5 transition-all shadow"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Back Button */}
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-onam-green hover:text-onam-gold transition-colors font-sans"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Collection
      </Link>

      {/* Product Display Details */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 bg-white border border-onam-gold/20 rounded-3xl p-6 sm:p-8 shadow-sm">
        
        {/* Product Image Frame */}
        <div className="flex-1 w-full relative aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden shadow-inner border border-onam-gold/15 bg-onam-cream-dark/20 max-w-xl mx-auto">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
              <span className="bg-rose-600 text-white text-sm font-bold uppercase tracking-wider px-5 py-2 rounded-full shadow">
                Out of Stock
              </span>
            </div>
          )}
          {!isOutOfStock && (
            <span className="absolute top-4 left-4 bg-onam-green text-onam-cream text-xs font-semibold uppercase tracking-wider px-3.5 py-1 rounded-full border border-onam-gold/30 shadow">
              {product.category}
            </span>
          )}
        </div>

        {/* Product Customizer Info */}
        <div className="flex-1 flex flex-col justify-between">
          
          <div className="space-y-4">
            {/* Seller Label */}
            <span className="text-xs text-onam-charcoal/60 font-sans tracking-wide block">
              Sourced from: <strong className="text-onam-green font-semibold">{product.seller_name}</strong>
            </span>

            {/* Title */}
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-onam-green leading-snug">
              {product.name}
            </h2>

            {/* Ratings & Reviews */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {renderStars(product.rating)}
                <span className="text-sm font-bold text-onam-charcoal text-sans ml-1">{product.rating}</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-xs text-onam-charcoal/60 flex items-center gap-1 font-sans">
                <MessageSquare className="w-3.5 h-3.5 text-onam-gold-dark" />
                {product.reviews_count} Verified Customer Reviews
              </span>
            </div>

            {/* Price Frame */}
            <div className="py-3 px-4 bg-onam-cream-dark/30 border border-onam-gold/15 rounded-xl w-fit flex items-baseline gap-2">
              <span className="text-xs text-onam-charcoal/50 block font-light">Price:</span>
              <span className="font-serif font-extrabold text-2xl text-onam-green">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wide">
                Inclusive of GST
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-onam-charcoal/80 leading-relaxed font-sans font-light">
              {product.description}
            </p>
          </div>

          <div className="space-y-6 pt-6 mt-6 border-t border-onam-gold/15">
            {/* Quantity Selector & Stock Info */}
            {!isOutOfStock && (
              <div className="flex items-center gap-6 flex-wrap">
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-onam-charcoal/70 uppercase tracking-wide block">Quantity</span>
                  <div className="flex items-center border border-onam-gold/45 rounded-xl bg-onam-cream">
                    <button
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      className="px-3.5 py-1.5 text-onam-green hover:bg-onam-cream-dark disabled:opacity-30 disabled:hover:bg-transparent rounded-l-xl font-bold font-sans transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-sm font-bold text-onam-green min-w-[32px] text-center font-sans">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      disabled={quantity >= product.stock}
                      className="px-3.5 py-1.5 text-onam-green hover:bg-onam-cream-dark disabled:opacity-30 disabled:hover:bg-transparent rounded-r-xl font-bold font-sans transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="pt-5">
                  {isLowStock ? (
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 animate-pulse font-sans">
                      Low stock: Only {product.stock} items left!
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 font-sans">
                      {product.stock} pieces in stock ready to ship
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Estimate Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="flex items-start gap-2.5 p-3.5 bg-onam-cream-dark/20 border border-onam-gold/10 rounded-xl">
                <Truck className="w-5 h-5 text-onam-gold-dark shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-onam-green">Express Festive Delivery</h4>
                  <p className="text-[10px] text-onam-charcoal/60 mt-0.5 leading-relaxed font-sans">
                    Guaranteed delivery within 3-4 working days in South India, 4-6 days rest of India.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2.5 p-3.5 bg-onam-cream-dark/20 border border-onam-gold/10 rounded-xl">
                <Sparkles className="w-5 h-5 text-onam-gold-dark shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-onam-green">100% Traditional Handiwork</h4>
                  <p className="text-[10px] text-onam-charcoal/60 mt-0.5 leading-relaxed font-sans">
                    Each product is sourced directly from village artisans and hand-verified for heritage authenticity.
                  </p>
                </div>
              </div>
            </div>

            {/* Buy / Cart Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-3 px-6 rounded-xl font-bold font-sans flex items-center justify-center gap-2 border shadow-sm transition-all ${
                  isOutOfStock
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-onam-cream-dark/40 text-onam-green border-onam-gold/45 hover:bg-onam-green hover:text-onam-cream hover:border-onam-green-dark cursor-pointer text-sm'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`flex-1 py-3 px-6 rounded-xl font-bold font-sans flex items-center justify-center gap-2 shadow-md transition-all ${
                  isOutOfStock
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-onam-green text-onam-cream border border-onam-green-dark hover:bg-onam-green-light hover:scale-[1.01] hover:translate-y-[-1px] cursor-pointer text-sm'
                }`}
              >
                Buy Now
                <ArrowRight className="w-4 h-4 text-onam-gold" />
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* 4. Local Seller Spotlight Info Box */}
      <section className="bg-onam-green text-onam-cream rounded-3xl p-6 sm:p-8 border border-onam-gold/25 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-onam-gold flex items-center justify-center text-onam-green text-3xl shrink-0 shadow">
          👩🏽‍🌾
        </div>
        <div className="space-y-1">
          <h3 className="font-serif font-bold text-lg text-onam-gold">
            About the Seller: {product.seller_name}
          </h3>
          <p className="text-xs text-onam-cream-dark/80 leading-relaxed font-sans font-light">
            Located in traditional craft clusters in Kerala, this workshop supports over 25 artisan families. By selecting this item, you support ancient weaving, casting, or farming traditions directly.
          </p>
        </div>
      </section>

    </div>
  );
};
export default ProductDetail;
