import { Router, Request, Response } from 'express';
import { authorizeSessionMiddleware, getTicketServiceForRequest } from './auth.js';
import { TicketListResponse } from './types.js';

const router = Router();

// Get all tickets for the organization
router.get('/tickets', authorizeSessionMiddleware(), async (req: Request, res: Response) => {
  try {
    const ticketService = getTicketServiceForRequest(req);

    const tickets = ticketService.getTickets();
    const response: TicketListResponse = { tickets };

    res.json(response);
  } catch (error) {
    console.error('Error getting tickets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new ticket
router.post('/tickets', authorizeSessionMiddleware(), async (req: Request, res: Response) => {
  try {
    const ticketService = getTicketServiceForRequest(req);

    // Validate request body
    const { title, assignee, description } = req.body;
    if (!title || !assignee) {
      res.status(400).json({ error: 'Title and assignee are required' });
      return;
    }

    // Create the ticket
    ticketService.createTicket({ title, assignee, description });

    // Return all tickets for the organization
    const tickets = ticketService.getTickets();
    const response: TicketListResponse = { tickets };

    res.json(response);
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update ticket status
router.post('/tickets/:ticketId/status', authorizeSessionMiddleware(), async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    const ticketService = getTicketServiceForRequest(req);

    // Validate request body
    const { status } = req.body;
    if (!status) {
      res.status(400).json({ error: 'Status is required' });
      return;
    }

    // Validate status
    const validStatuses = ['backlog', 'in-progress', 'review', 'done'];
    if (typeof status !== 'string' || !validStatuses.includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    // Update the ticket
    const updatedTicket = ticketService.updateTicketStatus(ticketId!, status);
    if (!updatedTicket) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }

    // Return all tickets for the organization
    const tickets = ticketService.getTickets();
    const response: TicketListResponse = { tickets };

    res.json(response);
  } catch (error) {
    console.error('Error updating ticket status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a ticket
router.delete('/tickets/:ticketId', authorizeSessionMiddleware(), async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    const ticketService = getTicketServiceForRequest(req);

    // Delete the ticket
    const success = ticketService.deleteTicket(ticketId!);
    if (!success) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }

    // Return all tickets for the organization
    const tickets = ticketService.getTickets();
    const response: TicketListResponse = { tickets };

    res.json(response);
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search tickets
router.get('/tickets/search', authorizeSessionMiddleware(), async (req: Request, res: Response) => {
  try {
    const ticketService = getTicketServiceForRequest(req);

    const searchParams = {
      status: req.query.status as string,
      assignee: req.query.assignee as string,
      title_contains: req.query.title_contains as string,
    };

    const tickets = ticketService.searchTickets(searchParams);
    const response: TicketListResponse = { tickets };

    res.json(response);
  } catch (error) {
    console.error('Error searching tickets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get ticket statistics
router.get('/tickets/statistics', authorizeSessionMiddleware(), async (req: Request, res: Response) => {
  try {
    const ticketService = getTicketServiceForRequest(req);

    const statistics = ticketService.getTicketStatistics();

    res.json(statistics);
  } catch (error) {
    console.error('Error getting ticket statistics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
