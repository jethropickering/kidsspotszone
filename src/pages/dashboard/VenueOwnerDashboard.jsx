import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiHome, FiTag, FiStar, FiUsers, FiTrendingUp, FiSettings, FiPlus } from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';

export default function VenueOwnerDashboard() {
  const { user, profile, signOut } = useAuthStore();

  return (
    <>
      <Helmet>
        <title>Venue Owner Dashboard | Kids Sports Zone</title>
        <meta name="description" content="Manage your venue listings and offers" />
      </Helmet>

      <div className="bg-warm-50 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-secondary-500 to-primary-500 text-white py-12">
          <div className="section-container">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              Venue Owner Dashboard
            </h1>
            <p className="text-white/90">
              Welcome, {profile?.full_name || user?.email}
            </p>
          </div>
        </div>

        <div className="section-container py-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card text-center">
              <FiHome className="w-8 h-8 text-primary-500 mx-auto mb-2" />
              <div className="text-2xl font-display font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-600">My Venues</div>
            </div>
            <div className="card text-center">
              <FiTag className="w-8 h-8 text-accent-500 mx-auto mb-2" />
              <div className="text-2xl font-display font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-600">Active Offers</div>
            </div>
            <div className="card text-center">
              <FiStar className="w-8 h-8 text-primary-500 mx-auto mb-2" />
              <div className="text-2xl font-display font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-600">Total Reviews</div>
            </div>
            <div className="card text-center">
              <FiUsers className="w-8 h-8 text-secondary-500 mx-auto mb-2" />
              <div className="text-2xl font-display font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-600">Favorites</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Get Started */}
              <div className="card bg-gradient-to-br from-primary-50 to-secondary-50 border-2 border-primary-200">
                <h2 className="text-2xl font-display font-bold mb-4">🎉 Get Started</h2>
                <p className="text-gray-700 mb-6">
                  Welcome to your venue owner dashboard! Here's how to get the most out of Kids Sports Zone:
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Claim or Create Your Venue</h3>
                      <p className="text-sm text-gray-600">
                        Search for your venue and claim it, or create a new listing if it doesn't exist yet.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-secondary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Complete Your Profile</h3>
                      <p className="text-sm text-gray-600">
                        Add photos, update information, set your schedule, and showcase what makes your venue special.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Create Special Offers</h3>
                      <p className="text-sm text-gray-600">
                        Attract more families with exclusive deals and promotions.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <Link to="/search" className="btn-primary">
                    Find My Venue
                  </Link>
                  <Link to="/dashboard/venue/add" className="btn-outline">
                    Create New Listing
                  </Link>
                </div>
              </div>

              {/* My Venues */}
              <div className="card">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-display font-bold">My Venues</h2>
                  <Link to="/dashboard/venue/add" className="btn-primary flex items-center gap-2">
                    <FiPlus className="w-4 h-4" />
                    Add Venue
                  </Link>
                </div>
                <div className="text-center py-12">
                  <FiHome className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-display font-semibold mb-2">No venues yet</h3>
                  <p className="text-gray-600 mb-6">
                    Claim an existing venue or create a new listing to get started
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Link to="/search" className="btn-outline">
                      Search for My Venue
                    </Link>
                    <Link to="/dashboard/venue/add" className="btn-primary">
                      Create New Listing
                    </Link>
                  </div>
                </div>
              </div>

              {/* Recent Reviews */}
              <div className="card">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-display font-bold">Recent Reviews</h2>
                  <Link to="#" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View All →
                  </Link>
                </div>
                <div className="text-center py-12">
                  <FiStar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-display font-semibold mb-2">No reviews yet</h3>
                  <p className="text-gray-600">
                    Reviews from parents will appear here once you have an active venue listing
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="card">
                <h3 className="font-display font-semibold text-lg mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="flex items-center gap-3 p-3 hover:bg-warm-50 rounded-lg transition-colors w-full text-left">
                    <FiPlus className="w-5 h-5 text-primary-500" />
                    <span className="text-gray-700">Create Offer</span>
                  </button>
                  <Link to="/dashboard/venue/add" className="flex items-center gap-3 p-3 hover:bg-warm-50 rounded-lg transition-colors w-full text-left">
                    <FiHome className="w-5 h-5 text-secondary-500" />
                    <span className="text-gray-700">Add Venue</span>
                  </Link>
                  <button className="flex items-center gap-3 p-3 hover:bg-warm-50 rounded-lg transition-colors w-full text-left">
                    <FiTrendingUp className="w-5 h-5 text-accent-500" />
                    <span className="text-gray-700">View Analytics</span>
                  </button>
                  <button className="flex items-center gap-3 p-3 hover:bg-warm-50 rounded-lg transition-colors w-full text-left">
                    <FiSettings className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">Settings</span>
                  </button>
                </div>
              </div>

              {/* Tips & Resources */}
              <div className="card bg-secondary-50 border-2 border-secondary-200">
                <h3 className="font-display font-semibold text-lg mb-3">💡 Tips for Success</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-secondary-600">•</span>
                    <span>Add high-quality photos to attract more families</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary-600">•</span>
                    <span>Keep your schedule and contact info up to date</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary-600">•</span>
                    <span>Respond to reviews to build trust</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary-600">•</span>
                    <span>Create special offers to boost bookings</span>
                  </li>
                </ul>
              </div>

              {/* Upgrade CTA */}
              <div className="card bg-gradient-to-br from-accent-500 to-primary-500 text-white">
                <h3 className="font-display font-bold text-lg mb-2">✨ Promote Your Venue</h3>
                <p className="text-white/90 text-sm mb-4">
                  Get featured placement and reach more families with our promotion packages
                </p>
                <button className="bg-white text-accent-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors w-full">
                  Learn More
                </button>
              </div>

              {/* Account Info */}
              <div className="card bg-warm-100 border-2 border-primary-200">
                <h3 className="font-display font-semibold text-lg mb-3">Your Account</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium text-gray-900">{profile?.full_name || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-gray-900 truncate max-w-[150px]">{user?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Role:</span>
                    <span className="font-medium text-gray-900">Venue Owner</span>
                  </div>
                </div>
                <button
                  onClick={signOut}
                  className="btn-outline w-full mt-4 text-sm"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
