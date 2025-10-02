export interface User {
  uid: string;
  email: string;
  name: string;
  organizationId?: string;
}

export interface Organization {
  id: string;
  name: string;
  domain: string;
  description: string;
  adminId: string;
  adminEmail: string;
  adminName: string;
  members: string[];
  memberCount?: number;
  createdAt: any; // Firebase Timestamp
  updatedAt: any; // Firebase Timestamp
  role?: 'admin' | 'member';
}

export interface AccessRequest {
  id: string;
  orgId: string;
  userId: string;
  userEmail: string;
  userName: string;
  resourceName: string;
  reason: string;
  status: 'pending' | 'approved' | 'denied';
  adminResponse?: string;
  adminId?: string;
  adminName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  uid: string;
  email: string;
  name: string;
  role: 'admin' | 'member';
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
  details?: string[];
}
