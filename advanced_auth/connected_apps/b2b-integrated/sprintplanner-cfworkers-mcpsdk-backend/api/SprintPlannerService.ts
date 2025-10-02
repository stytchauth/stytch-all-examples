import { Ticket, TicketCreate, TicketSearchParams, TicketStatistics } from '../types';

/**
 * SprintPlannerService implements ticket operations backed by Cloudflare KV.
 * Tickets are stored per organization using the key `tickets:<organizationId>`.
 */
class SprintPlannerService {
  constructor(
    private env: Env,
    private organizationId: string,
  ) {}

  private kvKey(): string {
    return `tickets:${this.organizationId}`;
  }

  private async getAll(): Promise<Ticket[]> {
    const tickets = await this.env.TASKS.get<Ticket[]>(this.kvKey(), 'json');
    return tickets || [];
  }

  private async setAll(tickets: Ticket[]): Promise<Ticket[]> {
    const sorted = tickets.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    await this.env.TASKS.put(this.kvKey(), JSON.stringify(sorted));
    return sorted;
  }

  async getTickets(): Promise<Ticket[]> {
    return this.getAll();
  }

  async getTicket(id: string): Promise<Ticket | null> {
    const tickets = await this.getAll();
    return tickets.find((t) => t.id === id) || null;
  }

  async createTicket(data: TicketCreate): Promise<Ticket[]> {
    const tickets = await this.getAll();
    const now = new Date().toISOString();
    const newTicket: Ticket = {
      id: Date.now().toString(36),
      title: data.title,
      assignee: data.assignee,
      status: 'backlog',
      description: data.description,
      organization_id: this.organizationId,
      created_at: now,
      updated_at: now,
    };
    tickets.unshift(newTicket);
    return this.setAll(tickets);
  }

  async updateTicketStatus(id: string, status: string): Promise<Ticket[] | null> {
    const tickets = await this.getAll();
    const ticket = tickets.find((t) => t.id === id);
    if (!ticket) return null;
    ticket.status = status;
    ticket.updated_at = new Date().toISOString();
    return this.setAll(tickets);
  }

  async deleteTicket(id: string): Promise<Ticket[] | null> {
    const tickets = await this.getAll();
    const exists = tickets.some((t) => t.id === id);
    if (!exists) return null;
    const remaining = tickets.filter((t) => t.id !== id);
    return this.setAll(remaining);
  }

  async searchTickets(params: TicketSearchParams): Promise<Ticket[]> {
    const tickets = await this.getAll();
    return tickets.filter((t) => {
      if (params.status && t.status !== params.status) return false;
      if (params.assignee && t.assignee.toLowerCase() !== params.assignee.toLowerCase()) return false;
      if (params.title_contains && !t.title.toLowerCase().includes(params.title_contains.toLowerCase())) return false;
      return true;
    });
  }

  async getTicketStatistics(): Promise<TicketStatistics> {
    const tickets = await this.getAll();
    const status_distribution: Record<string, number> = {};
    const assignee_distribution: Record<string, number> = {};
    for (const t of tickets) {
      status_distribution[t.status] = (status_distribution[t.status] || 0) + 1;
      assignee_distribution[t.assignee] = (assignee_distribution[t.assignee] || 0) + 1;
    }
    return {
      total_tickets: tickets.length,
      status_distribution,
      assignee_distribution,
      organization_id: this.organizationId,
    };
  }
}

export const sprintPlannerService = (env: Env, organizationId: string) => new SprintPlannerService(env, organizationId);
