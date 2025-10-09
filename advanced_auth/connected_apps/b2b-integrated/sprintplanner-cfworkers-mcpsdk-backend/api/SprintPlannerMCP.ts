import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { sprintPlannerService } from './SprintPlannerService';
import { Ticket } from '../types';

function formatResponse(
  description: string,
  newState: Ticket[],
): {
  content: Array<{ type: 'text'; text: string }>;
} {
  return {
    content: [
      {
        type: 'text',
        text: `Success! ${description}\n\nNew state:\n${JSON.stringify(newState, null, 2)}}`,
      },
    ],
  };
}

// Creates a stateless MCP Server instance to process the request
// The MCP Server will be bound to the provided organizationID and will only access that user's information
export function createMcpServer(env: Env, organizationId: string): McpServer {
  const svc = sprintPlannerService(env, organizationId);

  const server = new McpServer({ name: 'SprintPlanner Service', version: '1.0.0' });

  server.resource(
    'Tickets',
    new ResourceTemplate('sprintplanner://tickets/{id}', {
      list: async () => {
        const tickets = await svc.getTickets();
        return {
          resources: tickets.map((t) => ({
            name: `${t.title} (${t.status})`,
            uri: `sprintplanner://tickets/${t.id}`,
          })),
        };
      },
    }),
    async (uri, { id }) => {
      const ticket = await svc.getTicket(id);
      return {
        contents: [
          {
            uri: uri.href,
            text: ticket ? JSON.stringify(ticket, null, 2) : 'NOT FOUND',
          },
        ],
      };
    },
  );

  server.tool(
    'create_ticket',
    'Create a new ticket',
    { title: z.string(), assignee: z.string(), description: z.string().optional() },
    async ({ title, assignee, description }) => {
      const tickets = await svc.createTicket({ title, assignee, description });
      return formatResponse('Ticket created successfully', tickets);
    },
  );

  server.tool(
    'update_ticket_status',
    'Update ticket status',
    { id: z.string(), status: z.enum(['backlog', 'in-progress', 'review', 'done']) },
    async ({ id, status }) => {
      const tickets = await svc.updateTicketStatus(id, status);
      if (!tickets) {
        return { content: [{ type: 'text', text: 'Ticket not found' }] };
      }
      return formatResponse('Ticket status updated successfully', tickets);
    },
  );

  server.tool('delete_ticket', 'Delete a ticket', { id: z.string() }, async ({ id }) => {
    const tickets = await svc.deleteTicket(id);
    if (!tickets) {
      return { content: [{ type: 'text', text: 'Ticket not found' }] };
    }
    return formatResponse('Ticket deleted successfully', tickets);
  });

  server.tool('list_tickets', 'List all tickets', {}, async () => {
    const tickets = await svc.getTickets();
    return { content: [{ type: 'text', text: JSON.stringify(tickets, null, 2) }] };
  });

  server.tool(
    'search_tickets',
    'Search tickets',
    { status: z.string().optional(), assignee: z.string().optional(), title_contains: z.string().optional() },
    async (params) => {
      const tickets = await svc.searchTickets(params);
      return { content: [{ type: 'text', text: JSON.stringify(tickets, null, 2) }] };
    },
  );

  server.tool('get_ticket_statistics', 'Get ticket statistics', {}, async () => {
    const stats = await svc.getTicketStatistics();
    return { content: [{ type: 'text', text: JSON.stringify(stats, null, 2) }] };
  });

  return server;
}
