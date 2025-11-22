import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Auth helpers
export const authHelpers = {
  signUp: async (email, password, userData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  resetPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
  }
};

// Database helpers
export const db = {
  // Venues
  getVenues: async (filters = {}) => {
    let query = supabase
      .from('venues')
      .select(`
        *,
        categories:venue_categories(category:categories(*)),
        offers(*, count),
        reviews(rating, count)
      `)
      .eq('status', 'published');

    if (filters.category) {
      query = query.contains('category_ids', [filters.category]);
    }

    if (filters.city) {
      query = query.eq('city_slug', filters.city);
    }

    if (filters.state) {
      query = query.eq('state_id', filters.state);
    }

    if (filters.ageMin || filters.ageMax) {
      query = query.gte('age_min', filters.ageMin || 0);
      query = query.lte('age_max', filters.ageMax || 18);
    }

    if (filters.indoor !== undefined) {
      query = query.eq('indoor', filters.indoor);
    }

    if (filters.priceRange) {
      query = query.eq('price_range', filters.priceRange);
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    // Order by: promoted first, then by rating
    query = query.order('is_promoted', { ascending: false });
    query = query.order('average_rating', { ascending: false });

    const { data, error } = await query;
    return { data, error };
  },

  getVenueBySlug: async (slug) => {
    const { data, error } = await supabase
      .from('venues')
      .select(`
        *,
        categories:venue_categories(category:categories(*)),
        offers(*),
        reviews(*, user:profiles(*)),
        photos:venue_photos(*)
      `)
      .eq('slug', slug)
      .single();

    return { data, error };
  },

  getNearbyVenues: async (lat, lng, radiusKm = 10, filters = {}) => {
    // Using PostGIS for geospatial queries
    const { data, error } = await supabase.rpc('nearby_venues', {
      lat,
      lng,
      radius_km: radiusKm,
      category_filter: filters.category || null,
      age_min_filter: filters.ageMin || null,
      age_max_filter: filters.ageMax || null
    });

    return { data, error };
  },

  createVenue: async (venueData) => {
    const { data, error } = await supabase
      .from('venues')
      .insert([venueData])
      .select()
      .single();

    return { data, error };
  },

  updateVenue: async (id, venueData) => {
    const { data, error } = await supabase
      .from('venues')
      .update(venueData)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  // Reviews
  createReview: async (reviewData) => {
    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select()
      .single();

    return { data, error };
  },

  getVenueReviews: async (venueId) => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, user:profiles(*)')
      .eq('venue_id', venueId)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  // Offers
  createOffer: async (offerData) => {
    const { data, error } = await supabase
      .from('offers')
      .insert([offerData])
      .select()
      .single();

    return { data, error };
  },

  getActiveOffers: async (venueId) => {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .eq('venue_id', venueId)
      .eq('is_active', true)
      .gte('expires_at', new Date().toISOString())
      .order('is_promoted', { ascending: false });

    return { data, error };
  },

  // Favorites
  toggleFavorite: async (userId, venueId) => {
    // Check if favorite exists
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('venue_id', venueId)
      .single();

    if (existing) {
      // Remove favorite
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', existing.id);
      return { removed: true, error };
    } else {
      // Add favorite
      const { data, error } = await supabase
        .from('favorites')
        .insert([{ user_id: userId, venue_id: venueId }])
        .select()
        .single();
      return { data, error };
    }
  },

  getUserFavorites: async (userId) => {
    const { data, error } = await supabase
      .from('favorites')
      .select('*, venue:venues(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  // Location pages (SEO content)
  getLocationPage: async (type, slug) => {
    const { data, error } = await supabase
      .from('location_pages')
      .select('*')
      .eq('type', type)
      .eq('slug', slug)
      .single();

    return { data, error };
  },

  updateLocationPage: async (id, pageData) => {
    const { data, error } = await supabase
      .from('location_pages')
      .update(pageData)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  // Newsletter
  subscribeNewsletter: async (email, name = null) => {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email, name }])
      .select()
      .single();

    return { data, error };
  },

  // Claims
  createClaim: async (claimData) => {
    const { data, error } = await supabase
      .from('venue_claims')
      .insert([claimData])
      .select()
      .single();

    return { data, error };
  },

  getPendingClaims: async () => {
    const { data, error } = await supabase
      .from('venue_claims')
      .select('*, venue:venues(*), user:profiles(*)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    return { data, error };
  },

  approveClaim: async (claimId, venueId, userId) => {
    // Update claim status
    await supabase
      .from('venue_claims')
      .update({ status: 'approved', approved_at: new Date().toISOString() })
      .eq('id', claimId);

    // Update venue owner
    const { data, error } = await supabase
      .from('venues')
      .update({ owner_id: userId, claimed: true })
      .eq('id', venueId)
      .select()
      .single();

    return { data, error };
  },

  rejectClaim: async (claimId, reason) => {
    const { data, error } = await supabase
      .from('venue_claims')
      .update({
        status: 'rejected',
        rejection_reason: reason,
        rejected_at: new Date().toISOString()
      })
      .eq('id', claimId)
      .select()
      .single();

    return { data, error };
  }
};
