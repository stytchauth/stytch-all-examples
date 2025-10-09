import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Organization, AccessRequest } from '@/frontend/types';
import { organizationsApi, requestsApi } from '@/frontend/lib/api';
import { formatDate } from '@/frontend/lib/utils';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [recentRequests, setRecentRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [org, requests] = await Promise.all([organizationsApi.getOrganization(), requestsApi.getMyRequests()]);

      setOrganization(org);
      setRecentRequests(requests.slice(0, 5)); // Show only recent 5 requests
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's what's happening with your organizations and requests.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Organization Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Your Organization</h2>
          </div>

          {!organization ? (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">No organization found</div>
              <p className="text-sm text-gray-400">
                Your organization will be created automatically based on your email domain.
              </p>
            </div>
          ) : (
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900">{organization.name}</h3>
                  <p className="text-sm text-gray-500">
                    {organization.role} • {organization.memberCount || organization.members?.length || 0} members
                  </p>
                  <p className="text-xs text-gray-400">Domain: {organization.domain}</p>
                </div>
                <button
                  onClick={() => navigate('/organization')}
                  className="text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  View Details
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Recent Requests Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Requests</h2>
            <button
              onClick={() => navigate('/my-requests')}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              View All
            </button>
          </div>

          {recentRequests.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">No requests yet</div>
              <p className="text-sm text-gray-400">Create your first access request from an organization page</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentRequests.map((request) => (
                <div key={request.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{request.resourceName}</h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        request.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : request.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{request.reason}</p>
                  <div className="text-xs text-gray-500">{formatDate(request.createdAt)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <button
            onClick={() => navigate('/my-requests')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <div className="font-medium text-gray-900">View My Requests</div>
            <div className="text-sm text-gray-500">Track all your access requests</div>
          </button>

          {organization && (
            <button
              onClick={() => {
                if (organization) {
                  navigate(`/organization`);
                }
              }}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <div className="font-medium text-gray-900">Create Request</div>
              <div className="text-sm text-gray-500">Request access to resources</div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
