import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-onam-green text-onam-cream-dark border-t border-onam-gold/30 mt-auto">
      
      {/* Primary Footer Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          
          {/* Brand Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-onam-gold flex items-center justify-center text-onam-green text-sm shadow">
                🪔
              </span>
              <span className="font-serif text-lg font-bold tracking-wider text-onam-cream">
                Onam <span className="text-onam-gold">Village Store</span>
              </span>
            </div>
            <p className="text-sm text-onam-cream-dark/80 leading-relaxed font-sans font-light">
              Celebrate Onam. Support Local. Shop Traditionally. We bring authentic handicrafts, attire, and snacks from Kerala's rural artisans directly to your doorstep.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-onam-green-dark border border-onam-gold/20 flex items-center justify-center text-onam-cream-dark hover:bg-onam-gold hover:text-onam-green transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-onam-green-dark border border-onam-gold/20 flex items-center justify-center text-onam-cream-dark hover:bg-onam-gold hover:text-onam-green transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-onam-green-dark border border-onam-gold/20 flex items-center justify-center text-onam-cream-dark hover:bg-onam-gold hover:text-onam-green transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          {/* Shop Categories */}
          <div className="space-y-4">
            <h3 className="font-serif text-sm font-semibold text-onam-gold uppercase tracking-wider">
              Festive Collection
            </h3>
            <ul className="space-y-2 text-sm font-sans font-light">
              <li>
                <Link to="/products?category=Onam%20Sarees" className="hover:text-onam-gold transition-colors">
                  Kerala Kasavu Sarees
                </Link>
              </li>
              <li>
                <Link to="/products?category=Traditional%20Wear" className="hover:text-onam-gold transition-colors">
                  Traditional Mundu & Sets
                </Link>
              </li>
              <li>
                <Link to="/products?category=Home%20Decor" className="hover:text-onam-gold transition-colors">
                  Brass Nilavilakku & Urlis
                </Link>
              </li>
              <li>
                <Link to="/products?category=Banana%20Chips%20%26%20Snacks" className="hover:text-onam-gold transition-colors">
                  Coconut Oil Fried Banana Chips
                </Link>
              </li>
              <li>
                <Link to="/products?category=Pookalam%20Essentials" className="hover:text-onam-gold transition-colors">
                  Fresh Flowers & Stencils
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-sm font-semibold text-onam-gold uppercase tracking-wider">
              Seller & Support
            </h3>
            <ul className="space-y-2 text-sm font-sans font-light">
              <li>
                <Link to="/seller" className="hover:text-onam-gold transition-colors">
                  Seller Dashboard
                </Link>
              </li>
              <li>
                <Link to="/seller/products" className="hover:text-onam-gold transition-colors">
                  Add Festive Products
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-onam-gold transition-colors">
                  Access Demo Accounts
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-onam-gold transition-colors">
                  Shipping & Return Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-onam-gold transition-colors">
                  Artisan Registration
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="font-serif text-sm font-semibold text-onam-gold uppercase tracking-wider">
              Artisan Guild Office
            </h3>
            <ul className="space-y-3 text-sm font-sans font-light">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-onam-gold shrink-0 mt-0.5" />
                <span>Kerala Khadi & Village Industries Board, Thiruvananthapuram, KL 695001</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-onam-gold shrink-0" />
                <span>+91 471 2321456</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-onam-gold shrink-0" />
                <span>support@onamvillagestore.in</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Secondary Footer */}
      <div className="bg-onam-green-dark py-6 border-t border-onam-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-onam-cream-dark/60">
          <div>
            &copy; {new Date().getFullYear()} Onam Village Store. All rights reserved.
          </div>
          <div className="flex items-center gap-1 font-sans">
            Made with <Heart className="w-3.5 h-3.5 text-onam-gold fill-onam-gold" /> supporting local weavers and artisans of Kerala.
          </div>
        </div>
      </div>

    </footer>
  );
};
