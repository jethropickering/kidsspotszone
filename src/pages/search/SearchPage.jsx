import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiSearch, FiMapPin, FiFilter, FiGrid, FiList, FiX } from 'react-icons/fi';
import { useSearchStore } from '../../store/searchStore';
import { categories } from '../../data/categories';
import { states, getAllCities } from '../../data/locations';
import VenueCard from '../../components/venue/VenueCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { generateMetaTags } from '../../utils/seo';

export default function SearchPage() {
  const {
    venues,
    loading,
    filters,
    setFilter,
    clearFilters,
    searchVenues,
    getUserLocation,
    userLocation,
    getPaginatedVenues,
    currentPage,
    setPage,
    getTotalPages
  } = useSearchStore();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState(filters.search || '');

  const cities = getAllCities();

  useEffect(() => {
    searchVenues();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilter('search', searchQuery);
  };

  const handleNearMe = async () => {
    await getUserLocation();
  };

  const handleClearFilters = () => {
    clearFilters();
    setSearchQuery('');
  };

  const paginatedVenues = getPaginatedVenues();
  const totalPages = getTotalPages();

  const metaTags = generateMetaTags({
    title: 'Search Kids Sports & Activities',
    description: 'Search and filter kids sports and activities across Australia. Find the perfect activity for your child.',
    url: '/search'
  });

  const activeFiltersCount = Object.values(filters).filter(v => v !== null && v !== '').length;

  return (
    <>
      <Helmet>
        <title>{metaTags.title}</title>
        <meta name="description" content={metaTags.description} />
      </Helmet>

      <div className="bg-warm-50 min-h-screen">
        {/* Search Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-40">
          <div className="section-container py-6">
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Find Activities for Your Kids
            </h1>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex gap-3">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for activities, venues..."
                  className="input-field pl-12"
                />
              </div>
              <button
                type="button"
                onClick={handleNearMe}
                className="btn-secondary flex items-center gap-2 whitespace-nowrap"
              >
                <FiMapPin />
                Near Me
              </button>
              <button type="submit" className="btn-primary">
                Search
              </button>
            </form>

            {/* Active Filters & View Toggle */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="btn-outline flex items-center gap-2 text-sm"
                >
                  <FiFilter />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="badge badge-primary text-xs">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-gray-600 hover:text-primary-600 flex items-center gap-1"
                  >
                    <FiX className="w-4 h-4" />
                    Clear all filters
                  </button>
                )}

                {userLocation && (
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <FiMapPin className="w-4 h-4" />
                    Showing nearby venues (10km)
                  </span>
                )}
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : 'text-gray-500'}`}
                >
                  <FiGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : 'text-gray-500'}`}
                >
                  <FiList className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="section-container py-8">
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            {showFilters && (
              <aside className="w-80 flex-shrink-0">
                <div className="card sticky top-32">
                  <h3 className="font-display font-semibold text-lg mb-4">Filters</h3>

                  {/* Category Filter */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={filters.category || ''}
                      onChange={(e) => setFilter('category', e.target.value || null)}
                      className="input-field"
                    >
                      <option value="">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.slug}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* State Filter */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <select
                      value={filters.state || ''}
                      onChange={(e) => setFilter('state', e.target.value || null)}
                      className="input-field"
                    >
                      <option value="">All States</option>
                      {states.map(state => (
                        <option key={state.id} value={state.id}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City Filter */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <select
                      value={filters.city || ''}
                      onChange={(e) => setFilter('city', e.target.value || null)}
                      className="input-field"
                    >
                      <option value="">All Cities</option>
                      {cities.map(city => (
                        <option key={city.id} value={city.slug}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Age Range */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age Range
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        min="1"
                        max="18"
                        placeholder="Min"
                        value={filters.ageMin || ''}
                        onChange={(e) => setFilter('ageMin', e.target.value ? parseInt(e.target.value) : null)}
                        className="input-field flex-1"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        min="1"
                        max="18"
                        placeholder="Max"
                        value={filters.ageMax || ''}
                        onChange={(e) => setFilter('ageMax', e.target.value ? parseInt(e.target.value) : null)}
                        className="input-field flex-1"
                      />
                    </div>
                  </div>

                  {/* Indoor/Outdoor */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location Type
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="indoor"
                          checked={filters.indoor === null}
                          onChange={() => setFilter('indoor', null)}
                          className="text-primary-500"
                        />
                        <span className="text-sm">Both Indoor & Outdoor</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="indoor"
                          checked={filters.indoor === true}
                          onChange={() => setFilter('indoor', true)}
                          className="text-primary-500"
                        />
                        <span className="text-sm">Indoor Only</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="indoor"
                          checked={filters.indoor === false}
                          onChange={() => setFilter('indoor', false)}
                          className="text-primary-500"
                        />
                        <span className="text-sm">Outdoor Only</span>
                      </label>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <select
                      value={filters.priceRange || ''}
                      onChange={(e) => setFilter('priceRange', e.target.value ? parseInt(e.target.value) : null)}
                      className="input-field"
                    >
                      <option value="">All Prices</option>
                      <option value="1">$ - Budget Friendly</option>
                      <option value="2">$$ - Moderate</option>
                      <option value="3">$$$ - Premium</option>
                    </select>
                  </div>

                  {/* Facilities */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Facilities
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 'parking', label: '🅿️ Parking Available' },
                        { value: 'disability_access', label: '♿ Wheelchair Access' },
                        { value: 'changing_rooms', label: '🚿 Changing Rooms' },
                        { value: 'cafe', label: '☕ Café/Canteen' },
                        { value: 'equipment_provided', label: '🎽 Equipment Provided' },
                        { value: 'wifi', label: '📶 WiFi Available' }
                      ].map(facility => (
                        <label key={facility.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.facilities?.includes(facility.value) || false}
                            onChange={(e) => {
                              const currentFacilities = filters.facilities || [];
                              if (e.target.checked) {
                                setFilter('facilities', [...currentFacilities, facility.value]);
                              } else {
                                setFilter('facilities', currentFacilities.filter(f => f !== facility.value));
                              }
                            }}
                            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">{facility.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Open Now */}
                  <div className="mb-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.openNow || false}
                        onChange={(e) => setFilter('openNow', e.target.checked)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        🕐 Open Now
                      </span>
                    </label>
                  </div>

                  {/* With Offers */}
                  <div className="mb-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.hasOffers || false}
                        onChange={(e) => setFilter('hasOffers', e.target.checked)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        🎁 Special Offers Available
                      </span>
                    </label>
                  </div>
                </div>
              </aside>
            )}

            {/* Results */}
            <div className="flex-1">
              {loading ? (
                <LoadingSpinner text="Searching for activities..." />
              ) : venues.length === 0 ? (
                <div className="card text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-display font-semibold mb-2">
                    No activities found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters or search terms
                  </p>
                  <button onClick={handleClearFilters} className="btn-primary">
                    Clear Filters
                  </button>
                </div>
              ) : (
                <>
                  {/* Results Count */}
                  <div className="mb-6">
                    <p className="text-gray-600">
                      Found <span className="font-semibold text-gray-900">{venues.length}</span> activities
                    </p>
                  </div>

                  {/* Venue Grid/List */}
                  <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                    {paginatedVenues.map(venue => (
                      <VenueCard
                        key={venue.id}
                        venue={venue}
                        showDistance={!!userLocation}
                        distance={venue.distance_km}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                      <button
                        onClick={() => setPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>

                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setPage(i + 1)}
                          className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                            currentPage === i + 1
                              ? 'bg-primary-500 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}

                      <button
                        onClick={() => setPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
