import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiUser, FiMail, FiLock, FiBell, FiShield, FiTrash2, FiSave } from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../services/supabase';

export default function SettingsPage() {
  const { user, profile, signOut } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [profileData, setProfileData] = useState({
    fullName: profile?.full_name || '',
    email: user?.email || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailReviews: true,
    emailOffers: true,
    emailFavorites: false,
    emailMarketing: false
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: profileData.fullName })
        .eq('id', user.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Profile updated successfully!' });

      // Refresh the page to update the profile in authStore
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    if (!confirm('This will permanently delete all your data including reviews, favorites, and venues. Are you absolutely sure?')) {
      return;
    }

    setMessage({ type: 'error', text: 'Account deletion must be done by contacting support for security reasons.' });
  };

  return (
    <>
      <Helmet>
        <title>Account Settings | Kids Sports Zone</title>
        <meta name="description" content="Manage your account settings and preferences" />
      </Helmet>

      <div className="bg-warm-50 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-12">
          <div className="section-container">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              Account Settings
            </h1>
            <p className="text-white/90">
              Manage your profile and preferences
            </p>
          </div>
        </div>

        <div className="section-container py-8">
          {/* Global Message */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Information */}
              <div className="card">
                <div className="flex items-center gap-3 mb-6">
                  <FiUser className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-display font-bold">Profile Information</h2>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={profileData.email}
                      className="input-field bg-gray-100"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Contact support to change your email address
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Type
                    </label>
                    <input
                      type="text"
                      value={profile?.role === 'venue_owner' ? 'Venue Owner' : 'Parent'}
                      className="input-field bg-gray-100"
                      disabled
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center gap-2"
                  >
                    <FiSave className="w-4 h-4" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>

              {/* Change Password */}
              <div className="card">
                <div className="flex items-center gap-3 mb-6">
                  <FiLock className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-display font-bold">Change Password</h2>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="input-field"
                      placeholder="••••••••"
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="input-field"
                      placeholder="••••••••"
                      minLength={6}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !passwordData.newPassword}
                    className="btn-primary flex items-center gap-2"
                  >
                    <FiLock className="w-4 h-4" />
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>

              {/* Notification Preferences */}
              <div className="card">
                <div className="flex items-center gap-3 mb-6">
                  <FiBell className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-display font-bold">Notification Preferences</h2>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Choose what notifications you'd like to receive
                  </p>

                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-warm-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.emailReviews}
                      onChange={(e) => setNotifications({ ...notifications, emailReviews: e.target.checked })}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">New Reviews</div>
                      <div className="text-sm text-gray-600">Get notified when someone reviews your venue</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-warm-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.emailOffers}
                      onChange={(e) => setNotifications({ ...notifications, emailOffers: e.target.checked })}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Special Offers</div>
                      <div className="text-sm text-gray-600">Receive alerts about new special offers</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-warm-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.emailFavorites}
                      onChange={(e) => setNotifications({ ...notifications, emailFavorites: e.target.checked })}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Favorites Updates</div>
                      <div className="text-sm text-gray-600">Updates from your favorite venues</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-warm-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.emailMarketing}
                      onChange={(e) => setNotifications({ ...notifications, emailMarketing: e.target.checked })}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Marketing Emails</div>
                      <div className="text-sm text-gray-600">Tips, news, and featured activities</div>
                    </div>
                  </label>

                  <button
                    className="btn-primary flex items-center gap-2"
                    onClick={() => setMessage({ type: 'success', text: 'Notification preferences saved!' })}
                  >
                    <FiSave className="w-4 h-4" />
                    Save Preferences
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="card border-2 border-red-200 bg-red-50">
                <div className="flex items-center gap-3 mb-6">
                  <FiShield className="w-6 h-6 text-red-600" />
                  <h2 className="text-2xl font-display font-bold text-red-900">Danger Zone</h2>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white border border-red-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Delete Account</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      className="btn-outline text-red-600 border-red-300 hover:bg-red-50 flex items-center gap-2"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account Summary */}
              <div className="card bg-warm-100 border-2 border-primary-200">
                <h3 className="font-display font-semibold text-lg mb-3">Account Summary</h3>
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
                    <span className="font-medium text-gray-900 capitalize">
                      {profile?.role === 'venue_owner' ? 'Venue Owner' : 'Parent'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member since:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(user?.created_at).toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="card">
                <h3 className="font-display font-semibold text-lg mb-4">Quick Links</h3>
                <div className="space-y-2 text-sm">
                  <a href="/dashboard" className="block text-primary-600 hover:text-primary-700">
                    ← Back to Dashboard
                  </a>
                  <a href="/help" className="block text-primary-600 hover:text-primary-700">
                    Help & Support
                  </a>
                  <a href="/privacy" className="block text-primary-600 hover:text-primary-700">
                    Privacy Policy
                  </a>
                  <a href="/terms" className="block text-primary-600 hover:text-primary-700">
                    Terms of Service
                  </a>
                </div>
              </div>

              {/* Sign Out */}
              <button
                onClick={signOut}
                className="btn-outline w-full"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
