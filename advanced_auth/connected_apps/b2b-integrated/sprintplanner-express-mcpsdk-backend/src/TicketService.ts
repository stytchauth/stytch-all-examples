/* eslint-disable @typescript-eslint/no-explicit-any */

import { getDatabase, generateId } from './database.js';
import { Organization, Ticket, TicketCreate, TicketSearchParams, TicketStatistics } from './types.js';

export class TicketService {
  private db = getDatabase();
  private organizationId: string;

  constructor(organizationId: string, organizationSlug: string) {
    this.organizationId = organizationId;
    // Ensure organization exists when service is created
    this.getOrCreateOrganization(organizationSlug);
  }

  // Organization operations
  getOrganization(): Organization | null {
    const stmt = this.db.prepare('SELECT * FROM organizations WHERE id = ?');
    const row = stmt.get(this.organizationId) as any;

    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    };
  }

  private createOrganization(name: string = 'Default Organization'): Organization {
    const stmt = this.db.prepare(`
      INSERT INTO organizations (id, name, created_at, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);

    stmt.run(this.organizationId, name);

    return this.getOrganization()!;
  }

  private getOrCreateOrganization(name: string = 'Default Organization'): Organization {
    let org = this.getOrganization();
    if (!org) {
      org = this.createOrganization(name);
    }
    return org;
  }

  // Ticket operations
  getTickets(): Ticket[] {
    const stmt = this.db.prepare('SELECT * FROM tickets WHERE organization_id = ? ORDER BY created_at DESC');
    const rows = stmt.all(this.organizationId) as any[];

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      assignee: row.assignee,
      status: row.status,
      description: row.description,
      organization_id: row.organization_id,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    }));
  }

  getTicket(ticketId: string): Ticket | null {
    const stmt = this.db.prepare(`
      SELECT * FROM tickets 
      WHERE id = ? AND organization_id = ?
    `);
    const row = stmt.get(ticketId, this.organizationId) as any;

    if (!row) return null;

    return {
      id: row.id,
      title: row.title,
      assignee: row.assignee,
      status: row.status,
      description: row.description,
      organization_id: row.organization_id,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    };
  }

  createTicket(ticketData: TicketCreate): Ticket {
    const ticketId = generateId();
    const stmt = this.db.prepare(`
      INSERT INTO tickets (id, title, assignee, description, organization_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);

    stmt.run(ticketId, ticketData.title, ticketData.assignee, ticketData.description || null, this.organizationId);

    return this.getTicket(ticketId)!;
  }

  updateTicketStatus(ticketId: string, status: string): Ticket | null {
    const stmt = this.db.prepare(`
      UPDATE tickets 
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND organization_id = ?
    `);

    const result = stmt.run(status, ticketId, this.organizationId);

    if (result.changes === 0) {
      return null;
    }

    return this.getTicket(ticketId);
  }

  deleteTicket(ticketId: string): boolean {
    const stmt = this.db.prepare(`
      DELETE FROM tickets 
      WHERE id = ? AND organization_id = ?
    `);

    const result = stmt.run(ticketId, this.organizationId);
    return result.changes > 0;
  }

  searchTickets(params: TicketSearchParams): Ticket[] {
    let query = 'SELECT * FROM tickets WHERE organization_id = ?';
    const values: any[] = [this.organizationId];

    if (params.status) {
      query += ' AND status = ?';
      values.push(params.status);
    }

    if (params.assignee) {
      query += ' AND LOWER(assignee) = LOWER(?)';
      values.push(params.assignee);
    }

    if (params.title_contains) {
      query += ' AND LOWER(title) LIKE LOWER(?)';
      values.push(`%${params.title_contains}%`);
    }

    query += ' ORDER BY created_at DESC';

    const stmt = this.db.prepare(query);
    const rows = stmt.all(...values) as any[];

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      assignee: row.assignee,
      status: row.status,
      description: row.description,
      organization_id: row.organization_id,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    }));
  }

  getTicketStatistics(): TicketStatistics {
    const tickets = this.getTickets();

    const statusDistribution: Record<string, number> = {};
    const assigneeDistribution: Record<string, number> = {};

    tickets.forEach((ticket) => {
      // Count by status
      statusDistribution[ticket.status] = (statusDistribution[ticket.status] || 0) + 1;

      // Count by assignee
      assigneeDistribution[ticket.assignee] = (assigneeDistribution[ticket.assignee] || 0) + 1;
    });

    return {
      total_tickets: tickets.length,
      status_distribution: statusDistribution,
      assignee_distribution: assigneeDistribution,
      organization_id: this.organizationId,
    };
  }
}
