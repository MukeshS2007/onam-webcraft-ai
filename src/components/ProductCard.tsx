import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ArrowRight } from 'lucide-react';
import { Product } from '../data/mockProducts';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useApp();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    navigate('/cart');
  };

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  // Star Renderer
  const renderStars = (rating: number) => {
    const stars = [];
    const floorRating = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= floorRating
              ? 'text-onam-gold fill-onam-gold'
              : 'text-gray-300'
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="group bg-white border border-onam-gold/20 hover:border-onam-gold rounded-2xl overflow-hidden shadow-sm hover:shadow-md gold-glow-hover transition-all duration-300 flex flex-col h-full relative hover:-translate-y-1">
      
      {/* Product Image */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-[4/3] bg-onam-cream-dark/40 border-b border-onam-gold/10">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-rose-600 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow">
              Out of Stock
            </span>
          </div>
        )}
        {/* Category Badge */}
        {!isOutOfStock && (
          <span className="absolute top-3 left-3 bg-onam-green text-onam-cream text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border border-onam-gold/30 shadow-sm">
            {product.category}
          </span>
        )}
      </Link>

      {/* Product Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Seller Info */}
        <span className="text-[11px] text-onam-charcoal/60 font-sans tracking-wide mb-1">
          Sold by: <span className="font-semibold text-onam-green/80">{product.seller_name}</span>
        </span>

        {/* Title */}
        <Link to={`/product/${product.id}`} className="block group-hover:text-onam-green-light transition-colors">
          <h3 className="font-serif font-bold text-base text-onam-green line-clamp-1 mb-1 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3.5">
          <div className="flex">{renderStars(product.rating)}</div>
          <span className="text-xs text-onam-charcoal/60 font-sans mt-0.5">
            ({product.reviews_count})
          </span>
        </div>

        {/* Price & Stock Indicator */}
        <div className="mt-auto pt-2 flex items-center justify-between gap-2 border-t border-onam-gold/10">
          <div>
            <span className="text-xs text-onam-charcoal/50 block font-light">Price</span>
            <span className="font-serif font-bold text-lg text-onam-green">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="text-right">
            {isOutOfStock ? (
              <span className="text-xs font-semibold text-rose-500 font-sans">
                Unavailable
              </span>
            ) : isLowStock ? (
              <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 animate-pulse font-sans">
                Only {product.stock} left
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-sans">
                In Stock
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 mt-4">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-2 px-2.5 rounded-xl border text-xs font-bold font-sans flex items-center justify-center gap-1.5 transition-all ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-onam-cream-dark/40 text-onam-green border-onam-gold/40 hover:bg-onam-green hover:text-onam-cream hover:border-onam-green-dark cursor-pointer'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add
          </button>
          
          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className={`w-full py-2 px-2.5 rounded-xl text-xs font-bold font-sans flex items-center justify-center gap-1 shadow-sm transition-all ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-onam-green text-onam-cream border border-onam-green-dark hover:bg-onam-green-light hover:scale-[1.01] hover:translate-y-[-1px] cursor-pointer'
            }`}
          >
            Buy Now
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
