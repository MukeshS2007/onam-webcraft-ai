import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MOCK_PRODUCTS, Product } from '../data/mockProducts';

export const productService = {
  async getProducts(): Promise<Product[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, sellers(store_name)')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((p: any) => ({
            ...p,
            seller_name: p.sellers?.store_name || p.seller_name || 'Local Seller'
          })) as Product[];
        }

        // Fallback if join on sellers table fails due to foreign key differences
        const { data: rawData, error: rawError } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (!rawError && rawData) {
          return rawData as Product[];
        }
        console.warn("Supabase products fetch failed. Falling back to local storage.", error || rawError);
      } catch (err) {
        console.error("Exception during Supabase fetch. Falling back to local storage.", err);
      }
    }
    // Local fallback
    const local = localStorage.getItem('onam_products');
    const products: Product[] = local ? JSON.parse(local) : MOCK_PRODUCTS;
    return products.filter(p => p.is_active);
  },

  async getProductById(id: string): Promise<Product | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, sellers(store_name)')
          .eq('id', id)
          .single();

        if (!error && data) {
          return {
            ...data,
            seller_name: data.sellers?.store_name || data.seller_name || 'Local Seller'
          } as Product;
        }

        // Fallback without sellers join
        const { data: rawData, error: rawError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (!rawError && rawData) {
          return rawData as Product;
        }
      } catch (err) {
        console.error("Exception during getProductById fetch.", err);
      }
    }
    const products = await this.getProducts();
    return products.find(p => p.id === id) || null;
  },

  async searchProducts(searchTerm: string): Promise<Product[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, sellers(store_name)')
          .eq('is_active', true)
          .ilike('name', `%${searchTerm}%`)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((p: any) => ({
            ...p,
            seller_name: p.sellers?.store_name || p.seller_name || 'Local Seller'
          })) as Product[];
        }
      } catch (err) {
        console.error("Exception during searchProducts fetch.", err);
      }
    }
    const products = await this.getProducts();
    const query = searchTerm.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );
  },

  async getProductsByCategory(category: string): Promise<Product[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, sellers(store_name)')
          .eq('is_active', true)
          .eq('category', category)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((p: any) => ({
            ...p,
            seller_name: p.sellers?.store_name || p.seller_name || 'Local Seller'
          })) as Product[];
        }
      } catch (err) {
        console.error("Exception during getProductsByCategory fetch.", err);
      }
    }
    const products = await this.getProducts();
    return products.filter(p => p.category === category);
  }
};
export default productService;
