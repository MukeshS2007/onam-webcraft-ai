import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, BarChart3, Store, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SellerSidebar: React.FC = () => {
  const location = useLocation();
  const { switchUserRole } = useApp();

  const menuItems = [
    {
      path: '/seller',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      path: '/seller/products',
      label: 'Products',
      icon: <Package className="w-5 h-5" />
    },
    {
      path: '/seller/orders',
      label: 'Orders',
      icon: <ShoppingBag className="w-5 h-5" />
    },
    {
      path: '/seller/inventory',
      label: 'Inventory',
      icon: <BarChart3 className="w-5 h-5" />
    }
  ];

  return (
    <aside className="w-64 bg-onam-green border-r border-onam-gold/20 flex flex-col min-h-screen text-onam-cream shrink-0">
      
      {/* Header */}
      <div className="p-6 border-b border-onam-gold/15 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-onam-gold flex items-center justify-center text-onam-green text-sm shadow">
            🪔
          </span>
          <span className="font-serif text-lg font-bold tracking-wider text-onam-cream">
            Seller <span className="text-onam-gold">Studio</span>
          </span>
        </div>
        <span className="text-[10px] text-onam-cream-dark/60 font-sans tracking-widest uppercase mt-1 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-onam-gold" /> Admin Console
        </span>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-onam-gold text-onam-green shadow-md shadow-black/10'
                  : 'text-onam-cream/80 hover:bg-onam-green-light hover:text-onam-cream'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer Switcher */}
      <div className="p-4 border-t border-onam-gold/15 bg-onam-green-dark">
        <button
          onClick={() => switchUserRole('customer')}
          className="w-full flex items-center justify-center gap-2 bg-onam-cream text-onam-green hover:bg-onam-gold hover:text-onam-green py-2.5 rounded-xl text-xs font-bold transition-all shadow cursor-pointer"
        >
          <Store className="w-4 h-4" />
          View Customer Store
        </button>
      </div>

    </aside>
  );
};
export default SellerSidebar;
