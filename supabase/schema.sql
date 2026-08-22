-- Onam Village Store Database Schema
-- Supabase SQL Schema for Competition-Ready MVP

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
-- Holds basic user details linked to Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    pincode VARCHAR(20),
    role VARCHAR(20) DEFAULT 'customer' NOT NULL CHECK (role IN ('customer', 'seller')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on public.profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. SELLERS TABLE
-- Stores seller-specific storefront details linked to a profile
CREATE TABLE IF NOT EXISTS public.sellers (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    store_name VARCHAR(255) NOT NULL UNIQUE,
    store_description TEXT,
    store_banner VARCHAR(512),
    store_email VARCHAR(255),
    store_phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on public.sellers
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;

-- 3. PRODUCTS TABLE
-- Stores festive products listed by sellers
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
    stock INTEGER NOT NULL CHECK (stock >= 0),
    image_url VARCHAR(512) NOT NULL,
    seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 5.00 NOT NULL CHECK (rating >= 0 AND rating <= 5.00),
    reviews_count INTEGER DEFAULT 0 NOT NULL CHECK (reviews_count >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on public.products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4. ORDERS TABLE
-- Stores order invoices placed by customers
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_address TEXT NOT NULL,
    customer_city VARCHAR(100) NOT NULL,
    customer_pincode VARCHAR(20) NOT NULL,
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cod', 'upi')),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    status VARCHAR(30) DEFAULT 'placed' NOT NULL CHECK (status IN ('placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on public.orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 5. ORDER_ITEMS TABLE
-- Holds the individual items purchased in an order
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
    image_url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on public.order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- --- INDEXES FOR OPTIMIZED BROWSE & FILTER SEARCHES ---
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_seller ON public.products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_seller ON public.order_items(seller_id);

-- --- AUTOMATIC TIMESTAMPS UPDATE TRIGGERS ---
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_profiles_modtime BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER update_sellers_modtime BEFORE UPDATE ON public.sellers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER update_products_modtime BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER update_orders_modtime BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- --- ROW LEVEL SECURITY POLICIES ---

-- Products Policies: anyone can read active products, sellers can insert/update/delete their own
CREATE POLICY "Allow public read active products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Allow sellers to manage their products" ON public.products FOR ALL USING (
    auth.uid() = seller_id
);

-- Sellers Policies: anyone can read, sellers can update their profile
CREATE POLICY "Allow public read sellers" ON public.sellers FOR SELECT USING (true);
CREATE POLICY "Allow sellers to update own store info" ON public.sellers FOR UPDATE USING (auth.uid() = id);

-- Profiles Policies: users can manage own profile
CREATE POLICY "Allow users to read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow users to update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Orders Policies: customers can manage own orders, sellers can view orders containing their items
CREATE POLICY "Allow customers to manage own orders" ON public.orders FOR ALL USING (auth.uid() = customer_id);
CREATE POLICY "Allow sellers to read order metadata" ON public.orders FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.order_items 
        WHERE order_items.order_id = orders.id 
        AND order_items.seller_id = auth.uid()
    )
);


-- --- SEED/DEMO ARTISAN & PRODUCT DATA ---

-- 1. Insert seed profiles (UUIDs map to fictional users)
INSERT INTO public.profiles (id, email, name, phone, address, city, pincode, role)
VALUES 
  ('f8c3de3d-ecad-48b4-934c-687f174c8491', 'seller@malabarsnacks.com', 'Malabar Crunch Snacks', '9447123456', 'Snacks Highway Junction, Calicut', 'Kozhikode', '673001', 'seller'),
  ('d3b07384-d113-4956-b51e-6134a413554a', 'anjali@example.com', 'Anjali Nair', '9876543210', 'House No 42, Green Gardens, Kakkanad', 'Kochi', '682030', 'customer')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert seed sellers matching profile IDs
INSERT INTO public.sellers (id, store_name, store_description, store_banner, store_email, store_phone)
VALUES 
  ('f8c3de3d-ecad-48b4-934c-687f174c8491', 'Malabar Crunch Snacks', 'Authentic traditional snacks and crisps fried in cold-pressed coconut oil.', 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=1200&q=80', 'seller@malabarsnacks.com', '9447123456')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert 12 seed products listed under the seller id
INSERT INTO public.products (id, name, category, description, price, stock, image_url, seller_id, is_active, rating, reviews_count)
VALUES
  ('45e85579-22a3-41c1-9034-70653dfcb01c', 'Premium Kerala Kasavu Saree', 'Onam Sarees', 'An elegant, traditional Kerala saree woven with 100% fine cotton. Adorned with a beautiful rich golden zari border (Kasavu). Perfect for Onam celebrations.', 1899.00, 15, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80', 'f8c3de3d-ecad-48b4-934c-687f174c8491', true, 4.8, 24),
  ('1a48c5cb-3f1f-4f24-912c-cb0a76a5a415', 'Traditional Handloom Double Mundu', 'Traditional Wear', 'Pure cotton double mundu with a thick, golden-green border. Highly breathable, soft texture, and crafted for maximum comfort during hot festive days.', 799.00, 25, 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80', 'f8c3de3d-ecad-48b4-934c-687f174c8491', true, 4.7, 18),
  ('5b532d84-c81b-4f9b-8bf1-e612984a92c3', 'Handmade Brass Nilavilakku (Traditional Lamp)', 'Home Decor', 'A heavy, premium brass standing lamp (Nilavilakku) essential for Kerala households. Exquisitely handcrafted by traditional metal artisans.', 1299.00, 8, 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=600&q=80', 'f8c3de3d-ecad-48b4-934c-687f174c8491', true, 4.9, 32),
  ('8e10034a-928d-4e94-9177-3e8174dfb07b', 'Fresh Marigold & Jasmine Pookalam Kit', 'Pookalam Essentials', 'A curated assortment of fresh, vibrant yellow and orange marigold flowers, white jasmines, and red rose petals.', 499.00, 50, 'https://images.unsplash.com/photo-1596199050105-6d5d32222916?auto=format&fit=crop&w=600&q=80', 'f8c3de3d-ecad-48b4-934c-687f174c8491', true, 4.5, 45),
  ('2b7405cb-3f1f-4f24-912c-cb0a76a5a415', 'Crisp Kerala Banana Chips (Coconut Oil Fried)', 'Banana Chips & Snacks', 'Authentic, thin-sliced Nendran banana chips fried in 100% pure coconut oil. Seasoned with salt and turmeric, containing no artificial preservatives.', 249.00, 40, 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=600&q=80', 'f8c3de3d-ecad-48b4-934c-687f174c8491', true, 4.9, 112),
  ('3c8405cb-3f1f-4f24-912c-cb0a76a5a415', 'Sweet Jackfruit Chips (Chakka Upperi)', 'Banana Chips & Snacks', 'Crispy and sweet jackfruit slices fried to golden perfection in pure cold-pressed coconut oil. Sourced from organic village orchards.', 299.00, 30, 'https://images.unsplash.com/photo-1566847438217-76e82d383f84?auto=format&fit=crop&w=600&q=80', 'f8c3de3d-ecad-48b4-934c-687f174c8491', true, 4.6, 58),
  ('6d8405cb-3f1f-4f24-912c-cb0a76a5a415', 'Srimathi Luxury Onam Sadya Gift Hamper', 'Onam Gifts', 'A premium gift box containing Payasam Mix (Ada Pradhaman), Kerala Banana Chips, Sarkaravaratti, Handcrafted Clay Diya, and Tabletop Boat.', 2499.00, 10, 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80', 'f8c3de3d-ecad-48b4-934c-687f174c8491', true, 4.8, 29),
  ('7e8405cb-3f1f-4f24-912c-cb0a76a5a415', 'Coconut Shell Handcrafted Salad Bowl Set', 'Handicrafts', 'Eco-friendly, food-grade salad bowls made from reclaimed coconut shells. Sanded smooth and polished with organic cold-pressed coconut oil.', 399.00, 12, 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80', 'f8c3de3d-ecad-48b4-934c-687f174c8491', true, 4.4, 15),
  ('9f8405cb-3f1f-4f24-912c-cb0a76a5a415', 'Kerala Handloom Set Mundum Neryathum', 'Kasavu', 'The classic two-piece traditional attire of Kerala women, woven with premium thread and a 3-inch golden zari border.', 1499.00, 18, 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=600&q=80', 'f8c3de3d-ecad-48b4-934c-687f174c8491', true, 4.7, 22),
  ('1c8405cb-3f1f-4f24-912c-cb0a76a5a415', 'Traditional Brass Urli Floral Vessel', 'Home Decor', 'A wide, shallow brass bowl (Urli) designed for floating flowers and candles at your home entrance. Brings prosperity and positive energy.', 1899.00, 5, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80', 'f8c3de3d-ecad-48b4-934c-687f174c8491', true, 4.9, 41),
  ('2c8405cb-3f1f-4f24-912c-cb0a76a5a415', 'Handmade Wooden Netipattam Elephant Decor', 'Handicrafts', 'A finely detailed, rosewood-carved elephant figurine wearing a miniature golden caparison (Netipattam). Handmade by traditional woodcarvers.', 899.00, 3, 'https://images.unsplash.com/photo-1581337204873-ef36336a51b7?auto=format&fit=crop&w=600&q=80', 'f8c3de3d-ecad-48b4-934c-687f174c8491', true, 4.8, 14),
  ('3d8405cb-3f1f-4f24-912c-cb0a76a5a415', 'Deluxe Floral Pookalam Wooden Stencil', 'Pookalam Essentials', 'A lightweight wooden circular stencil with traditional floral pattern cuts. Makes creating symmetric flower carpets easy and quick.', 349.00, 0, 'https://images.unsplash.com/photo-1562240020-ce31ccb0fa7d?auto=format&fit=crop&w=600&q=80', 'f8c3de3d-ecad-48b4-934c-687f174c8491', true, 4.3, 9)
ON CONFLICT (id) DO NOTHING;
