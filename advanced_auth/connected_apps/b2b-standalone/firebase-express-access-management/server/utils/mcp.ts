import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { db } from '../config/firebase.js';

/**
 * MCP Server for Access Request Manager
 *
 * This MCP server provides comprehensive tools for managing access requests and organization data.
 * All tools are role-aware and respect user permissions.
 *
 * Available Tools:
 *
 * 1. get_user_info - Get current user information and organization details
 *    - Returns user info, organization details, role, and permissions
 *    - Available to: All users
 *
 * 2. list_requests - List access requests
 *    - Admins: See all organization requests
 *    - Members: See only their own requests
 *    - Returns: Request details, status, timestamps, admin responses
 *
 * 3. create_request - Create a new access request
 *    - Parameters:
 *      - resourceName (string, 1-100 chars): Name of the resource being requested
 *      - reason (string, 1-500 chars): Reason for requesting access
 *    - Available to: All users
 *    - Returns: Created request details
 *    - Validation: Input validation with detailed error messages
 *
 * 4. approve_deny_request - Approve or deny an access request
 *    - Parameters:
 *      - requestId (string, min 1 char): ID of the request to approve or deny
 *      - action (enum: "approve"|"deny"): Action to take on the request
 *      - reason (string, 1-500 chars): Reason for the approval or denial
 *    - Available to: Organization admins only
 *    - Validates: Request exists, belongs to user's org, is pending
 *    - Validation: Input validation with detailed error messages
 *
 * 5. list_members - List organization members
 *    - Available to: Organization admins only
 *    - Returns: Member details (name, email, role)
 *
 * 6. get_org_stats - Get organization statistics
 *    - Returns: Request counts, member count, organization info
 *    - Available to: All users (with role-appropriate data)
 *
 * All tools include proper error handling and permission validation.
 */

// Zod schemas for input validation
const CreateRequestSchema = z.object({
  resourceName: z.string().min(1, 'Resource name is required').max(100, 'Resource name too long'),
  reason: z.string().min(1, 'Reason is required').max(500, 'Reason too long'),
});

const ApproveDenyRequestSchema = z.object({
  requestId: z.string().min(1, 'Request ID is required'),
  action: z.enum(['approve', 'deny'], {
    errorMap: () => ({ message: 'Action must be either "approve" or "deny"' }),
  }),
  reason: z.string().min(1, 'Reason is required').max(500, 'Reason too long'),
});

