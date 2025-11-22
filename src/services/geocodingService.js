/**
 * Geocoding Service
 *
 * Provides address geocoding (address -> coordinates) and reverse geocoding
 * (coordinates -> address) using Nominatim (OpenStreetMap's free geocoding API)
 *
 * Alternative: Google Geocoding API (requires API key and billing)
 * - More accurate
 * - Better address parsing
 * - Costs: $5 per 1,000 requests
 *
 * For now, using Nominatim (free, unlimited) is perfect for launch!
 */

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

// Required by Nominatim API terms
const USER_AGENT = 'KidsSportsZone/1.0 (contact: hello@kidssportszone.com.au)';

class GeocodingService {
  /**
   * Geocode an address to coordinates
   * @param {string} address - Full address string
   * @param {Object} options - Additional options
   * @param {string} options.city - City name (for better results)
   * @param {string} options.state - State name
   * @param {string} options.country - Country (default: Australia)
   * @returns {Promise<Object>} { lat, lon, display_name, ... }
   */
  async geocodeAddress(address, options = {}) {
    try {
      const query = this.buildQuery(address, options);

      const response = await fetch(
        `${NOMINATIM_BASE_URL}/search?${query}`,
        {
          headers: {
            'User-Agent': USER_AGENT,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.statusText}`);
      }

      const results = await response.json();

      if (results.length === 0) {
        return { error: 'Address not found', results: [] };
      }

      // Return the best match
      const best = results[0];

      return {
        latitude: parseFloat(best.lat),
        longitude: parseFloat(best.lon),
        display_name: best.display_name,
        address: best.address,
        place_id: best.place_id,
        importance: best.importance,
        raw: best,
        alternatives: results.slice(1, 5).map(r => ({
          latitude: parseFloat(r.lat),
          longitude: parseFloat(r.lon),
          display_name: r.display_name,
        })),
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      return { error: error.message };
    }
  }

  /**
   * Reverse geocode coordinates to address
   * @param {number} latitude
   * @param {number} longitude
   * @returns {Promise<Object>} Address details
   */
  async reverseGeocode(latitude, longitude) {
    try {
      const response = await fetch(
        `${NOMINATIM_BASE_URL}/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        {
          headers: {
            'User-Agent': USER_AGENT,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Reverse geocoding failed: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.error) {
        return { error: result.error };
      }

      return {
        display_name: result.display_name,
        address: result.address,
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        raw: result,
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return { error: error.message };
    }
  }

  /**
   * Geocode venue data during submission
   * Extracts coordinates from address fields
   * @param {Object} venueData
   * @param {string} venueData.street_address
   * @param {string} venueData.suburb
   * @param {string} venueData.state
   * @param {string} venueData.postcode
   * @returns {Promise<Object>} Updated venue data with latitude/longitude
   */
  async geocodeVenue(venueData) {
    const address = `${venueData.street_address}, ${venueData.suburb}, ${venueData.state} ${venueData.postcode}, Australia`;

    const result = await this.geocodeAddress(address, {
      city: venueData.suburb,
      state: venueData.state,
      country: 'Australia',
    });

    if (result.error) {
      throw new Error(`Could not geocode address: ${result.error}`);
    }

    return {
      ...venueData,
      latitude: result.latitude,
      longitude: result.longitude,
      geocoded_address: result.display_name,
    };
  }

  /**
   * Validate coordinates are within Australia
   * @param {number} latitude
   * @param {number} longitude
   * @returns {boolean}
   */
  isValidAustralianCoordinates(latitude, longitude) {
    // Australia bounding box (approximate)
    const bounds = {
      minLat: -44, // Tasmania
      maxLat: -10, // Torres Strait
      minLon: 113, // Western Australia
      maxLon: 154, // Eastern Queensland
    };

    return (
      latitude >= bounds.minLat &&
      latitude <= bounds.maxLat &&
      longitude >= bounds.minLon &&
      longitude <= bounds.maxLon
    );
  }

  /**
   * Build query string for geocoding request
   * @private
   */
  buildQuery(address, options = {}) {
    const params = new URLSearchParams({
      q: address,
      format: 'json',
      addressdetails: '1',
      limit: '5',
      countrycodes: options.country === 'Australia' ? 'au' : '',
    });

    if (options.city) {
      params.append('city', options.city);
    }

    if (options.state) {
      params.append('state', options.state);
    }

    return params.toString();
  }

  /**
   * Get suggestions for address autocomplete
   * @param {string} input - Partial address input
   * @param {Object} options - Additional filters
   * @returns {Promise<Array>} Suggestions
   */
  async getAddressSuggestions(input, options = {}) {
    if (input.length < 3) {
      return [];
    }

    try {
      const query = this.buildQuery(input, {
        country: 'Australia',
        ...options,
      });

      const response = await fetch(
        `${NOMINATIM_BASE_URL}/search?${query}`,
        {
          headers: {
            'User-Agent': USER_AGENT,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Suggestions failed: ${response.statusText}`);
      }

      const results = await response.json();

      return results.map(r => ({
        label: r.display_name,
        value: r.display_name,
        latitude: parseFloat(r.lat),
        longitude: parseFloat(r.lon),
        address: r.address,
      }));
    } catch (error) {
      console.error('Address suggestions error:', error);
      return [];
    }
  }

  /**
   * Batch geocode multiple addresses (with rate limiting)
   * Nominatim allows max 1 request per second
   * @param {Array<string>} addresses - Array of address strings
   * @returns {Promise<Array>} Array of geocoding results
   */
  async batchGeocode(addresses) {
    const results = [];

    for (const address of addresses) {
      const result = await this.geocodeAddress(address);
      results.push(result);

      // Rate limiting: 1 request per second
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
  }
}

// Export singleton instance
export const geocodingService = new GeocodingService();
export default geocodingService;
