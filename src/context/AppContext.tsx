import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../data/mockProducts';
import { dbService, Order, UserProfile } from '../services/db';
import { authService } from '../services/authService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  user: UserProfile | null;
  switchUserRole: (role: 'customer' | 'seller') => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  
  // Auth methods
  login: (email: string, password: string, role: 'customer' | 'seller') => Promise<void>;
  register: (email: string, name: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [user, setUser] = useState<UserProfile | null>(null);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);

  // Toast state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load initial auth
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const profile = await authService.getCurrentProfile();
        if (profile) {
          setUser(profile);
        } else {
          const currentUser = dbService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (err) {
        console.warn("Failed to restore session, using local cache", err);
        const currentUser = dbService.getCurrentUser();
        setUser(currentUser);
      }
    };
    restoreSession();

    // Load cart from local storage if available
    const savedCart = localStorage.getItem('onam_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Sync cart to local storage
  useEffect(() => {
    localStorage.setItem('onam_cart', JSON.stringify(cart));
  }, [cart]);

  // Auth functions
  const switchUserRole = (role: 'customer' | 'seller') => {
    const updatedUser = dbService.switchRole(role);
    setUser(updatedUser);
    addToast(`Switched to ${role === 'seller' ? 'Seller Dashboard' : 'Customer Store'}`, 'success');
  };

  const login = async (email: string, password: string, role: 'customer' | 'seller') => {
    const profile = await authService.signIn(email, password, role);
    setUser(profile);
  };

  const register = async (email: string, name: string, phone: string, password: string) => {
    const profile = await authService.signUp(email, name, phone, password);
    setUser(profile);
  };

  const logout = async () => {
    await authService.signOut();
    setUser(null);
    addToast("Logged out successfully", "info");
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...profile };
    dbService.setCurrentUser(updated);
    setUser(updated);

    if (isSupabaseConfigured && supabase) {
      supabase.from('profiles')
        .update({
          name: updated.name,
          phone: updated.phone,
          address: updated.address,
          city: updated.city,
          pincode: updated.pincode
        })
        .eq('id', updated.id)
        .then(({ error }) => {
          if (error) console.error("Failed to update profile on Supabase:", error);
        });
    }

    addToast("Profile updated successfully!", "success");
  };

  // Toast functions
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto-remove toast after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart functions
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      
      // Stock check
      const currentQuantityInCart = existing ? existing.quantity : 0;
      if (currentQuantityInCart + quantity > product.stock) {
        addToast(`Cannot add. Only ${product.stock} items left in stock.`, 'error');
        return prev;
      }

      addToast(`Added ${product.name} to cart`, 'success');

      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const item = prev.find(i => i.product.id === productId);
      if (item) {
        addToast(`Removed ${item.product.name} from cart`, 'info');
      }
      return prev.filter((item) => item.product.id !== productId);
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) => {
      const item = prev.find((i) => i.product.id === productId);
      if (!item) return prev;

      if (quantity > item.product.stock) {
        addToast(`Only ${item.product.stock} items available in stock.`, 'error');
        return prev.map((i) =>
          i.product.id === productId ? { ...i, quantity: item.product.stock } : i
        );
      }

      return prev.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      );
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('onam_cart');
  };

  // Calculations
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        user,
        switchUserRole,
        updateProfile,
        login,
        register,
        logout,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