export const initializeMCPServer = (userId: string): McpServer => {
  const server = new McpServer({
    name: 'Access Request Manager',
    version: '1.0.0',
    description: 'MCP server for managing access requests and organization data',
  });

  // Helper function to get user's organization and role
  const getUserOrganization = async () => {
    try {
      const userDoc = await db.collection('users').doc(userId).get();
      if (!userDoc.exists) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      const organizationId = userData?.organizationId;

      if (!organizationId) {
        throw new Error('User not assigned to any organization');
      }

      const orgDoc = await db.collection('organizations').doc(organizationId).get();
      if (!orgDoc.exists) {
        throw new Error('Organization not found');
      }

      const orgData = orgDoc.data();
      const isAdmin = orgData?.adminId === userId;

      return {
        organizationId,
        organization: { id: organizationId, ...orgData } as any,
        isAdmin,
      };
    } catch (error) {
      throw new Error(`Failed to get user organization: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Helper function to get user info
  const getUserInfo = async () => {
    try {
      const userDoc = await db.collection('users').doc(userId).get();
      if (!userDoc.exists) {
        throw new Error('User not found');
      }
      return userDoc.data();
    } catch (error) {
      throw new Error(`Failed to get user info: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Tool: Get current user information
  server.tool('getUserInfo', 'Get current user information and organization details', async () => {
    try {
      const userInfo = await getUserInfo();
      const { organization, isAdmin } = await getUserOrganization();

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                user: {
                  id: userId,
                  name: userInfo?.name,
                  email: userInfo?.email,
                },
                organization: {
                  id: organization.id,
                  name: organization.name,
                  domain: organization.domain,
                  description: organization.description,
                },
                role: isAdmin ? 'admin' : 'member',
                permissions: {
                  canViewAllRequests: isAdmin,
                  canApproveDenyRequests: isAdmin,
                  canViewMembers: isAdmin,
                  canCreateRequests: true,
                },
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  });

  // Tool: List access requests
  server.tool('listRequests', 'List access requests (all requests if admin, own requests if member)', async () => {
    try {
      const { organization, isAdmin } = await getUserOrganization();

      let requests;
      if (isAdmin) {
        // Get all organization requests
        const requestsSnapshot = await db
          .collection('accessRequests')
          .where('orgId', '==', organization.id)
          .orderBy('createdAt', 'desc')
          .get();

        requests = requestsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as any[];
      } else {
        // Get only user's own requests
        const requestsSnapshot = await db
          .collection('accessRequests')
          .where('orgId', '==', organization.id)
          .where('userId', '==', userId)
          .orderBy('createdAt', 'desc')
          .get();

        requests = requestsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as any[];
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                requests: requests.map((req) => ({
                  id: req.id,
                  resourceName: req.resourceName,
                  reason: req.reason,
                  status: req.status,
                  userName: req.userName,
                  userEmail: req.userEmail,
                  adminResponse: req.adminResponse,
                  adminName: req.adminName,
                  createdAt: req.createdAt?.toDate?.() || req.createdAt,
                  updatedAt: req.updatedAt?.toDate?.() || req.updatedAt,
                })),
                total: requests.length,
                userRole: isAdmin ? 'admin' : 'member',
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  });

  // Tool: Create access request
  server.tool(
    'createRequest',
    'Create a new access request',
    {
      request: CreateRequestSchema,
    },
    async (args) => {
      try {
        // Validate input using Zod schema
        const validatedArgs = CreateRequestSchema.parse(args.request);

        const { organization } = await getUserOrganization();
        const userInfo = await getUserInfo();

        const requestData = {
          orgId: organization.id,
          userId: userId,
          userEmail: userInfo?.email,
          userName: userInfo?.name,
          resourceName: validatedArgs.resourceName,
          reason: validatedArgs.reason,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const requestRef = await db.collection('accessRequests').add(requestData);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  success: true,
                  requestId: requestRef.id,
                  message: 'Access request created successfully',
                  request: {
                    id: requestRef.id,
                    ...requestData,
                  },
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        // Handle Zod validation errors
        if (error instanceof z.ZodError) {
          return {
            content: [
              {
                type: 'text',
                text: `Validation Error: ${error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
              },
            ],
            isError: true,
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  // Tool: Approve or deny request (admin only)
  server.tool(
    'approveDenyRequest',
    'Approve or deny an access request (admin only)',
    {
      request: ApproveDenyRequestSchema,
    },
    async (args) => {
      try {
        // Validate input using Zod schema
        const validatedArgs = ApproveDenyRequestSchema.parse(args.request);

        const { organization, isAdmin } = await getUserOrganization();

        if (!isAdmin) {
          return {
            content: [
              {
                type: 'text',
                text: 'Error: Only organization admins can approve or deny requests',
              },
            ],
            isError: true,
          };
        }

        const requestRef = db.collection('accessRequests').doc(validatedArgs.requestId);
        const requestDoc = await requestRef.get();

        if (!requestDoc.exists) {
          return {
            content: [
              {
                type: 'text',
                text: 'Error: Request not found',
              },
            ],
            isError: true,
          };
        }

        const requestData = requestDoc.data();
        if (requestData?.orgId !== organization.id) {
          return {
            content: [
              {
                type: 'text',
                text: 'Error: Request does not belong to your organization',
              },
            ],
            isError: true,
          };
        }

        if (requestData?.status !== 'pending') {
          return {
            content: [
              {
                type: 'text',
                text: 'Error: Request is not pending (already approved or denied)',
              },
            ],
            isError: true,
          };
        }

        const userInfo = await getUserInfo();

        await requestRef.update({
          status: validatedArgs.action === 'approve' ? 'approved' : 'denied',
          adminResponse: validatedArgs.reason,
          adminId: userId,
          adminName: userInfo?.name,
          updatedAt: new Date(),
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  success: true,
                  message: `Request ${validatedArgs.action === 'approve' ? 'approved' : 'denied'} successfully`,
                  requestId: validatedArgs.requestId,
                  action: validatedArgs.action,
                  reason: validatedArgs.reason,
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        // Handle Zod validation errors
        if (error instanceof z.ZodError) {
          return {
            content: [
              {
                type: 'text',
                text: `Validation Error: ${error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
              },
            ],
            isError: true,
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  // Tool: Get organization members (admin only)
  server.tool('listMembers', 'List organization members (admin only)', async () => {
    try {
      const { organization, isAdmin } = await getUserOrganization();

      if (!isAdmin) {
        return {
          content: [
            {
              type: 'text',
              text: 'Error: Only organization admins can view member lists',
            },
          ],
          isError: true,
        };
      }

      const members = [];
      for (const memberId of organization.members) {
        const userDoc = await db.collection('users').doc(memberId).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          members.push({
            uid: memberId,
            name: userData?.name,
            email: userData?.email,
            role: memberId === organization.adminId ? 'admin' : 'member',
          });
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                members,
                total: members.length,
                organization: {
                  id: organization.id,
                  name: organization.name,
                  domain: organization.domain,
                },
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  });

  // Tool: Get organization statistics
  server.tool('getOrgStats', 'Get organization statistics and overview', async () => {
    try {
      const { organization, isAdmin } = await getUserOrganization();

      // Get request statistics
      const requestsSnapshot = await db.collection('accessRequests').where('orgId', '==', organization.id).get();

      const requests = requestsSnapshot.docs.map((doc) => doc.data());
      const stats = {
        totalRequests: requests.length,
        pendingRequests: requests.filter((r) => r.status === 'pending').length,
        approvedRequests: requests.filter((r) => r.status === 'approved').length,
        deniedRequests: requests.filter((r) => r.status === 'denied').length,
        totalMembers: organization.members?.length || 0,
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                organization: {
                  id: organization.id,
                  name: organization.name,
                  domain: organization.domain,
                  description: organization.description,
                },
                statistics: stats,
                userRole: isAdmin ? 'admin' : 'member',
                permissions: {
                  canViewAllRequests: isAdmin,
                  canApproveDenyRequests: isAdmin,
                  canViewMembers: isAdmin,
                  canCreateRequests: true,
                },
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  });

  return server;
};
