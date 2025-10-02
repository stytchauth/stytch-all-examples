import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { TicketService } from './TicketService.js';
import { Ticket, TicketCreate, TicketSearchParams } from './types.js';

function formatResponse(description: string, tickets: Ticket[]) {
  return {
    content: [
      {
        type: 'text' as const,
        text: `Success! ${description}\n\nTickets:\n${JSON.stringify(tickets, null, 2)}`,
      },
    ],
  };
}

function formatSingleTicketResponse(description: string, ticket: Ticket | null) {
  return {
    content: [
      {
        type: 'text' as const,
        text: `Success! ${description}\n\nTicket:\n${ticket ? JSON.stringify(ticket, null, 2) : 'null'}`,
      },
    ],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatStatisticsResponse(description: string, statistics: any) {
  return {
    content: [
      {
        type: 'text' as const,
        text: `Success! ${description}\n\nStatistics:\n${JSON.stringify(statistics, null, 2)}`,
      },
    ],
  };
}

export function createMcpServer(ticketService: TicketService): McpServer {
  const server = new McpServer({ name: 'Ticket Board Service', version: '1.0.0' });

  // Resource: Tickets
  server.resource(
    'Tickets',
    new ResourceTemplate('tickets://authenticated/{id}', {
      list: async () => {
        const tickets = ticketService.getTickets();
        return {
          resources: tickets.map((ticket) => ({
            name: ticket.title,
            uri: `tickets://authenticated/${ticket.id}`,
          })),
        };
      },
    }),
    async (uri, { id }) => {
      if (typeof id !== 'string') {
        throw new Error('Invalid ticket ID');
      }
      const ticket = ticketService.getTicket(id);
      return {
        contents: [
          {
            uri: uri.href,
            text: ticket
              ? `ID: ${ticket.id}\nTitle: ${ticket.title}\nAssignee: ${ticket.assignee}\nStatus: ${ticket.status}\nDescription: ${ticket.description || 'No description'}\nCreated: ${ticket.created_at.toISOString()}\nUpdated: ${ticket.updated_at.toISOString()}`
              : 'NOT FOUND',
          },
        ],
      };
    },
  );

  // Tool: List all tickets
  server.tool('list_tickets', 'List all tickets for the authenticated organization', {}, async () => {
    const tickets = ticketService.getTickets();
    return formatResponse('Listed all tickets', tickets);
  });

  // Tool: Get specific ticket
  server.tool(
    'get_ticket',
    'Get a specific ticket by ID',
    { ticket_id: z.string().describe('The ID of the ticket to retrieve') },
    async ({ ticket_id }) => {
      if (!ticket_id) {
        throw new Error('ticket_id is required');
      }
      const ticket = ticketService.getTicket(ticket_id);
      return formatSingleTicketResponse('Retrieved ticket', ticket);
    },
  );

  // Tool: Create ticket
  server.tool(
    'create_ticket',
    'Create a new ticket',
    {
      title: z.string().describe('The title of the ticket'),
      assignee: z.string().describe('The person assigned to the ticket'),
      description: z.string().optional().describe('Optional description of the ticket'),
    },
    async ({ title, assignee, description }) => {
      const ticketData: TicketCreate = {
        title,
        assignee,
        ...(description !== undefined ? { description } : {}),
      };
      const newTicket = ticketService.createTicket(ticketData);
      return formatSingleTicketResponse('Created new ticket', newTicket);
    },
  );

  // Tool: Update ticket status
  server.tool(
    'update_ticket_status',
    'Update the status of a ticket',
    {
      ticket_id: z.string().describe('The ID of the ticket to update'),
      status: z.enum(['backlog', 'in-progress', 'review', 'done']).describe('The new status for the ticket'),
    },
    async ({ ticket_id, status }) => {
      const updatedTicket = ticketService.updateTicketStatus(ticket_id, status);
      return formatSingleTicketResponse('Updated ticket status', updatedTicket);
    },
  );

  // Tool: Delete ticket
  server.tool(
    'delete_ticket',
    'Delete a ticket',
    { ticket_id: z.string().describe('The ID of the ticket to delete') },
    async ({ ticket_id }) => {
      const success = ticketService.deleteTicket(ticket_id);
      return {
        content: [
          {
            type: 'text' as const,
            text: success ? `Success! Deleted ticket ${ticket_id}` : `Failed! Ticket ${ticket_id} not found`,
          },
        ],
      };
    },
  );

  // Tool: Search tickets
  server.tool(
    'search_tickets',
    'Search tickets with filters',
    {
      status: z.string().optional().describe('Filter by status (backlog, in-progress, review, done)'),
      assignee: z.string().optional().describe('Filter by assignee name'),
      title_contains: z.string().optional().describe('Filter by title containing text'),
    },
    async ({ status, assignee, title_contains }) => {
      const searchParams: TicketSearchParams = {
        ...(status !== undefined ? { status } : {}),
        ...(assignee !== undefined ? { assignee } : {}),
        ...(title_contains !== undefined ? { title_contains } : {}),
      };
      const tickets = ticketService.searchTickets(searchParams);
      return formatResponse('Searched tickets', tickets);
    },
  );

  // Tool: Get ticket statistics
  server.tool('get_ticket_statistics', 'Get statistics about tickets for the organization', {}, async () => {
    const statistics = ticketService.getTicketStatistics();
    return formatStatisticsResponse('Retrieved ticket statistics', statistics);
  });

  // Tool: Get organization info
  server.tool('get_organization', 'Get information about the current organization', {}, async () => {
    const organization = ticketService.getOrganization();
    return {
      content: [
        {
          type: 'text' as const,
          text: organization ? `Organization: ${organization.name} (ID: ${organization.id})` : 'Organization not found',
        },
      ],
    };
  });

  return server;
}
