import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MOCK_PRODUCTS, Product } from '../data/mockProducts';

// Helper to wrap Supabase operations with a fast 1.5-second timeout threshold.
// If the sandbox database is sleeping, offline, or blocked, it drops the query
// and triggers the local storage fallback instantly instead of hanging the UI.
const withTimeout = (promise: any, ms: number = 1500): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Database query timed out"));
    }, ms);

    Promise.resolve(promise)
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
};

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  seller_id: string;
  image_url: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_city: string;
  customer_pincode: string;
  payment_method: 'cod' | 'upi';
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  items: OrderItem[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'seller';
  phone?: string;
  address?: string;
  city?: string;
  pincode?: string;
  seller_id?: string; // If seller, represents their seller ID
}

// Default mock profiles for the demo
const DEFAULT_CUSTOMER: UserProfile = {
  id: "cust-1",
  name: "Anjali Nair",
  email: "anjali@example.com",
  role: "customer",
  phone: "9876543210",
  address: "House No 42, Green Gardens, Kakkanad",
  city: "Kochi",
  pincode: "682030"
};

const DEFAULT_SELLER: UserProfile = {
  id: "seller-5",
  name: "Malabar Crunch Snacks",
  email: "seller@malabarsnacks.com",
  role: "seller",
  phone: "9447123456",
  address: "Snacks Highway Junction, Calicut",
  city: "Kozhikode",
  pincode: "673001",
  seller_id: "seller-5"
};

// Seed mock orders
const SEED_ORDERS: Order[] = [
  {
    id: "ord-101",
    customer_id: "cust-1",
    customer_name: "Anjali Nair",
    customer_phone: "9876543210",
    customer_address: "House No 42, Green Gardens, Kakkanad",
    customer_city: "Kochi",
    customer_pincode: "682030",
    payment_method: "upi",
    total_amount: 1297, // (249 * 2) + 799 = 1297
    status: "delivered",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: "item-1",
        product_id: "prod-5",
        product_name: "Crisp Kerala Banana Chips (Coconut Oil Fried)",
        price: 249,
        quantity: 2,
        seller_id: "seller-5",
        image_url: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "item-2",
        product_id: "prod-2",
        product_name: "Traditional Handloom Double Mundu",
        price: 799,
        quantity: 1,
        seller_id: "seller-2",
        image_url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80"
      }
    ]
  },
  {
    id: "ord-102",
    customer_id: "cust-9",
    customer_name: "Rohan Kurup",
    customer_phone: "9988776655",
    customer_address: "Anugraha House, East Fort",
    customer_city: "Trivandrum",
    customer_pincode: "695023",
    payment_method: "cod",
    total_amount: 2148, // 1899 + 249
    status: "pending",
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: "item-3",
        product_id: "prod-1",
        product_name: "Premium Kerala Kasavu Saree",
        price: 1899,
        quantity: 1,
        seller_id: "seller-1",
        image_url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "item-4",
        product_id: "prod-5",
        product_name: "Crisp Kerala Banana Chips (Coconut Oil Fried)",
        price: 249,
        quantity: 1,
        seller_id: "seller-5",
        image_url: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=600&q=80"
      }
    ]
  }
];

// Helper to initialize local storage
const initLocalStorage = () => {
  if (!localStorage.getItem('onam_products')) {
    localStorage.setItem('onam_products', JSON.stringify(MOCK_PRODUCTS));
  }
  if (!localStorage.getItem('onam_orders')) {
    localStorage.setItem('onam_orders', JSON.stringify(SEED_ORDERS));
  }
};

// Initialize right away
initLocalStorage();

