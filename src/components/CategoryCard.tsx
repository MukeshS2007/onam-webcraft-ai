import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flower, Shirt, Gift, Compass, Sparkles, Home, Cookie, Palette } from 'lucide-react';

interface CategoryCardProps {
  name: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ name }) => {
  const navigate = useNavigate();

  // Helper to map category names to beautiful Lucide icons
  const getCategoryIcon = () => {
    switch (name) {
      case 'Onam Sarees':
        return <Sparkles className="w-8 h-8 text-onam-gold" />;
      case 'Kasavu':
        return <Compass className="w-8 h-8 text-onam-gold" />;
      case 'Traditional Wear':
        return <Shirt className="w-8 h-8 text-onam-gold" />;
      case 'Handicrafts':
        return <Palette className="w-8 h-8 text-onam-gold" />;
      case 'Home Decor':
        return <Home className="w-8 h-8 text-onam-gold" />;
      case 'Onam Gifts':
        return <Gift className="w-8 h-8 text-onam-gold" />;
      case 'Banana Chips & Snacks':
        return <Cookie className="w-8 h-8 text-onam-gold" />;
      case 'Pookalam Essentials':
        return <Flower className="w-8 h-8 text-onam-gold" />;
      default:
        return <Flower className="w-8 h-8 text-onam-gold" />;
    }
  };

  const handleRedirect = () => {
    navigate(`/products?category=${encodeURIComponent(name)}`);
  };

  return (
    <button
      onClick={handleRedirect}
      className="group flex flex-col items-center bg-onam-cream-dark/50 hover:bg-onam-green border border-onam-gold/20 hover:border-onam-green-dark p-6 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 w-full text-center"
    >
      <div className="w-16 h-16 rounded-full bg-onam-green group-hover:bg-onam-gold flex items-center justify-center mb-4 shadow-inner border border-onam-gold/15 transition-colors duration-300">
        <span className="group-hover:scale-110 transition-transform duration-300">
          {getCategoryIcon()}
        </span>
      </div>
      <h3 className="font-serif font-bold text-sm text-onam-green group-hover:text-onam-cream tracking-wide transition-colors duration-300">
        {name}
      </h3>
      <span className="text-[10px] text-onam-charcoal/50 group-hover:text-onam-cream-dark/70 font-sans mt-1 uppercase tracking-widest transition-colors duration-300">
        View Collection
      </span>
    </button>
  );
};
