import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import {
  FaUsers,
  FaBuilding,
  FaStar,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaChartLine
} from 'react-icons/fa';
import { useAuthStore } from '../../store/authStore';
import { db } from '../../services/supabase';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AdminDashboard() {
  const { user, profile } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVenues: 0,
    totalReviews: 0,
    pendingClaims: 0,
    reportedIssues: 0
  });
  const [pendingClaims, setPendingClaims] = useState([]);
  const [reportedIssues, setReportedIssues] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);

  useEffect(() => {
    // Redirect if not admin
    if (profile && profile.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    loadDashboardData();
  }, [profile, navigate]);

  const loadDashboardData = async () => {
    setLoading(true);

    // TODO: Implement actual data loading from Supabase
    // For now, using mock data
    await new Promise(resolve => setTimeout(resolve, 500));

    setStats({
      totalUsers: 1247,
      totalVenues: 342,
      totalReviews: 2156,
      pendingClaims: 8,
      reportedIssues: 12
    });

    setPendingClaims([
      {
        id: 1,
        venueName: 'Sydney Swim School',
        ownerName: 'John Smith',
        email: 'john@sydneyswim.com.au',
        submittedAt: '2025-01-20',
        status: 'pending'
      },
      {
        id: 2,
        venueName: 'Melbourne Soccer Academy',
        ownerName: 'Sarah Johnson',
        email: 'sarah@melbsoccer.com.au',
        submittedAt: '2025-01-19',
        status: 'pending'
      }
    ]);

    setReportedIssues([
      {
        id: 1,
        venueName: 'Brisbane Dance Studio',
        issue: 'Outdated pricing information',
        reportedBy: 'Parent',
        reportedAt: '2025-01-21',
        status: 'open'
      }
    ]);

    setLoading(false);
  };

  const handleApproveClaim = async (claimId) => {
    // TODO: Implement claim approval
    console.log('Approving claim:', claimId);
    setPendingClaims(prev => prev.filter(c => c.id !== claimId));
    setStats(prev => ({ ...prev, pendingClaims: prev.pendingClaims - 1 }));
  };

  const handleRejectClaim = async (claimId) => {
    // TODO: Implement claim rejection
    console.log('Rejecting claim:', claimId);
    setPendingClaims(prev => prev.filter(c => c.id !== claimId));
    setStats(prev => ({ ...prev, pendingClaims: prev.pendingClaims - 1 }));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Kids Sports Zone</title>
      </Helmet>

      <div className="section-container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Platform overview and management tools
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl text-primary-600">
                <FaUsers />
              </div>
              <span className="text-xs text-gray-500">Total</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {stats.totalUsers.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Users</div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl text-secondary-600">
                <FaBuilding />
              </div>
              <span className="text-xs text-gray-500">Total</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {stats.totalVenues.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Venues</div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl text-accent-600">
                <FaStar />
              </div>
              <span className="text-xs text-gray-500">Total</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {stats.totalReviews.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Reviews</div>
          </div>

          <div className="card bg-yellow-50 border-yellow-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl text-yellow-600">
                <FaClock />
              </div>
              <span className="text-xs text-yellow-600">Action Needed</span>
            </div>
            <div className="text-3xl font-bold text-yellow-800 mb-1">
              {stats.pendingClaims}
            </div>
            <div className="text-sm text-yellow-700">Pending Claims</div>
          </div>

          <div className="card bg-red-50 border-red-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl text-red-600">
                <FaExclamationTriangle />
              </div>
              <span className="text-xs text-red-600">Needs Review</span>
            </div>
            <div className="text-3xl font-bold text-red-800 mb-1">
              {stats.reportedIssues}
            </div>
            <div className="text-sm text-red-700">Reported Issues</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pending Claims */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold">Pending Venue Claims</h2>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                {stats.pendingClaims} Pending
              </span>
            </div>

            {pendingClaims.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FaCheckCircle className="text-4xl mx-auto mb-2 text-green-500" />
                <p>No pending claims</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingClaims.map(claim => (
                  <div key={claim.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {claim.venueName}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Owner:</strong> {claim.ownerName}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Email:</strong> {claim.email}
                        </p>
                        <p className="text-xs text-gray-500">
                          Submitted: {new Date(claim.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                        Pending
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveClaim(claim.id)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <FaCheckCircle />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectClaim(claim.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <FaTimesCircle />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reported Issues */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold">Reported Issues</h2>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                {stats.reportedIssues} Open
              </span>
            </div>

            {reportedIssues.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FaCheckCircle className="text-4xl mx-auto mb-2 text-green-500" />
                <p>No reported issues</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reportedIssues.map(issue => (
                  <div key={issue.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {issue.venueName}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Issue:</strong> {issue.issue}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Reported by:</strong> {issue.reportedBy}
                        </p>
                        <p className="text-xs text-gray-500">
                          Reported: {new Date(issue.reportedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                        Open
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        View Venue
                      </button>
                      <button className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Mark Resolved
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-display font-bold mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button className="card hover:shadow-lg transition-shadow text-left">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <FaBuilding className="text-2xl text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Manage Venues</h3>
                  <p className="text-sm text-gray-600">View and edit all venues</p>
                </div>
              </div>
            </button>

            <button className="card hover:shadow-lg transition-shadow text-left">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                  <FaUsers className="text-2xl text-secondary-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Manage Users</h3>
                  <p className="text-sm text-gray-600">View user accounts</p>
                </div>
              </div>
            </button>

            <button className="card hover:shadow-lg transition-shadow text-left">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center">
                  <FaChartLine className="text-2xl text-accent-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Analytics</h3>
                  <p className="text-sm text-gray-600">View platform metrics</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