// Service functions
export const dbService = {
  // PRODUCTS
  async getProducts(): Promise<Product[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await withTimeout(
          supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })
        );
        if (!error && data) return data;
        console.warn("Supabase fetch failed, falling back to localStorage", error);
      } catch (e) {
        console.warn("Supabase products fetch network error, falling back to localStorage", e);
      }
    }
    const local = localStorage.getItem('onam_products');
    return local ? JSON.parse(local) : MOCK_PRODUCTS;
  },

  async getProductById(id: string): Promise<Product | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await withTimeout(
          supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single()
        );
        if (!error && data) return data;
      } catch (e) {
        console.warn("Supabase product by id fetch network error, falling back to localStorage", e);
      }
    }
    const products = await this.getProducts();
    return products.find(p => p.id === id) || null;
  },

  async saveProduct(product: Omit<Product, 'id' | 'created_at'> & { id?: string }): Promise<Product> {
    const isNew = !product.id;
    const finalProduct: Product = {
      ...product,
      id: product.id || `prod-${Date.now()}`,
      created_at: product.id ? (await this.getProductById(product.id))?.created_at || new Date().toISOString() : new Date().toISOString(),
      rating: product.rating ?? 5.0,
      reviews_count: product.reviews_count ?? 0,
      is_active: product.is_active ?? true
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await withTimeout(
          supabase
            .from('products')
            .upsert(finalProduct)
            .select()
            .single()
        );
        if (!error && data) return data;
        console.warn("Supabase save failed, falling back to localStorage", error);
      } catch (e) {
        console.warn("Supabase product save network error, falling back to localStorage", e);
      }
    }

    const products = await this.getProducts();
    let updatedProducts: Product[];
    if (isNew) {
      updatedProducts = [finalProduct, ...products];
    } else {
      updatedProducts = products.map(p => p.id === finalProduct.id ? finalProduct : p);
    }
    localStorage.setItem('onam_products', JSON.stringify(updatedProducts));
    localStorage.setItem('onam_products_cache', JSON.stringify(updatedProducts));
    return finalProduct;
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await withTimeout(
          supabase
            .from('products')
            .delete()
            .eq('id', id)
        );
        if (!error) return true;
        console.warn("Supabase delete failed, falling back to localStorage", error);
      } catch (e) {
        console.warn("Supabase product delete network error, falling back to localStorage", e);
      }
    }

    const products = await this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    localStorage.setItem('onam_products', JSON.stringify(filtered));
    localStorage.setItem('onam_products_cache', JSON.stringify(filtered));
    return true;
  },

  // ORDERS
  async getOrders(): Promise<Order[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await withTimeout(
          supabase
            .from('orders')
            .select('*, order_items(*)')
            .order('created_at', { ascending: false })
        );
        if (!error && data) {
          // Map Supabase layout to client layout
          const mapped = data.map((o: any) => ({
            ...o,
            items: o.order_items || []
          }));
          // Cache the orders locally
          localStorage.setItem('onam_orders_cache', JSON.stringify(mapped));
          return mapped;
        }
        console.warn("Supabase orders fetch failed, falling back to localStorage", error);
      } catch (e) {
        console.warn("Supabase orders fetch network error, falling back to localStorage", e);
      }
    }
    const local = localStorage.getItem('onam_orders');
    return local ? JSON.parse(local) : SEED_ORDERS;
  },

  async getOrderById(id: string): Promise<Order | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await withTimeout(
          supabase
            .from('orders')
            .select('*, order_items(*)')
            .eq('id', id)
            .single()
        );
        if (!error && data) {
          return {
            ...data,
            items: data.order_items || []
          };
        }
      } catch (e) {
        console.warn("Supabase order fetch network error, falling back to localStorage", e);
      }
    }
    const orders = await this.getOrders();
    return orders.find(o => o.id === id) || null;
  },

  async createOrder(
    orderDetails: Omit<Order, 'id' | 'created_at' | 'status' | 'total_amount' | 'items' | 'customer_id'>,
    cartItems: { product: Product; quantity: number }[]
  ): Promise<Order> {
    const orderId = `ord-${Math.floor(100 + Math.random() * 900)}`;
    const currentUser = this.getCurrentUser();
    
    // Calculate total
    const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const shipping = subtotal > 1000 ? 0 : 50;
    const totalAmount = subtotal + shipping;

    const items: OrderItem[] = cartItems.map((item, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      product_id: item.product.id,
      product_name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      seller_id: item.product.seller_id,
      image_url: item.product.image_url
    }));

    const newOrder: Order = {
      ...orderDetails,
      id: orderId,
      customer_id: currentUser?.id || 'guest',
      total_amount: totalAmount,
      status: 'pending',
      created_at: new Date().toISOString(),
      items
    };

    let useSupabase = isSupabaseConfigured && supabase;

    // 1. Verify stock availability before placing order (Optimized: single bulk query)
    let fetchedProductsData: { id: string; stock: number; name: string }[] | null = null;
    
    if (useSupabase) {
      try {
        const productIds = cartItems.map(item => item.product.id);
        const { data, error } = await withTimeout(
          supabase!
            .from('products')
            .select('id, stock, name')
            .in('id', productIds)
        );
        
        if (error) throw error;
        
        if (data) {
          fetchedProductsData = data;
          for (const item of cartItems) {
            const dbProd = data.find((p: any) => p.id === item.product.id);
            if (dbProd) {
              if (dbProd.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${dbProd.name}. Only ${dbProd.stock} units available.`);
              }
            }
          }
        }
      } catch (err: any) {
        console.warn("Supabase stock check failed, falling back to local storage checks", err);
        useSupabase = null;
      }
    }

    if (!useSupabase) {
      const products = await this.getProducts();
      for (const item of cartItems) {
        const prod = products.find(p => p.id === item.product.id);
        if (prod && prod.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${prod.name}. Only ${prod.stock} units available.`);
        }
      }
    }

    // 2. Decrease stock levels (local fallback always runs to keep states synchronized)
    const products = await this.getProducts();
    const updatedProducts = products.map((p: Product) => {
      const cartItem = cartItems.find(item => item.product.id === p.id);
      if (cartItem) {
        return {
          ...p,
          stock: Math.max(0, p.stock - cartItem.quantity)
        };
      }
      return p;
    });
    localStorage.setItem('onam_products', JSON.stringify(updatedProducts));
    localStorage.setItem('onam_products_cache', JSON.stringify(updatedProducts));

    // 3. Supabase order placement
    if (useSupabase) {
      try {
        // Create order row
        const { data: dbOrder, error: orderErr } = await withTimeout(
          supabase!
            .from('orders')
            .insert({
              id: orderId,
              customer_id: newOrder.customer_id,
              customer_name: newOrder.customer_name,
              customer_phone: newOrder.customer_phone,
              customer_address: newOrder.customer_address,
              customer_city: newOrder.customer_city,
              customer_pincode: newOrder.customer_pincode,
              payment_method: newOrder.payment_method,
              total_amount: newOrder.total_amount,
              status: newOrder.status
            })
            .select()
            .single()
        );

        if (orderErr) throw orderErr;

        if (dbOrder) {
          // Create order items rows
          const dbItems = items.map(item => ({
            order_id: orderId,
            product_id: item.product_id,
            product_name: item.product_name,
            price: item.price,
            quantity: item.quantity,
            seller_id: item.seller_id,
            image_url: item.image_url
          }));
          
          const { error: itemsErr } = await withTimeout(
            supabase!.from('order_items').insert(dbItems)
          );
          if (itemsErr) {
            console.error("Supabase order_items insert failed:", itemsErr);
            // Rollback order row if items fail
            await withTimeout(supabase!.from('orders').delete().eq('id', orderId));
            throw itemsErr;
          }

          // Decrease stock on Supabase products table (Optimized: run updates in parallel)
          const supabaseClient = supabase!;
          const stockUpdates = cartItems.map(async (item) => {
            const dbProd = fetchedProductsData?.find(p => p.id === item.product.id);
            const currentStock = dbProd ? dbProd.stock : item.product.stock;
            
            return withTimeout(
              supabaseClient
                .from('products')
                .update({ stock: Math.max(0, currentStock - item.quantity) })
                .eq('id', item.product.id)
            );
          });
          
          const updateResults = await Promise.all(stockUpdates);
          updateResults.forEach((res, index) => {
            if (res.error) {
              console.warn(`Failed to update Supabase stock for product ${cartItems[index].product.id}`, res.error);
            }
          });

          // Sync cache so checkout reflects immediately
          const cachedOrders = localStorage.getItem('onam_orders_cache');
          if (cachedOrders) {
            try {
              const parsed = JSON.parse(cachedOrders) as Order[];
              localStorage.setItem('onam_orders_cache', JSON.stringify([newOrder, ...parsed]));
            } catch (e) {}
          }

          return newOrder;
        }
      } catch (err: any) {
        console.warn("Supabase order placement transaction failed, executing local fallback", err);
      }
    }

    const orders = await this.getOrders();
    const updatedOrders = [newOrder, ...orders];
    localStorage.setItem('onam_orders', JSON.stringify(updatedOrders));
    localStorage.setItem('onam_orders_cache', JSON.stringify(updatedOrders));
    return newOrder;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await withTimeout(
          supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId)
            .select()
            .single()
        );
        
        if (error) throw error;
        
        if (data) {
          // Retrieve order details to get items for stock restoration on cancellation
          const order = await this.getOrderById(orderId);
          if (order) {
            order.status = status;
            
            if (status === 'cancelled' && order.items) {
              const stockRestorations = order.items.map(async (item) => {
                try {
                  const { data: prod } = await withTimeout(
                    supabase!
                      .from('products')
                      .select('stock')
                      .eq('id', item.product_id)
                      .single()
                  );
                  
                  if (prod) {
                    await withTimeout(
                      supabase!
                        .from('products')
                        .update({ stock: prod.stock + item.quantity })
                        .eq('id', item.product_id)
                    );
                  }
                } catch (e) {
                  console.warn("Stock restoration failed for product", item.product_id, e);
                }
              });
              await Promise.all(stockRestorations);
            }

            // Sync locally cached orders
            const cachedOrders = localStorage.getItem('onam_orders_cache');
            if (cachedOrders) {
              try {
                const parsed = JSON.parse(cachedOrders) as Order[];
                const updated = parsed.map(o => o.id === orderId ? { ...o, status } : o);
                localStorage.setItem('onam_orders_cache', JSON.stringify(updated));
              } catch (e) {}
            }
            
            return order;
          }
        }
      } catch (err: any) {
        console.warn("Supabase order update failed, falling back to localStorage", err);
      }
    }

    const orders = await this.getOrders();
    let updatedOrder: Order | null = null;
    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        updatedOrder = { ...o, status };
        return updatedOrder;
      }
      return o;
    });

    // If order is cancelled, return items back to stock
    if (status === 'cancelled') {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        const products = await this.getProducts();
        const revertedProducts = products.map(p => {
          const orderedItem = order.items.find(item => item.product_id === p.id);
          if (orderedItem) {
            return {
              ...p,
              stock: p.stock + orderedItem.quantity
            };
          }
          return p;
        });
        localStorage.setItem('onam_products', JSON.stringify(revertedProducts));
        localStorage.setItem('onam_products_cache', JSON.stringify(revertedProducts));
      }
    }

    localStorage.setItem('onam_orders', JSON.stringify(updatedOrders));
    return updatedOrder;
  },

  // USERS / AUTHENTICATION
  getCurrentUser(): UserProfile | null {
    const local = localStorage.getItem('onam_current_user');
    return local ? JSON.parse(local) : null;
  },

  setCurrentUser(user: UserProfile): void {
    localStorage.setItem('onam_current_user', JSON.stringify(user));
  },

  switchRole(role: 'customer' | 'seller'): UserProfile {
    const current = this.getCurrentUser();
    let updated: UserProfile;
    if (role === 'customer') {
      updated = {
        ...(current || DEFAULT_CUSTOMER),
        id: "cust-1",
        role: 'customer',
        name: current?.name || DEFAULT_CUSTOMER.name,
        email: current?.email || DEFAULT_CUSTOMER.email
      };
    } else {
      updated = {
        ...(current || DEFAULT_SELLER),
        id: "seller-5",
        role: 'seller',
        name: current?.name && current.role === 'seller' ? current.name : DEFAULT_SELLER.name,
        email: current?.email && current.role === 'seller' ? current.email : DEFAULT_SELLER.email,
        seller_id: "seller-5"
      };
    }
    this.setCurrentUser(updated);
    return updated;
  },

  logout(): void {
    localStorage.removeItem('onam_current_user');
  }
};
