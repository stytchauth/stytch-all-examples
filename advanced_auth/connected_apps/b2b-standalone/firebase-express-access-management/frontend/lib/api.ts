import axios, { AxiosResponse } from 'axios';
import { AuthResponse, User, Organization, AccessRequest, Member } from '@/frontend/types';

const API_BASE_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authApi = {
  signup: async (email: string, password: string, name: string): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/signup', {
      email,
      password,
      name,
    });
    return response.data;
  },

  signin: async (email: string, password: string): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/signin', {
      email,
      password,
    });
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response: AxiosResponse<User> = await api.get('/auth/profile');
    return response.data;
  },
};

// Organizations API
export const organizationsApi = {
  getOrganization: async (): Promise<Organization> => {
    const response: AxiosResponse<Organization> = await api.get('/organization/');
    return response.data;
  },

  getMembers: async (): Promise<Member[]> => {
    const response: AxiosResponse<{ members: Member[] }> = await api.get(`/organization/members`);
    return response.data.members;
  },
};

// Requests API
export const requestsApi = {
  create: async (orgId: string, resourceName: string, reason: string): Promise<AccessRequest> => {
    const response: AxiosResponse<{ request: AccessRequest }> = await api.post(`/requests/${orgId}`, {
      resourceName,
      reason,
    });
    return response.data.request;
  },

  getByOrganization: async (orgId: string, status?: string): Promise<AccessRequest[]> => {
    const params = status ? { status } : {};
    const response: AxiosResponse<{ requests: AccessRequest[] }> = await api.get(`/requests/${orgId}`, { params });
    return response.data.requests;
  },

  getById: async (orgId: string, requestId: string): Promise<AccessRequest> => {
    const response: AxiosResponse<AccessRequest> = await api.get(`/requests/${orgId}/${requestId}`);
    return response.data;
  },

  approveOrDeny: async (
    orgId: string,
    requestId: string,
    action: 'approve' | 'deny',
    reason: string,
  ): Promise<void> => {
    await api.patch(`/requests/${orgId}/${requestId}`, {
      action,
      reason,
    });
  },

  getMyRequests: async (status?: string, orgId?: string): Promise<AccessRequest[]> => {
    const params: any = {};
    if (status) params.status = status;
    if (orgId) params.orgId = orgId;

    const response: AxiosResponse<{ requests: AccessRequest[] }> = await api.get('/requests', { params });
    return response.data.requests;
  },

  cancel: async (orgId: string, requestId: string): Promise<void> => {
    await api.delete(`/requests/${orgId}/${requestId}`);
  },
};

export default api;
