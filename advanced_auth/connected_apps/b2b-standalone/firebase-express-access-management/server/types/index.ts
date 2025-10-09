import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    uid: string;
    email: string;
    name: string | null;
  };
  db?: any;
  organization?: any;
}

export interface User {
  uid: string;
  email: string;
  name: string;
  createdAt: Date;
  organizations: string[];
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  adminId: string;
  adminEmail: string;
  adminName: string;
  members: string[];
  createdAt: Date;
  updatedAt: Date;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface CreateOrganizationRequest {
  name: string;
  description?: string;
}

export interface CreateAccessRequestData {
  resourceName: string;
  reason: string;
}

export interface ApproveDenyRequest {
  action: 'approve' | 'deny';
  reason: string;
}
