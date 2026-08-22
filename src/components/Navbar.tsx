import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { cartCount, user, switchUserRole, logout } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const isSeller = user?.role === 'seller';

  return (
    <header className="sticky top-0 z-40 bg-onam-cream/90 backdrop-blur-md border-b border-onam-gold/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight shrink-0 group">
            <span className="w-9 h-9 rounded-full bg-onam-green flex items-center justify-center text-onam-gold text-lg border border-onam-gold/30 shadow shadow-onam-green/20 group-hover:scale-105 transition-transform">
              🪔
            </span>
            <span className="font-serif text-onam-green font-extrabold tracking-wide">
              Onam <span className="text-onam-gold font-normal">Village Store</span>
            </span>
          </Link>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
            <input
              type="text"
              placeholder="Search Kasavu sarees, snacks, lamps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-onam-cream-dark/60 text-onam-charcoal placeholder-onam-charcoal/50 text-sm px-4 py-2.5 pl-10 rounded-full border border-onam-gold/30 focus:outline-none focus:ring-2 focus:ring-onam-green/50 focus:border-onam-green transition-all"
            />
            <Search className="w-4 h-4 text-onam-charcoal/60 absolute left-3.5 pointer-events-none" />
            <button type="submit" className="hidden">Search</button>
          </form>

          {/* Actions (Desktop) */}
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/products" className="text-onam-green font-semibold hover:text-onam-gold transition-colors text-sm">
              Browse Collection
            </Link>
            {user?.role === 'customer' && (
              <Link to="/orders" className="text-onam-green font-semibold hover:text-onam-gold transition-colors text-sm">
                Track Orders
              </Link>
            )}

            {/* Quick Demo Switcher */}
            {(!user || user.role === 'seller') && (
              <div className="flex items-center bg-onam-cream-dark rounded-full p-1 border border-onam-gold/20">
                <button
                  onClick={() => switchUserRole('customer')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    !isSeller 
                      ? 'bg-onam-green text-onam-cream shadow-sm' 
                      : 'text-onam-green hover:text-onam-gold'
                  }`}
                >
                  Customer
                </button>
                <button
                  onClick={() => switchUserRole('seller')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                    isSeller 
                      ? 'bg-onam-green text-onam-cream shadow-sm' 
                      : 'text-onam-green hover:text-onam-gold'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3" /> Seller
                </button>
              </div>
            )}

            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2 text-onam-green hover:text-onam-gold transition-colors hover:scale-105">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-onam-gold text-onam-green text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-onam-cream shadow-sm animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account / Dashboard */}
            {isSeller ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/seller"
                  className="bg-onam-green text-onam-cream hover:bg-onam-green-light px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 border border-onam-gold/30 shadow-md shadow-onam-green/10 transition-all hover:translate-y-[-1px]"
                >
                  <ShieldCheck className="w-4 h-4 text-onam-gold" /> Dashboard
                </Link>
                <button
                  onClick={async () => {
                    await logout();
                    navigate('/');
                  }}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold hover:underline cursor-pointer border border-rose-200 hover:border-rose-300 px-3.5 py-2 rounded-full transition-all bg-rose-50/50 font-sans"
                >
                  Sign Out
                </button>
              </div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <span className="border border-onam-green text-onam-green px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1.5">
                  <User className="w-4 h-4" /> {user.name.split(' ')[0]}
                </span>
                <button
                  onClick={async () => {
                    await logout();
                    navigate('/');
                  }}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold hover:underline cursor-pointer border border-rose-200 hover:border-rose-300 px-3.5 py-2 rounded-full transition-all bg-rose-50/50 font-sans"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="border border-onam-green text-onam-green hover:bg-onam-green hover:text-onam-cream px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1.5 transition-all"
              >
                <User className="w-4 h-4" /> Login
              </Link>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex lg:hidden items-center gap-4">
            {/* Quick switcher badge on tablet/mobile */}
            <span className="text-[10px] bg-onam-gold/20 text-onam-green border border-onam-gold/30 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
              {user?.role || 'Guest'}
            </span>

            {/* Mobile Cart */}
            <Link to="/cart" className="relative p-1.5 text-onam-green hover:text-onam-gold transition-colors">
              <ShoppingCart className="w-5.5 h-5.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-onam-gold text-onam-green text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-onam-cream">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-lg text-onam-green hover:bg-onam-cream-dark transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-onam-cream border-b border-onam-gold/20 px-4 pt-2 pb-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          
          {/* Mobile Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-onam-cream-dark text-onam-charcoal placeholder-onam-charcoal/50 text-sm px-4 py-2.5 pl-10 rounded-full border border-onam-gold/20 focus:outline-none focus:ring-1 focus:ring-onam-green focus:border-onam-green"
            />
            <Search className="w-4 h-4 text-onam-charcoal/50 absolute left-3.5 top-3" />
          </form>

          {/* Navigation Links */}
          <div className="grid grid-cols-1 gap-2">
            <Link
              to="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-2 rounded-xl text-onam-green hover:bg-onam-cream-dark font-medium transition-colors"
            >
              Browse Collection
            </Link>
            {user?.role === 'customer' && (
              <Link
                to="/orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2 rounded-xl text-onam-green hover:bg-onam-cream-dark font-medium transition-colors"
              >
                Track Orders
              </Link>
            )}
            {isSeller && (
              <Link
                to="/seller"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2 rounded-xl text-onam-green hover:bg-onam-cream-dark font-semibold flex items-center gap-2 border border-onam-gold/20 bg-onam-gold/10"
              >
                <ShieldCheck className="w-4 h-4 text-onam-gold-dark" /> Seller Dashboard
              </Link>
            )}
          </div>

          <hr className="border-onam-gold/25" />

          {/* Quick Demo Switcher */}
          {(!user || user.role === 'seller') && (
            <div className="px-4">
              <span className="text-xs text-onam-charcoal/60 font-semibold block mb-2">Demo Role:</span>
              <div className="flex items-center bg-onam-cream-dark rounded-full p-1 border border-onam-gold/20 max-w-[240px]">
                <button
                  onClick={() => {
                    switchUserRole('customer');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex-1 text-center py-1.5 rounded-full text-xs font-semibold transition-all ${
                    !isSeller 
                      ? 'bg-onam-green text-onam-cream' 
                      : 'text-onam-green hover:text-onam-gold'
                  }`}
                >
                  Customer
                </button>
                <button
                  onClick={() => {
                    switchUserRole('seller');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex-1 text-center py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isSeller 
                      ? 'bg-onam-green text-onam-cream' 
                      : 'text-onam-green hover:text-onam-gold'
                  }`}
                >
                  Seller
                </button>
              </div>
            </div>
          )}

          {/* Login/Logout Button */}
          <div className="px-4 pt-2">
            {user ? (
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-medium text-onam-charcoal truncate">Logged in: <strong className="text-onam-green">{user.name}</strong></span>
                <button
                  onClick={async () => {
                    await logout();
                    setIsMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="text-xs text-rose-600 font-bold hover:underline cursor-pointer bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg shrink-0 font-sans"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-onam-green text-onam-cream py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-onam-green-light"
              >
                Login to Store <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

        </div>
      )}
    </header>
  );
};
