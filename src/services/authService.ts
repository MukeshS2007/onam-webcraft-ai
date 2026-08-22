import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { dbService, UserProfile } from './db';

export const authService = {
  async signUp(email: string, name: string, phone: string, password: string): Promise<UserProfile> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error("Failed to register account.");
      }

      const userId = data.user.id;
      const profilePayload = {
        id: userId,
        email,
        name,
        phone,
        role: 'customer' // Public signups default to customer
      };

      const { error: profileErr } = await supabase
        .from('profiles')
        .insert(profilePayload);

      if (profileErr) {
        console.error("Failed to write to public.profiles:", profileErr);
      }

      const profile: UserProfile = {
        id: userId,
        name,
        email,
        role: 'customer',
        phone,
        address: '',
        city: '',
        pincode: ''
      };

      dbService.setCurrentUser(profile);
      return profile;
    }

    // Local fallback signup
    const userId = `cust-${Date.now()}`;
    const profile: UserProfile = {
      id: userId,
      name,
      email,
      role: 'customer',
      phone,
      address: '',
      city: '',
      pincode: ''
    };
    dbService.setCurrentUser(profile);
    return profile;
  },

  async signIn(email: string, password: string, selectedRole: 'customer' | 'seller'): Promise<UserProfile> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          throw new Error(error.message);
        }

        if (!data.user) {
          throw new Error("User account not found.");
        }

        // Fetch profile
        const { data: profile, error: profileErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileErr || !profile) {
          const fallbackProfile: UserProfile = {
            id: data.user.id,
            name: data.user.user_metadata?.name || 'User',
            email,
            role: selectedRole,
            phone: data.user.user_metadata?.phone || '',
            address: '',
            city: '',
            pincode: ''
          };
          dbService.setCurrentUser(fallbackProfile);
          return fallbackProfile;
        }

        if (selectedRole === 'seller' && profile.role !== 'seller') {
          throw new Error("Access denied. This account does not have seller permissions.");
        }

        const mappedProfile: UserProfile = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role as 'customer' | 'seller',
          phone: profile.phone || '',
          address: profile.address || '',
          city: profile.city || '',
          pincode: profile.pincode || '',
          seller_id: profile.role === 'seller' ? profile.id : undefined
        };

        dbService.setCurrentUser(mappedProfile);
        return mappedProfile;
      } catch (err: any) {
        if (err.message && err.message.includes("Access denied")) {
          throw err;
        }
        
        // Sandbox fallback logic for seed accounts
        if (email === 'seller@malabarsnacks.com') {
          const sellerProfile: UserProfile = {
            id: 'f8c3de3d-ecad-48b4-934c-687f174c8491', // Match public.sellers seed
            name: "Malabar Crunch Snacks",
            email: "seller@malabarsnacks.com",
            role: "seller",
            phone: "9447123456",
            address: "Snacks Highway Junction, Calicut",
            city: "Kozhikode",
            pincode: "673001",
            seller_id: 'f8c3de3d-ecad-48b4-934c-687f174c8491'
          };
          dbService.setCurrentUser(sellerProfile);
          return sellerProfile;
        } else if (email === 'anjali@example.com') {
          const customerProfile: UserProfile = {
            id: 'd3b07384-d113-4956-b51e-6134a413554a', // Match public.profiles seed
            name: "Anjali Nair",
            email: "anjali@example.com",
            role: "customer",
            phone: "9876543210",
            address: "House No 42, Green Gardens, Kakkanad",
            city: "Kochi",
            pincode: "682030"
          };
          dbService.setCurrentUser(customerProfile);
          return customerProfile;
        }
        throw err;
      }
    }

    // Full local fallback
    if (selectedRole === 'seller') {
      const sellerProfile: UserProfile = {
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
      dbService.setCurrentUser(sellerProfile);
      return sellerProfile;
    } else {
      const customerProfile: UserProfile = {
        id: "cust-1",
        name: "Anjali Nair",
        email: "anjali@example.com",
        role: "customer",
        phone: "9876543210",
        address: "House No 42, Green Gardens, Kakkanad",
        city: "Kochi",
        pincode: "682030"
      };
      dbService.setCurrentUser(customerProfile);
      return customerProfile;
    }
  },

  async signOut(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('onam_current_user');
  },

  async getCurrentUser(): Promise<any> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.auth.getUser();
      return data.user;
    }
    return null;
  },

  async getCurrentProfile(): Promise<UserProfile | null> {
    const user = await this.getCurrentUser();
    if (user && isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (!error && data) {
          return {
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role as 'customer' | 'seller',
            phone: data.phone || '',
            address: data.address || '',
            city: data.city || '',
            pincode: data.pincode || '',
            seller_id: data.role === 'seller' ? data.id : undefined
          };
        }
      } catch (e) {
        console.warn("Could not retrieve profile from Supabase", e);
      }
    }
    return dbService.getCurrentUser();
  }
};
export default authService;
