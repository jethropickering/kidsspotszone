import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiMapPin,
  FiMail,
  FiUser,
  FiCalendar,
  FiFilter,
  FiSearch,
} from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';
import { db } from '../../services/supabase';
import { emailService } from '../../services/emailService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function VenueApprovalsPage() {
  const { user, profile } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    // Redirect if not admin
    if (profile && profile.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    loadVenues();
  }, [profile, navigate, statusFilter]);

  useEffect(() => {
    // Filter venues based on search term
    if (searchTerm) {
      const filtered = venues.filter(venue =>
        venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.owner_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.suburb?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVenues(filtered);
    } else {
      setFilteredVenues(venues);
    }
  }, [searchTerm, venues]);

  const loadVenues = async () => {
    setLoading(true);
    try {
      const { data, error } = await db.getVenuesByStatus(statusFilter);

      if (error) throw error;

      setVenues(data || []);
      setFilteredVenues(data || []);
    } catch (error) {
      console.error('Error loading venues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (venue) => {
    if (!confirm(`Are you sure you want to approve "${venue.name}"?`)) {
      return;
    }

    setActionLoading(true);

    try {
      // Update venue status to published
      const { error: updateError } = await db.updateVenue(venue.id, {
        status: 'published',
      });

      if (updateError) throw updateError;

      // Send approval email
      if (venue.owner_email) {
        await emailService.sendVenueApproved(venue.owner_email, {
          venueName: venue.name,
          userName: venue.owner_name || 'Venue Owner',
          venueId: venue.id,
        });
      }

      // Refresh list
      await loadVenues();

      alert('Venue approved successfully!');
    } catch (error) {
      console.error('Error approving venue:', error);
      alert('Failed to approve venue. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectClick = (venue) => {
    setSelectedVenue(venue);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setActionLoading(true);

    try {
      // Update venue status to rejected
      const { error: updateError } = await db.updateVenue(selectedVenue.id, {
        status: 'rejected',
        rejection_reason: rejectionReason,
      });

      if (updateError) throw updateError;

      // Send rejection email
      if (selectedVenue.owner_email) {
        await emailService.sendVenueRejected(selectedVenue.owner_email, {
          venueName: selectedVenue.name,
          userName: selectedVenue.owner_name || 'Venue Owner',
          reason: rejectionReason,
        });
      }

      // Refresh list
      await loadVenues();

      setShowRejectModal(false);
      setSelectedVenue(null);
      alert('Venue rejected and email sent to owner.');
    } catch (error) {
      console.error('Error rejecting venue:', error);
      alert('Failed to reject venue. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>Venue Approvals | Admin | Kids Sports Zone</title>
      </Helmet>

      <div className="section-container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2">Venue Approvals</h1>
              <p className="text-gray-600">
                Review and approve venue submissions
              </p>
            </div>
            <Link
              to="/admin"
              className="btn-secondary"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or suburb..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="pending">Pending ({venues.length})</option>
                <option value="published">Published</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {venues.filter(v => v.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {venues.filter(v => v.status === 'published').length}
            </div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {venues.filter(v => v.status === 'rejected').length}
            </div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
        </div>

        {/* Venues List */}
        {filteredVenues.length === 0 ? (
          <div className="card text-center py-12">
            <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">All caught up!</h3>
            <p className="text-gray-600">
              No {statusFilter} venues to review at this time.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVenues.map((venue) => (
              <div key={venue.id} className="card">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Venue Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {venue.name}
                        </h3>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(venue.status)}`}>
                          {venue.status.charAt(0).toUpperCase() + venue.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiUser className="flex-shrink-0" />
                        <span>
                          <strong>Owner:</strong> {venue.owner_name || 'Unknown'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <FiMail className="flex-shrink-0" />
                        <span className="truncate">
                          {venue.owner_email || 'No email'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <FiMapPin className="flex-shrink-0" />
                        <span>
                          {venue.suburb}, {venue.state}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <FiCalendar className="flex-shrink-0" />
                        <span>
                          Submitted: {new Date(venue.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {venue.description && (
                      <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                        {venue.description}
                      </p>
                    )}

                    {venue.status === 'rejected' && venue.rejection_reason && (
                      <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">
                          <strong>Rejection Reason:</strong> {venue.rejection_reason}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {statusFilter === 'pending' && (
                    <div className="flex lg:flex-col gap-2 lg:w-48">
                      <Link
                        to={`/venue/${venue.slug}`}
                        target="_blank"
                        className="flex-1 btn-outline text-center"
                      >
                        Preview
                      </Link>
                      <button
                        onClick={() => handleApprove(venue)}
                        disabled={actionLoading}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <FiCheckCircle />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectClick(venue)}
                        disabled={actionLoading}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <FiXCircle />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectModal && selectedVenue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Reject Venue</h3>

            <p className="text-gray-600 mb-4">
              You are rejecting <strong>{selectedVenue.name}</strong>.
              Please provide a reason that will be sent to the owner.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason (required)..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={5}
              required
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedVenue(null);
                  setRejectionReason('');
                }}
                disabled={actionLoading}
                className="flex-1 btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={actionLoading || !rejectionReason.trim()}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
