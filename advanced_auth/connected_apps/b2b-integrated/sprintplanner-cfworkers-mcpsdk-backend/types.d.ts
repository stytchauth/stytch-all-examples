export interface Ticket {
    id: string;
    title: string;
    assignee: string;
    status: string;
    description?: string;
    organization_id: string;
    created_at: string;
    updated_at: string;
}

export interface TicketCreate {
    title: string;
    assignee: string;
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

export {};