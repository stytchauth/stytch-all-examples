import { Hono } from 'hono';
import { sprintPlannerService } from './SprintPlannerService';
import { B2B } from '@hono/stytch-auth';

/**
 * The Hono app exposes the Sprint Planner Ticket Service via REST endpoints
 */
export const SprintPlannerAPI = new Hono<{ Bindings: Env }>()

  .get('/healthcheck', async (c) => {
    const errors: Array<{ variable: string; description: string }> = [];

    if (!c.env.STYTCH_PROJECT_ID) {
      errors.push({
        variable: 'STYTCH_PROJECT_ID',
        description: 'Your Stytch project ID (e.g., project-test-6c20cd16-73d5-44f7-852c-9a7e7b2ccf62)',
      });
    }
    if (!c.env.STYTCH_PROJECT_SECRET) {
      errors.push({
        variable: 'STYTCH_PROJECT_SECRET',
        description: 'Your Stytch secret key from Project Settings',
      });
    }
    if (!c.env.STYTCH_DOMAIN) {
      errors.push({
        variable: 'STYTCH_DOMAIN',
        description: 'Your Stytch domain (e.g., https://cname-word-1234.customers.stytch.dev)',
      });
    }

    if (errors.length > 0) {
      return c.json(
        {
          status: 'error',
          errors,
          message: 'Backend configuration is incomplete. Add missing variables to .dev.vars file.',
          configFile: '.dev.vars',
        },
        500,
      );
    }

    return c.json({
      status: 'ok',
      message: 'All environment variables are configured correctly',
    });
  })

  // Authenticate session via cookie and attach session to context
  .use('/*', B2B.authenticateSessionLocal())

  // Get all tickets for the organization
  .get('/tickets', async (c) => {
    const session = B2B.getStytchSession(c);
    const orgId = session.organization_id;
    if (!orgId) return c.json({ error: 'No organization in session' }, 401);
    const tickets = await sprintPlannerService(c.env, orgId).getTickets();
    return c.json({ tickets });
  })

  // Create a new ticket
  .post('/tickets', async (c) => {
    const session = B2B.getStytchSession(c);
    const orgId = session.organization_id;
    if (!orgId) return c.json({ error: 'No organization in session' }, 401);
    const body = await c.req.json<{ title: string; assignee: string; description?: string }>();
    if (!body.title || !body.assignee) {
      return c.json({ error: 'Title and assignee are required' }, 400);
    }
    const tickets = await sprintPlannerService(c.env, orgId).createTicket(body);
    return c.json({ tickets });
  })

  // Update ticket status
  .post('/tickets/:id/status', async (c) => {
    const session = B2B.getStytchSession(c);
    const orgId = session.organization_id;
    if (!orgId) return c.json({ error: 'No organization in session' }, 401);
    const { id } = c.req.param();
    const body = await c.req.json<{ status: string }>();
    const validStatuses = ['backlog', 'in-progress', 'review', 'done'];
    if (!body.status || !validStatuses.includes(body.status)) {
      return c.json({ error: 'Invalid status' }, 400);
    }
    const tickets = await sprintPlannerService(c.env, orgId).updateTicketStatus(id, body.status);
    if (!tickets) return c.json({ error: 'Ticket not found' }, 404);
    return c.json({ tickets });
  })

  // Delete a ticket
  .delete('/tickets/:id', async (c) => {
    const session = B2B.getStytchSession(c);
    const orgId = session.organization_id;
    if (!orgId) return c.json({ error: 'No organization in session' }, 401);
    const { id } = c.req.param();
    const tickets = await sprintPlannerService(c.env, orgId).deleteTicket(id);
    if (!tickets) return c.json({ error: 'Ticket not found' }, 404);
    return c.json({ tickets });
  })

  // Search tickets
  .get('/tickets/search', async (c) => {
    const session = B2B.getStytchSession(c);
    const orgId = session.organization_id;
    if (!orgId) return c.json({ error: 'No organization in session' }, 401);
    const params = {
      status: c.req.query('status') || undefined,
      assignee: c.req.query('assignee') || undefined,
      title_contains: c.req.query('title_contains') || undefined,
    };
    const tickets = await sprintPlannerService(c.env, orgId).searchTickets(params);
    return c.json({ tickets });
  })

  // Ticket statistics
  .get('/tickets/statistics', async (c) => {
    const session = B2B.getStytchSession(c);
    const orgId = session.organization_id;
    if (!orgId) return c.json({ error: 'No organization in session' }, 401);
    const stats = await sprintPlannerService(c.env, orgId).getTicketStatistics();
    return c.json(stats);
  });
