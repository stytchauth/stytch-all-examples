import React, { useState } from 'react';
import { requestsApi } from '@/frontend/lib/api';

interface CreateRequestProps {
  orgId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateRequest: React.FC<CreateRequestProps> = ({ orgId, onSuccess, onCancel }) => {
  const [resourceName, setResourceName] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await requestsApi.create(orgId, resourceName, reason);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Access Request</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="resourceName" className="block text-sm font-medium text-gray-700">
            Resource Name
          </label>
          <input
            type="text"
            id="resourceName"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., Database Access, Admin Panel, API Key"
            value={resourceName}
            onChange={(e) => setResourceName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
            Reason for Request
          </label>
          <textarea
            id="reason"
            rows={4}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Explain why you need access to this resource..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Request'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRequest;
