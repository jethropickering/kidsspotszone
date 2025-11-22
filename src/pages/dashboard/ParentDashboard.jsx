import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiHeart, FiStar, FiSettings, FiSearch, FiBell, FiMapPin } from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';

export default function ParentDashboard() {
  const { user, profile, signOut } = useAuthStore();

  return (
    <>
      <Helmet>
        <title>My Dashboard | Kids Sports Zone</title>
        <meta name="description" content="Your personalized Kids Sports Zone dashboard" />
      </Helmet>

      <div className="bg-warm-50 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-12">
          <div className="section-container">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              Welcome back, {profile?.full_name || user?.email}!
            </h1>
            <p className="text-white/90">
              Discover and manage your favorite kids activities
            </p>
          </div>
        </div>

        <div className="section-container py-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card text-center">
              <FiHeart className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-display font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-600">Favorites</div>
            </div>
            <div className="card text-center">
              <FiStar className="w-8 h-8 text-primary-500 mx-auto mb-2" />
              <div className="text-2xl font-display font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-600">Reviews</div>
            </div>
            <div className="card text-center">
              <FiSearch className="w-8 h-8 text-secondary-500 mx-auto mb-2" />
              <div className="text-2xl font-display font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-600">Saved Searches</div>
            </div>
            <div className="card text-center">
              <FiBell className="w-8 h-8 text-accent-500 mx-auto mb-2" />
              <div className="text-2xl font-display font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-600">Notifications</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* My Favorites */}
              <div className="card">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-display font-bold">My Favorites</h2>
                  <Link to="/dashboard/favorites" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View All →
                  </Link>
                </div>
                <div className="text-center py-12">
                  <FiHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-display font-semibold mb-2">No favorites yet</h3>
                  <p className="text-gray-600 mb-6">
                    Start exploring activities and save your favorites here
                  </p>
                  <Link to="/search" className="btn-primary">
                    Discover Activities
                  </Link>
                </div>
              </div>

              {/* My Reviews */}
              <div className="card">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-display font-bold">My Reviews</h2>
                  <Link to="/search" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View All →
                  </Link>
                </div>
                <div className="text-center py-12">
                  <FiStar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-display font-semibold mb-2">No reviews yet</h3>
                  <p className="text-gray-600 mb-6">
                    Share your experiences to help other parents
                  </p>
                  <Link to="/search" className="btn-outline">
                    Find Activities to Review
                  </Link>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="card">
                <h2 className="text-2xl font-display font-bold mb-6">Recent Activity</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 bg-warm-50 rounded-lg">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FiHeart className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">
                        Your activity will appear here as you interact with venues
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="card">
                <h3 className="font-display font-semibold text-lg mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link to="/dashboard/favorites" className="flex items-center gap-3 p-3 hover:bg-warm-50 rounded-lg transition-colors">
                    <FiHeart className="w-5 h-5 text-red-500" />
                    <span className="text-gray-700">My Favorites</span>
                  </Link>
                  <Link to="/search" className="flex items-center gap-3 p-3 hover:bg-warm-50 rounded-lg transition-colors">
                    <FiSearch className="w-5 h-5 text-primary-500" />
                    <span className="text-gray-700">Search Activities</span>
                  </Link>
                  <Link to="/search?nearMe=true" className="flex items-center gap-3 p-3 hover:bg-warm-50 rounded-lg transition-colors">
                    <FiMapPin className="w-5 h-5 text-secondary-500" />
                    <span className="text-gray-700">Find Near Me</span>
                  </Link>
                  <button className="flex items-center gap-3 p-3 hover:bg-warm-50 rounded-lg transition-colors w-full text-left">
                    <FiSettings className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">Account Settings</span>
                  </button>
                </div>
              </div>

              {/* Popular Categories */}
              <div className="card">
                <h3 className="font-display font-semibold text-lg mb-4">Popular Activities</h3>
                <div className="flex flex-wrap gap-2">
                  <Link to="/swimming" className="badge badge-primary text-sm px-3 py-2 hover:scale-105 transition-transform">
                    🏊 Swimming
                  </Link>
                  <Link to="/soccer" className="badge badge-secondary text-sm px-3 py-2 hover:scale-105 transition-transform">
                    ⚽ Soccer
                  </Link>
                  <Link to="/dance" className="badge badge-accent text-sm px-3 py-2 hover:scale-105 transition-transform">
                    💃 Dance
                  </Link>
                  <Link to="/martial-arts" className="badge bg-orange-100 text-orange-800 text-sm px-3 py-2 hover:scale-105 transition-transform">
                    🥋 Martial Arts
                  </Link>
                  <Link to="/gymnastics" className="badge bg-purple-100 text-purple-800 text-sm px-3 py-2 hover:scale-105 transition-transform">
                    🤸 Gymnastics
                  </Link>
                  <Link to="/tennis" className="badge bg-green-100 text-green-800 text-sm px-3 py-2 hover:scale-105 transition-transform">
                    🎾 Tennis
                  </Link>
                </div>
                <Link to="/search" className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-4 block">
                  View all categories →
                </Link>
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
                    <span className="font-medium text-gray-900">{user?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Role:</span>
                    <span className="font-medium text-gray-900 capitalize">{profile?.role || 'Parent'}</span>
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
