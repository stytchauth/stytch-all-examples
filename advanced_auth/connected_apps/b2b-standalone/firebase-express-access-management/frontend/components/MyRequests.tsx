import React, { useState, useEffect } from 'react';
import { AccessRequest } from '@/frontend/types';
import { requestsApi, organizationsApi } from '@/frontend/lib/api';
import { formatDate } from '@/frontend/lib/utils';

const MyRequests: React.FC = () => {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [organizationNames, setOrganizationNames] = useState<Record<string, string>>({});

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const reqs = await requestsApi.getMyRequests(statusFilter || undefined);
      setRequests(reqs);

      // Fetch organization names for all unique orgIds
      const uniqueOrgIds = [...new Set(reqs.map((req) => req.orgId))];
      const orgNames: Record<string, string> = {};

      // Fetch organization details for each unique orgId
      await Promise.all(
        uniqueOrgIds.map(async (orgId) => {
          try {
            const org = await organizationsApi.getOrganization();
            orgNames[orgId] = org.name;
          } catch (err) {
            console.warn(`Failed to fetch organization ${orgId}:`, err);
            orgNames[orgId] = `Organization ${orgId}`; // Fallback
          }
        }),
      );

      setOrganizationNames(orgNames);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const handleCancelRequest = async (orgId: string, requestId: string) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) {
      return;
    }

    try {
      await requestsApi.cancel(orgId, requestId);
      fetchRequests();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to cancel request');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading your requests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Access Requests</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="denied">Denied</option>
        </select>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {requests.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No requests found</div>
          <p className="text-sm text-gray-400">Create your first access request from an organization page</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{request.resourceName}</h3>
                  <p className="text-sm text-gray-600">
                    Organization: {organizationNames[request.orgId] || request.orgId}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
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
                  {request.status === 'pending' && (
                    <button
                      onClick={() => handleCancelRequest(request.orgId, request.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              <p className="text-gray-700 mb-4">{request.reason}</p>

              <div className="text-sm text-gray-500 mb-4">
                <div>Created: {formatDate(request.createdAt)}</div>
                {request.updatedAt !== request.createdAt && <div>Updated: {formatDate(request.updatedAt)}</div>}
              </div>

              {request.adminResponse && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Admin Response</h4>
                  <p className="text-gray-700 mb-2">{request.adminResponse}</p>
                  <div className="text-sm text-gray-500">
                    by {request.adminName} on {formatDate(request.updatedAt)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRequests;
