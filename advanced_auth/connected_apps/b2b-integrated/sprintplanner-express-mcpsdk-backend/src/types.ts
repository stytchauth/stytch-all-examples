export interface Organization {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface Ticket {
  id: string;
  title: string;
  assignee: string;
  status: string;
  description?: string;
  organization_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface TicketCreate {
  title: string;
  assignee: string;
  description?: string;
}

export interface TicketUpdate {
  title?: string;
  assignee?: string;
  status?: string;
  description?: string;
}

export interface TicketStatusUpdate {
  status: string;
}

export interface TicketListResponse {
  tickets: Ticket[];
}

export interface TicketSearchParams {
  status?: string;
  assignee?: string;
  title_contains?: string;
}

export interface TicketStatistics {
  total_tickets: number;
  status_distribution: Record<string, number>;
  assignee_distribution: Record<string, number>;
  organization_id: string;
}
