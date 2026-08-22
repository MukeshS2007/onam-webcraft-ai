import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ArrowUpDown, RefreshCw, X } from 'lucide-react';
import { productService } from '../services/productService';
import { Product, CATEGORIES } from '../data/mockProducts';
import { ProductCard } from '../components/ProductCard';

export const ProductList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState(3000);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState('rating-desc');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch all products once on mount
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const all = await productService.getProducts();
        setProducts(all);
      } catch (e) {
        console.error("Failed to load products", e);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Sync filter states with URL params
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const cat = searchParams.get('category') || '';
    setSearchQuery(search);
    setSelectedCategory(cat);
  }, [searchParams]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.seller_name.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Price filter
    result = result.filter(p => p.price <= maxPrice);

    // Stock filter
    if (onlyInStock) {
      result = result.filter(p => p.stock > 0);
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      default:
        result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(result);
  }, [products, searchQuery, selectedCategory, maxPrice, onlyInStock, sortBy]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setMaxPrice(3000);
    setOnlyInStock(false);
    setSortBy('rating-desc');
    setSearchParams({});
    setShowMobileFilters(false);
  };

  const categoriesList = ["", ...CATEGORIES];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-onam-gold/20 pb-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-onam-green">
            {selectedCategory ? `${selectedCategory} Collection` : 'All Onam Essentials'}
          </h2>
          <p className="text-sm text-onam-charcoal/60 font-light mt-1">
            Showing {filteredProducts.length} unique traditional items
          </p>
        </div>

        {/* Top Control Bar */}
        <div className="flex items-center gap-2.5 self-end md:self-auto">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden flex items-center gap-1.5 bg-onam-cream-dark text-onam-green border border-onam-gold/30 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-onam-gold-dark" />
            Filters
          </button>

          {/* Sorter Selector */}
          <div className="flex items-center gap-2 bg-onam-cream-dark/50 border border-onam-gold/35 rounded-xl px-3 py-2 text-xs font-bold text-onam-green">
            <ArrowUpDown className="w-3.5 h-3.5 text-onam-gold-dark" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none outline-none cursor-pointer"
            >
              <option value="rating-desc">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>

          <button
            onClick={handleResetFilters}
            className="p-2 bg-onam-cream-dark/50 hover:bg-onam-cream-dark rounded-xl border border-onam-gold/20 hover:text-rose-600 transition-colors"
            title="Reset Filters"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Catalog Area */}
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden md:block w-64 bg-white border border-onam-gold/20 rounded-2xl p-6 shadow-sm shrink-0 h-fit space-y-6">
          <div className="flex items-center justify-between border-b border-onam-gold/15 pb-3">
            <span className="font-serif font-bold text-onam-green flex items-center gap-2">
              <Filter className="w-4 h-4 text-onam-gold" /> Filter Collection
            </span>
            <button
              onClick={handleResetFilters}
              className="text-[10px] uppercase font-bold text-onam-gold-dark hover:underline"
            >
              Clear All
            </button>
          </div>

          {/* Search Query */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-onam-charcoal/70 uppercase tracking-wide block">Search Keyword</label>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-onam-cream-dark/50 text-sm px-3.5 py-2 rounded-xl border border-onam-gold/20 focus:outline-none focus:ring-1 focus:ring-onam-green"
            />
          </div>

          {/* Category List */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-onam-charcoal/70 uppercase tracking-wide block">Category</label>
            <div className="flex flex-col gap-1.5">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left text-xs px-3 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-onam-green text-onam-cream border-l-4 border-onam-gold'
                      : 'text-onam-charcoal/80 hover:bg-onam-cream-dark/50'
                  }`}
                >
                  {cat || "All Categories"}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-onam-charcoal/70 uppercase tracking-wide">Max Price</label>
              <span className="text-xs font-bold text-onam-green font-serif">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min="200"
              max="3000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-onam-green bg-onam-cream-dark h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-onam-charcoal/50">
              <span>₹200</span>
              <span>₹3,000</span>
            </div>
          </div>

          {/* Stock Filter Toggle */}
          <div className="flex items-center gap-2 pt-2 border-t border-onam-gold/10">
            <input
              type="checkbox"
              id="inStockOnly"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="w-4 h-4 accent-onam-green rounded cursor-pointer"
            />
            <label htmlFor="inStockOnly" className="text-xs font-semibold text-onam-charcoal/80 cursor-pointer">
              Show In-Stock Only
            </label>
          </div>
        </aside>

        {/* Mobile Filters Dropdown */}
        {showMobileFilters && (
          <div className="md:hidden bg-white border border-onam-gold/20 rounded-2xl p-5 space-y-4 shadow-sm w-full animate-in fade-in slide-in-from-top-3">
            <div className="flex items-center justify-between border-b border-onam-gold/15 pb-2">
              <span className="font-serif font-bold text-sm text-onam-green">Refine Selection</span>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Keyword Search */}
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-onam-cream-dark/50 text-sm px-3.5 py-2 rounded-xl border border-onam-gold/20"
            />

            {/* Category Select */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-onam-charcoal/60">Select Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-onam-cream-dark/50 text-sm px-3.5 py-2.5 rounded-xl border border-onam-gold/20 outline-none"
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat || "All Categories"}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-onam-charcoal/60">Max Price</span>
                <span className="font-bold text-onam-green">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="200"
                max="3000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-onam-green bg-onam-cream-dark h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Stock checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="mobInStockOnly"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 accent-onam-green rounded"
              />
              <label htmlFor="mobInStockOnly" className="text-xs font-semibold text-onam-charcoal/80">
                In-Stock Only
              </label>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={handleResetFilters}
                className="py-2.5 rounded-xl border border-onam-gold/30 text-xs font-bold text-onam-green bg-onam-cream-dark/20"
              >
                Reset All
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="py-2.5 rounded-xl bg-onam-green text-onam-cream text-xs font-bold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Product Catalog Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="bg-white border border-onam-gold/15 rounded-2xl p-4 space-y-4 animate-pulse">
                  <div className="bg-onam-cream-dark h-44 rounded-xl w-full" />
                  <div className="h-4 bg-onam-cream-dark rounded w-2/3" />
                  <div className="h-3 bg-onam-cream-dark rounded w-1/3" />
                  <div className="h-8 bg-onam-cream-dark rounded w-full mt-4" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white border border-onam-gold/15 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 shadow-sm mt-8">
              <span className="text-5xl block">🌾</span>
              <h3 className="font-serif font-bold text-xl text-onam-green">No Products Found</h3>
              <p className="text-sm text-onam-charcoal/60 font-sans leading-relaxed">
                We couldn't find any items matching your selected criteria. Try adjusting your price range, search keyword, or reset the filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-onam-green hover:bg-onam-green-light text-onam-cream text-xs font-bold px-6 py-2.5 rounded-full transition-all shadow cursor-pointer inline-block"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
export default ProductList;
