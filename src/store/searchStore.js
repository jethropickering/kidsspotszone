import { create } from 'zustand';
import { db } from '../services/supabase';
import { getCurrentPosition } from '../utils/geolocation';

export const useSearchStore = create((set, get) => ({
  // Search state
  venues: [],
  loading: false,
  error: null,

  // Filters
  filters: {
    category: null,
    city: null,
    state: null,
    ageMin: null,
    ageMax: null,
    indoor: null,
    priceRange: null,
    search: ''
  },

  // Location state
  userLocation: null,
  useGeolocation: false,

  // Pagination
  currentPage: 1,
  itemsPerPage: 20,

  // Set filters
  setFilter: (key, value) => {
    set(state => ({
      filters: { ...state.filters, [key]: value },
      currentPage: 1 // Reset to first page when filters change
    }));
    get().searchVenues();
  },

  // Clear all filters
  clearFilters: () => {
    set({
      filters: {
        category: null,
        city: null,
        state: null,
        ageMin: null,
        ageMax: null,
        indoor: null,
        priceRange: null,
        search: ''
      },
      currentPage: 1
    });
    get().searchVenues();
  },

  // Get user location
  getUserLocation: async () => {
    try {
      const position = await getCurrentPosition();
      set({
        userLocation: {
          latitude: position.latitude,
          longitude: position.longitude
        },
        useGeolocation: true
      });
      get().searchVenues();
    } catch (error) {
      console.error('Error getting user location:', error);
      set({ error: 'Unable to get your location. Please check your browser permissions.' });
    }
  },

  // Search venues
  searchVenues: async () => {
    try {
      set({ loading: true, error: null });
      const { filters, userLocation, useGeolocation } = get();

      let data;
      let error;

      // Use geolocation search if enabled
      if (useGeolocation && userLocation) {
        const result = await db.getNearbyVenues(
          userLocation.latitude,
          userLocation.longitude,
          10, // 10km radius
          filters
        );
        data = result.data;
        error = result.error;
      } else {
        // Regular search
        const result = await db.getVenues(filters);
        data = result.data;
        error = result.error;
      }

      if (error) throw error;

      set({ venues: data || [], loading: false });
    } catch (error) {
      console.error('Error searching venues:', error);
      set({ loading: false, error: error.message });
    }
  },

  // Get venue by slug
  getVenueBySlug: async (slug) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await db.getVenueBySlug(slug);

      if (error) throw error;

      set({ loading: false });
      return data;
    } catch (error) {
      console.error('Error getting venue:', error);
      set({ loading: false, error: error.message });
      return null;
    }
  },

  // Set page
  setPage: (page) => {
    set({ currentPage: page });
  },

  // Get paginated venues
  getPaginatedVenues: () => {
    const { venues, currentPage, itemsPerPage } = get();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return venues.slice(startIndex, endIndex);
  },

  // Get total pages
  getTotalPages: () => {
    const { venues, itemsPerPage } = get();
    return Math.ceil(venues.length / itemsPerPage);
  }
}));
