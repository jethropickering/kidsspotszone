import { create } from 'zustand';
import { supabase, authHelpers } from '../services/supabase';

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  error: null,

  // Initialize auth state
  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        set({ user: session.user, profile, loading: false });
      } else {
        set({ user: null, profile: null, loading: false });
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          set({ user: session.user, profile });
        } else {
          set({ user: null, profile: null });
        }
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ loading: false, error: error.message });
    }
  },

  // Sign up
  signUp: async (email, password, userData) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await authHelpers.signUp(email, password, userData);

      if (error) throw error;

      // Create profile
      if (data.user) {
        await supabase.from('profiles').insert([{
          id: data.user.id,
          email: data.user.email,
          full_name: userData.full_name,
          role: userData.role || 'parent'
        }]);
      }

      set({ loading: false });
      return { data, error: null };
    } catch (error) {
      set({ loading: false, error: error.message });
      return { data: null, error };
    }
  },

  // Sign in
  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await authHelpers.signIn(email, password);

      if (error) throw error;

      set({ loading: false });
      return { data, error: null };
    } catch (error) {
      set({ loading: false, error: error.message });
      return { data: null, error };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      set({ loading: true, error: null });
      const { error } = await authHelpers.signOut();

      if (error) throw error;

      set({ user: null, profile: null, loading: false });
      return { error: null };
    } catch (error) {
      set({ loading: false, error: error.message });
      return { error };
    }
  },

  // Update profile
  updateProfile: async (updates) => {
    try {
      const { user } = get();
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      set({ profile: data });
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Check if user is admin
  isAdmin: () => {
    const { profile } = get();
    return profile?.role === 'admin';
  },

  // Check if user is venue owner
  isVenueOwner: () => {
    const { profile } = get();
    return profile?.role === 'venue_owner' || profile?.role === 'admin';
  }
}));
