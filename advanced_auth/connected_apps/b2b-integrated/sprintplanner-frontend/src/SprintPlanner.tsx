import { useState, useEffect, FormEvent } from 'react';
import { withLoginRequired } from './Auth';
import type { Ticket } from './types';
import { useStytchMember, useStytchOrganization } from '@stytch/react/b2b';

const SprintPlanner = withLoginRequired(() => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const { organization } = useStytchOrganization();
  const { member } = useStytchMember();

  // Fetch tickets on component mount
  useEffect(() => {
    getTickets().then((tickets) => setTickets(tickets));
  }, []);

  const createTicket = (title: string) => {
    return fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, assignee: member?.email_address }),
    })
      .then((res) => res.json())
      .then((res) => res.tickets);
  };

  const getTickets = () => {
    return fetch('/api/tickets', {})
      .then((res) => res.json())
      .then((res) => res.tickets);
  };

  const updateTicketStatus = (id: string, status: Ticket['status']) => {
    return fetch(`/api/tickets/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then((res) => res.tickets);
  };

  const deleteTicket = (id: string) => {
    return fetch(`/api/tickets/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((res) => res.tickets);
  };

  const onAddTicket = (evt: FormEvent) => {
    evt.preventDefault();
    if (!newTicketTitle.trim()) return;

    createTicket(newTicketTitle).then((tickets) => setTickets(tickets));
    setNewTicketTitle('');
  };

  const onUpdateStatus = (id: string, newStatus: Ticket['status']) => {
    updateTicketStatus(id, newStatus).then((tickets) => setTickets(tickets));
  };

  const onDeleteTicket = (id: string) => {
    deleteTicket(id).then((tickets) => setTickets(tickets));
  };

  const statusColumns: {
    status: Ticket['status'];
    title: string;
    color: string;
  }[] = [
    { status: 'backlog', title: 'Backlog', color: 'bg-gray-100' },
    { status: 'in-progress', title: 'In Progress', color: 'bg-blue-100' },
    { status: 'review', title: 'Review', color: 'bg-yellow-100' },
    { status: 'done', title: 'Done', color: 'bg-green-100' },
  ];

  const getTicketsByStatus = (status: Ticket['status']) => tickets.filter((ticket) => ticket.status === status);

  return (
    <div className="sprintPlanner">
      <div className="boardHeader">{organization && <p>Organization: {organization.organization_name}</p>}</div>

      {/* Create Ticket Form */}
      <form onSubmit={onAddTicket} className="createTicketForm">
        <input
          type="text"
          placeholder="Ticket title"
          value={newTicketTitle}
          onChange={(e) => setNewTicketTitle(e.target.value)}
          required
        />
        <button type="submit" className="primary">
          Create Ticket
        </button>
      </form>

      {/* Ticket Board */}
      <div className="boardColumns">
        {statusColumns.map((column) => (
          <div key={column.status} className={`column ${column.color}`}>
            <h3>{column.title}</h3>
            <div className="tickets">
              {getTicketsByStatus(column.status).map((ticket) => (
                <div key={ticket.id} className="ticket">
                  <div className="ticketHeader">
                    <h4>{ticket.title}</h4>
                    <button onClick={() => onDeleteTicket(ticket.id)} className="deleteBtn">
                      ×
                    </button>
                  </div>
                  <p className="assignee">Assignee: {ticket.assignee}</p>
                  <div className="statusControls">
                    {statusColumns.map((statusCol) => (
                      <button
                        key={statusCol.status}
                        onClick={() => onUpdateStatus(ticket.id, statusCol.status)}
                        className={`statusBtn ${ticket.status === statusCol.status ? 'active' : ''}`}
                      >
                        {statusCol.title}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default SprintPlanner;
