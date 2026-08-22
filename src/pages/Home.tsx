import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Leaf, Award, ShieldCheck, Heart } from 'lucide-react';
import { productService } from '../services/productService';
import { Product } from '../data/mockProducts';
import { CategoryCard } from '../components/CategoryCard';
import { ProductCard } from '../components/ProductCard';
import { useApp } from '../context/AppContext';

interface SellerSpotlight {
  name: string;
  location: string;
  specialty: string;
  rating: number;
  productsCount: number;
  avatar: string;
}

const MOCK_SELLERS: SellerSpotlight[] = [
  {
    name: "Lakshmi Handlooms",
    location: "Kottayam",
    specialty: "Traditional Kasavu",
    rating: 4.9,
    productsCount: 18,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Kerala Naturals",
    location: "Thrissur",
    specialty: "Snacks & Food",
    rating: 4.8,
    productsCount: 12,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Village Craft Studio",
    location: "Palakkad",
    specialty: "Handicrafts",
    rating: 4.7,
    productsCount: 15,
    avatar: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Madhavi Home Decor",
    location: "Alappuzha",
    specialty: "Onam Decor",
    rating: 4.9,
    productsCount: 8,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
  }
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { switchUserRole } = useApp();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Category list
  const categories = [
    "Onam Sarees",
    "Kasavu",
    "Traditional Wear",
    "Handicrafts",
    "Home Decor",
    "Onam Gifts",
    "Banana Chips & Snacks",
    "Pookalam Essentials"
  ];

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const allProducts = await productService.getProducts();
        // Show first 4 active, highly rated products
        const filtered = allProducts
          .filter(p => p.is_active)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 4);
        setFeaturedProducts(filtered);
      } catch (e) {
        console.error("Failed to load products", e);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="space-y-16">
      
      {/* 1. Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-onam-cream-dark/60 border border-onam-gold/20 shadow-sm p-8 sm:p-12 md:p-16 flex flex-col md:flex-row items-center gap-8">
        {/* Background decorative flower shapes or lights */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-onam-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-onam-green/5 rounded-full blur-3xl pointer-events-none" />

        {/* Text */}
        <div className="flex-1 space-y-6 text-center md:text-left z-10">
          <span className="inline-flex items-center gap-1.5 bg-onam-gold/20 text-onam-green border border-onam-gold/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            🪔 Kerala Festive Bazaar
          </span>
          
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-onam-green leading-tight">
            Celebrate Onam.<br />
            <span className="text-onam-gold">Support Local.</span>
          </h1>

          <p className="text-base sm:text-lg text-onam-charcoal/80 max-w-xl font-sans font-light leading-relaxed">
            Discover authentic Onam essentials, handloom Kasavu attire, brass artifacts, and organic snacks sourced directly from Kerala's local artisans and village makers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              onClick={() => navigate('/products')}
              className="bg-onam-green hover:bg-onam-green-light text-onam-cream font-bold px-8 py-3.5 rounded-full shadow-md shadow-onam-green/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              Shop Onam Collection
              <ArrowRight className="w-4 h-4 text-onam-gold" />
            </button>
            <button
              onClick={() => switchUserRole('seller')}
              className="border-2 border-onam-gold-dark text-onam-green font-bold px-8 py-3.5 rounded-full hover:bg-onam-gold hover:text-onam-green hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              Become a Seller
            </button>
          </div>
        </div>

        {/* Hero Visual Banner (Artistic layout representing lamp/flowers) */}
        <div className="flex-1 w-full max-w-md md:max-w-none relative">
          {/* Floating spinning Athapookalam SVG */}
          <div className="absolute -top-8 -left-8 z-20 hidden lg:block pointer-events-none">
            <svg className="w-28 h-28 pookalam-spin drop-shadow-xl" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="95" fill="none" stroke="#E65100" strokeWidth="6" strokeDasharray="6 3" />
              <circle cx="100" cy="100" r="85" fill="none" stroke="#FFB300" strokeWidth="8" strokeDasharray="8 4" />
              <circle cx="100" cy="100" r="72" fill="none" stroke="#1B5E20" strokeWidth="10" strokeDasharray="12 6" />
              <circle cx="100" cy="100" r="58" fill="none" stroke="#F57C00" strokeWidth="6" />
              <circle cx="100" cy="100" r="48" fill="#FFC107" />
              <path d="M100 60 L112 88 L140 100 L112 112 L100 140 L88 112 L60 100 L88 88 Z" fill="#D4AF37" />
              <circle cx="100" cy="100" r="15" fill="#5D4037" />
              <path d="M100 80 L105 92 L95 92 Z" fill="#FF9100" />
            </svg>
          </div>

          <div className="w-full relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-onam-gold/35 bg-white">
            <img
              src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=700&q=80"
              alt="Nilavilakku traditional lamp representing Onam"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-onam-green/70 via-transparent to-transparent flex items-end p-6">
              <div className="text-white">
                <span className="text-xs uppercase tracking-widest text-onam-gold font-bold">Mannar Handicraft Craftsmanship</span>
                <h3 className="font-serif text-lg font-bold">Hand-Polished Standing Lamps</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categories Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-serif text-3xl font-bold text-onam-green">
            Shop by Category
          </h2>
          <p className="text-sm text-onam-charcoal/60 font-light">
            Everything you need for your Pookalam, Sadya Feast, and Festive wardrobe.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat) => (
            <CategoryCard key={cat} name={cat} />
          ))}
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-onam-gold/25 pb-4">
          <div className="space-y-1">
            <h2 className="font-serif text-3xl font-bold text-onam-green">
              Featured Festive Finds
            </h2>
            <p className="text-sm text-onam-charcoal/60 font-light">
              Highly rated items handpicked for your celebrations.
            </p>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="text-onam-green hover:text-onam-gold hover:underline font-bold text-sm flex items-center gap-1 shrink-0"
          >
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="bg-white border border-onam-gold/15 rounded-2xl p-4 space-y-4 animate-pulse">
                <div className="bg-onam-cream-dark h-40 rounded-xl w-full" />
                <div className="h-4 bg-onam-cream-dark rounded w-2/3" />
                <div className="h-3 bg-onam-cream-dark rounded w-1/3" />
                <div className="h-8 bg-onam-cream-dark rounded w-full mt-4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Local Seller Spotlight (Meet the Makers) */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-onam-gold text-xs font-bold uppercase tracking-widest block font-sans">The Heart of Our Store</span>
          <h2 className="font-serif text-3xl font-bold text-onam-green">
            Meet the Makers Behind Your Onam
          </h2>
          <p className="text-sm text-onam-charcoal/60 font-light">
            Every product has a story. Meet the local weavers, craftspeople, and farmers who make your celebrations authentic.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_SELLERS.map((seller) => (
            <div
              key={seller.name}
              className="bg-white border border-onam-gold/20 hover:border-onam-gold rounded-2xl p-6 shadow-sm hover:shadow-md gold-glow-hover transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-1"
            >
              {/* Avatar Frame */}
              <div className="relative mb-4">
                <img
                  src={seller.avatar}
                  alt={seller.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-onam-gold shadow-sm"
                />
                <span className="absolute bottom-0 right-0 bg-onam-gold text-onam-green text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white font-sans">
                  ★ {seller.rating}
                </span>
              </div>

              {/* Title & Location */}
              <div className="space-y-1 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base text-onam-green">
                    {seller.name}
                  </h3>
                  <div className="mt-1">
                    <span className="text-[10px] bg-onam-cream-dark text-onam-green border border-onam-gold/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-sans">
                      📍 {seller.location}
                    </span>
                  </div>
                </div>
                
                <div className="pt-3.5 space-y-1">
                  <p className="text-xs text-onam-charcoal/80 font-sans font-medium">
                    Specialty: <span className="text-onam-gold-dark font-semibold">{seller.specialty}</span>
                  </p>
                  <p className="text-[10px] text-onam-charcoal/50 font-sans">
                    {seller.productsCount} Festive Items Listed
                  </p>
                </div>
              </div>

              {/* View Store Action */}
              <button
                onClick={() => navigate(`/products?search=${encodeURIComponent(seller.name.split(' ')[0])}`)}
                className="mt-5 w-full bg-onam-cream-dark/40 hover:bg-onam-green border border-onam-gold/45 text-onam-green hover:text-onam-cream py-2 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                View Store
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Why Shop Local Section */}
      <section className="bg-onam-green text-onam-cream rounded-3xl p-8 sm:p-12 md:p-16 border border-onam-gold/30 shadow-md">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-onam-gold text-xs font-bold uppercase tracking-widest">Empowering Kerala's Rural Artisans</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-onam-cream">
              Why Shop at Onam Village Store?
            </h2>
            <p className="text-sm text-onam-cream-dark/70 font-light max-w-xl mx-auto leading-relaxed">
              Every purchase you make impacts a household directly. We ensure fair pricing and direct support to rural makers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-3 bg-onam-green-dark/40 border border-onam-gold/15 p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-onam-gold flex items-center justify-center text-onam-green text-lg shadow">
                <Leaf className="w-6 h-6 text-onam-green" />
              </div>
              <h3 className="font-serif text-lg font-bold text-onam-gold">100% Authentic & Pure</h3>
              <p className="text-xs font-light text-onam-cream-dark/80 leading-relaxed font-sans">
                Real Nendran bananas fried in cold-pressed coconut oil, organic clay urlis, and certified handloom materials. No adulteration.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 bg-onam-green-dark/40 border border-onam-gold/15 p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-onam-gold flex items-center justify-center text-onam-green text-lg shadow">
                <Award className="w-6 h-6 text-onam-green" />
              </div>
              <h3 className="font-serif text-lg font-bold text-onam-gold">Direct Artisan Sourcing</h3>
              <p className="text-xs font-light text-onam-cream-dark/80 leading-relaxed font-sans">
                We remove intermediaries. 85%+ of the sale price goes directly back to the weaver co-operatives and family metal-smiths in Balaramapuram and Mannar.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 bg-onam-green-dark/40 border border-onam-gold/15 p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-onam-gold flex items-center justify-center text-onam-green text-lg shadow">
                <ShieldCheck className="w-6 h-6 text-onam-green" />
              </div>
              <h3 className="font-serif text-lg font-bold text-onam-gold">Heritage Preservation</h3>
              <p className="text-xs font-light text-onam-cream-dark/80 leading-relaxed font-sans">
                By purchasing wood carvings, brass diyas, and handloom sets, you support traditional craft forms passed down through generations.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Festival CTA Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-50 to-onam-cream border border-onam-gold/25 shadow-sm p-8 sm:p-12 text-center max-w-5xl mx-auto space-y-6">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#1e3f20_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <span className="text-2xl">💮🌼🏵️</span>
        <h2 className="font-serif text-3xl font-extrabold text-onam-green">
          Bring the Spirit of Onam to Your Home
        </h2>
        <p className="text-sm text-onam-charcoal/70 max-w-xl mx-auto leading-relaxed font-sans font-light">
          Enjoy express shipping across India. Ensure your home is ready with fresh flowers, traditional lamps, and mouthwatering snacks for the ultimate Onam Sadya.
        </p>

        <button
          onClick={() => navigate('/products')}
          className="bg-onam-gold hover:bg-onam-gold-dark text-onam-green hover:text-onam-cream font-bold px-8 py-3.5 rounded-full shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center gap-2 cursor-pointer text-sm"
        >
          Explore the Full Collection <ArrowRight className="w-4 h-4" />
        </button>
      </section>

    </div>
  );
};
export default Home;
