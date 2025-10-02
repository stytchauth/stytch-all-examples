import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Organization, AccessRequest, Member } from '@/frontend/types';
import { organizationsApi, requestsApi } from '@/frontend/lib/api';
import CreateRequest from './CreateRequest';
import { formatDate } from '@/frontend/lib/utils';

const OrganizationDetail: React.FC = () => {
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'requests' | 'members'>('requests');

  const fetchOrganization = async () => {
    try {
      const org = await organizationsApi.getOrganization();
      setOrganization(org);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch organization');
    }
  };

  const fetchRequests = async () => {
    if (!organization) return;
    try {
      // Try to fetch organization requests (admin only)
      const reqs = await requestsApi.getByOrganization(organization.id);
      setRequests(reqs);
    } catch (err: any) {
      // If user is not admin, fall back to their own requests
      if (err.response?.status === 403) {
        try {
          const myReqs = await requestsApi.getMyRequests();
          setRequests(myReqs);
        } catch (fallbackErr: any) {
          setError(fallbackErr.response?.data?.error || 'Failed to fetch requests');
        }
      } else {
        setError(err.response?.data?.error || 'Failed to fetch requests');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const memberList = await organizationsApi.getMembers();
      setMembers(memberList);
    } catch (err: any) {
      console.error('Failed to fetch members:', err);
      // Don't set error for members fetch failure, just log it
      // Members tab will show empty state instead
      setMembers([]);
    }
  };

  useEffect(() => {
    fetchOrganization();
  }, []);

  useEffect(() => {
    if (organization) {
      fetchRequests();
      fetchMembers();
    }
  }, [organization]);

  const handleApproveDeny = async (requestId: string, action: 'approve' | 'deny', reason: string) => {
    if (!organization) return;
    try {
      await requestsApi.approveOrDeny(organization.id, requestId, action, reason);
      fetchRequests();
    } catch (err: any) {
      setError(err.response?.data?.error || `Failed to ${action} request`);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    fetchRequests();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Organization not found</div>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{organization.name}</h1>
          <p className="text-sm text-gray-500">Domain: {organization.domain}</p>
          {organization.description && <p className="text-gray-600 mt-1">{organization.description}</p>}
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
        >
          Back to Dashboard
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'requests'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Access Requests
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'members'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Members
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'requests' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  {organization?.role === 'admin' ? 'Access Requests' : 'My Requests'}
                </h2>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Create Request
                </button>
              </div>

              {showCreateForm && organization && (
                <CreateRequest
                  orgId={organization.id}
                  onSuccess={handleCreateSuccess}
                  onCancel={() => setShowCreateForm(false)}
                />
              )}

              {requests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {organization?.role === 'admin'
                    ? 'No access requests found'
                    : "You haven't created any access requests yet"}
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{request.resourceName}</h3>
                          <p className="text-sm text-gray-600">by {request.userName}</p>
                        </div>
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

                      <p className="text-gray-700 mb-3">{request.reason}</p>

                      {request.adminResponse && (
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-sm text-gray-600">
                            <strong>Admin Response:</strong> {request.adminResponse}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            by {request.adminName} on {formatDate(request.updatedAt)}
                          </p>
                        </div>
                      )}

                      {organization.role === 'admin' && request.status === 'pending' && (
                        <div className="mt-3 flex space-x-2">
                          <button
                            onClick={() => {
                              const reason = prompt('Reason for approval:');
                              if (reason) handleApproveDeny(request.id, 'approve', reason);
                            }}
                            className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-200"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('Reason for denial:');
                              if (reason) handleApproveDeny(request.id, 'deny', reason);
                            }}
                            className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200"
                          >
                            Deny
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'members' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Members ({members.length})</h2>
              {members.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No members found</div>
              ) : (
                <div className="space-y-2">
                  {members.map((member) => (
                    <div key={member.uid} className="flex justify-between items-center py-3 border-b border-gray-100">
                      <div>
                        <span className="font-medium text-gray-900">{member.name}</span>
                        <span className="text-sm text-gray-500 ml-2">{member.email}</span>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          member.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {member.role === 'admin' ? 'Admin' : 'Member'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetail;
