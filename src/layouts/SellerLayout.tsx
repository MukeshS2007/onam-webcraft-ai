import React, { useState } from 'react';
import { Outlet, Navigate, Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShieldCheck, User, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SellerSidebar } from '../components/SellerSidebar';
import { ToastContainer } from '../components/Toast';

export const SellerLayout: React.FC = () => {
  const { user, logout, switchUserRole } = useApp();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Protection: if user is not a seller, redirect to login
  // For the demo, if they hit /seller directly, we'll auto-switch them to seller
  // or allow it. Let's make it so if they aren't logged in, we let them proceed
  // but if they are customer, we show a button to switch or auto-switch for demo convenience.
  if (user && user.role !== 'seller') {
    return (
      <div className="min-h-screen bg-onam-cream flex items-center justify-center p-4">
        <div className="bg-white border border-onam-gold/30 p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <span className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-500 text-3xl mb-4">
            ⚠️
          </span>
          <h2 className="font-serif text-xl font-bold text-onam-green mb-2">Seller Account Required</h2>
          <p className="text-sm text-onam-charcoal/70 mb-6 font-sans">
            You are currently logged in as a **Customer**. Would you like to switch to the **Seller Dashboard**?
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => switchUserRole('seller')}
              className="bg-onam-green text-onam-cream hover:bg-onam-green-light py-2.5 rounded-xl text-sm font-semibold transition-all shadow cursor-pointer"
            >
              Switch to Seller Dashboard
            </button>
            <Link
              to="/"
              className="text-sm text-onam-green hover:underline font-semibold"
            >
              Return to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-onam-cream-dark/30 text-onam-charcoal">
      
      {/* Sidebar (Desktop) */}
      <div className="hidden lg:block">
        <SellerSidebar />
      </div>

      {/* Mobile Sidebar (Drawer) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
          {/* Drawer content */}
          <div className="relative z-10 w-64 h-full animate-in slide-in-from-left duration-300">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-[-45px] p-2 bg-onam-green text-onam-cream rounded-r-lg border-y border-r border-onam-gold/20 shadow-md"
            >
              <X className="w-5 h-5" />
            </button>
            <SellerSidebar />
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="bg-white border-b border-onam-gold/20 h-20 flex items-center justify-between px-6 sm:px-8">
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-lg text-onam-green hover:bg-onam-cream-dark/50"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Title Area */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex w-7 h-7 rounded-full bg-onam-green/10 items-center justify-center text-onam-green text-sm border border-onam-green/20">
              🏪
            </span>
            <h1 className="font-serif text-lg sm:text-xl font-bold text-onam-green">
              {user?.name || "Malabar Crunch Snacks"}
            </h1>
          </div>

          {/* Account Details */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-onam-green-light">
                {user?.email || "seller@malabarsnacks.com"}
              </span>
              <span className="text-[10px] text-onam-charcoal/50 uppercase tracking-widest font-sans">
                Active Storefront
              </span>
            </div>

            <hr className="hidden md:block h-8 border-l border-onam-gold/20" />

            <button
              onClick={async () => {
                await logout();
                navigate('/login');
              }}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout Studio</span>
            </button>
          </div>

        </header>

        {/* Dynamic Viewport */}
        <main className="flex-grow p-6 sm:p-8 max-w-7xl w-full mx-auto overflow-y-auto animate-in fade-in duration-300">
          <Outlet />
        </main>

      </div>

      <ToastContainer />
    </div>
  );
};
export default SellerLayout;
