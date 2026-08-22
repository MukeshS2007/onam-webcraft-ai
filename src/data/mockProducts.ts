export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  seller_id: string;
  seller_name: string;
  is_active: boolean;
  rating: number;
  reviews_count: number;
  created_at: string;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Premium Kerala Kasavu Saree",
    category: "Onam Sarees",
    description: "An elegant, traditional Kerala saree woven with 100% fine cotton. Adorned with a beautiful rich golden zari border (Kasavu). Perfect for Onam celebrations, temple visits, and wedding ceremonies. Handloom crafted with love by local weavers in Balaramapuram.",
    price: 1899,
    stock: 15,
    image_url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
    seller_id: "seller-1",
    seller_name: "Balaramapuram Weavers Co-op",
    is_active: true,
    rating: 4.8,
    reviews_count: 24,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "prod-2",
    name: "Traditional Handloom Double Mundu",
    category: "Traditional Wear",
    description: "Pure cotton double mundu with a thick, golden-green border. Highly breathable, soft texture, and crafted for maximum comfort during hot festive days. Features the authentic Kuthampully weave.",
    price: 799,
    stock: 25,
    image_url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
    seller_id: "seller-2",
    seller_name: "Kuthampully Handloom Heritage",
    is_active: true,
    rating: 4.7,
    reviews_count: 18,
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "prod-3",
    name: "Handmade Brass Nilavilakku (Traditional Lamp)",
    category: "Home Decor",
    description: "A heavy, premium brass standing lamp (Nilavilakku) essential for Kerala households. Exquisitely handcrafted by traditional metal artisans of Mannar. Ideal for lighting during Onam prayers and welcoming guests.",
    price: 1299,
    stock: 8,
    image_url: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=600&q=80",
    seller_id: "seller-3",
    seller_name: "Mannar Metal Artisans",
    is_active: true,
    rating: 4.9,
    reviews_count: 32,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "prod-4",
    name: "Fresh Marigold & Jasmine Pookalam Kit",
    category: "Pookalam Essentials",
    description: "A curated assortment of fresh, vibrant yellow and orange marigold flowers, white jasmines, and red rose petals. Harvested directly from local farms on the eve of shipment to ensure freshness for your Athapookalam.",
    price: 499,
    stock: 50,
    image_url: "https://images.unsplash.com/photo-1596199050105-6d5d32222916?auto=format&fit=crop&w=600&q=80",
    seller_id: "seller-4",
    seller_name: "Ganga Florals & Farms",
    is_active: true,
    rating: 4.5,
    reviews_count: 45,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "prod-5",
    name: "Crisp Kerala Banana Chips (Coconut Oil Fried)",
    category: "Banana Chips & Snacks",
    description: "Authentic, thin-sliced Nendran banana chips fried in 100% pure coconut oil. Seasoned with salt and turmeric, containing no artificial preservatives or colors. Made in small batches for premium crunchiness.",
    price: 249,
    stock: 40,
    image_url: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=600&q=80",
    seller_id: "seller-5",
    seller_name: "Malabar Crunch Snacks",
    is_active: true,
    rating: 4.9,
    reviews_count: 112,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "prod-6",
    name: "Sweet Jackfruit Chips (Chakka Upperi)",
    category: "Banana Chips & Snacks",
    description: "Crispy and sweet jackfruit slices fried to golden perfection in pure cold-pressed coconut oil. Sourced from organic village orchards, providing a unique festive flavor native to Kerala Sadya.",
    price: 299,
    stock: 30,
    image_url: "https://images.unsplash.com/photo-1566847438217-76e82d383f84?auto=format&fit=crop&w=600&q=80",
    seller_id: "seller-5",
    seller_name: "Malabar Crunch Snacks",
    is_active: true,
    rating: 4.6,
    reviews_count: 58,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "prod-7",
    name: "Srimathi Luxury Onam Sadya Gift Hamper",
    category: "Onam Gifts",
    description: "A premium gift box containing Payasam Mix (Ada Pradhaman), Kerala Banana Chips, Sarkaravaratti (jaggery banana pieces), Handcrafted Clay Diya, and a small Brass Kasavu Tabletop Boat. The ultimate gift of joy for family and clients.",
    price: 2499,
    stock: 10,
    image_url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
    seller_id: "seller-6",
    seller_name: "Srimathi Festive Gifting",
    is_active: true,
    rating: 4.8,
    reviews_count: 29,
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "prod-8",
    name: "Coconut Shell Handcrafted Salad Bowl Set",
    category: "Handicrafts",
    description: "Eco-friendly, food-grade salad bowls made from reclaimed coconut shells. Sanded smooth and polished with organic cold-pressed coconut oil. Beautiful, lightweight, and showcasing traditional Kerala shell-craft.",
    price: 399,
    stock: 12,
    image_url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
    seller_id: "seller-7",
    seller_name: "Eco-Kerala Crafts",
    is_active: true,
    rating: 4.4,
    reviews_count: 15,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "prod-9",
    name: "Kerala Handloom Set Mundum Neryathum",
    category: "Kasavu",
    description: "The classic two-piece traditional attire of Kerala women, woven with premium thread and a 3-inch golden zari border. Includes a matching cream blouse piece. Authentic cotton weave that drapes elegantly.",
    price: 1499,
    stock: 18,
    image_url: "https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=600&q=80",
    seller_id: "seller-1",
    seller_name: "Balaramapuram Weavers Co-op",
    is_active: true,
    rating: 4.7,
    reviews_count: 22,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "prod-10",
    name: "Traditional Brass Urli Floral Vessel",
    category: "Home Decor",
    description: "A wide, shallow brass bowl (Urli) designed for floating flowers and candles at your home entrance. Brings prosperity, positive energy, and beautiful classic aesthetics to your Onam decor.",
    price: 1899,
    stock: 5,
    image_url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
    seller_id: "seller-3",
    seller_name: "Mannar Metal Artisans",
    is_active: true,
    rating: 4.9,
    reviews_count: 41,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "prod-11",
    name: "Handmade Wooden Netipattam Elephant Decor",
    category: "Handicrafts",
    description: "A finely detailed, rosewood-carved elephant figurine wearing a miniature golden caparison (Netipattam). Handmade by master woodcarvers of Cherpu. Symbolizes strength and auspiciousness.",
    price: 899,
    stock: 3,
    image_url: "https://images.unsplash.com/photo-1581337204873-ef36336a51b7?auto=format&fit=crop&w=600&q=80",
    seller_id: "seller-8",
    seller_name: "Cherpu Woodcarvers Guild",
    is_active: true,
    rating: 4.8,
    reviews_count: 14,
    created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "prod-12",
    name: "Deluxe Floral Pookalam Wooden Stencil",
    category: "Pookalam Essentials",
    description: "A lightweight wooden circular stencil with traditional floral pattern cuts. Makes creating symmetric, complex flower carpets easy, clean, and quick for homes, schools, and offices.",
    price: 349,
    stock: 0, // Mark one out of stock to showcase low/out-of-stock indicators
    image_url: "https://images.unsplash.com/photo-1562240020-ce31ccb0fa7d?auto=format&fit=crop&w=600&q=80",
    seller_id: "seller-7",
    seller_name: "Eco-Kerala Crafts",
    is_active: true,
    rating: 4.3,
    reviews_count: 9,
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const CATEGORIES = [
  "Onam Sarees",
  "Kasavu",
  "Traditional Wear",
  "Handicrafts",
  "Home Decor",
  "Onam Gifts",
  "Banana Chips & Snacks",
  "Pookalam Essentials"
];
