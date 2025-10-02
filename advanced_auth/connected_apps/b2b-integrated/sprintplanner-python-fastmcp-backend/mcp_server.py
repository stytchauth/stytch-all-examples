"""
Standalone MCP Server for the Ticket Board application
"""

from dotenv import load_dotenv
from fastmcp import FastMCP
from fastmcp.server.auth import BearerAuthProvider
from fastmcp.server.dependencies import get_access_token
from typing import List, Dict, Any, Optional
import crud
import schemas
import os


load_dotenv(".env.local")

auth = BearerAuthProvider(
    jwks_uri=f"{os.getenv('STYTCH_DOMAIN')}/.well-known/jwks.json",
    issuer=os.getenv("STYTCH_DOMAIN"),
    algorithm="RS256",
    audience=os.getenv("STYTCH_PROJECT_ID")
)

# Create FastMCP instance
mcp = FastMCP("ticket-board-mcp", auth=auth)

def get_organization_id_from_context() -> str:
    """Extract organization ID from the current session context"""
    # This will be populated by the auth system when a request comes in
    # For now, we'll get it from the access token
    token = get_access_token()
    if not token:
        raise ValueError("No access token found in context")

    return token.claims.get("https://stytch.com/organization", {}).get("organization_id")

@mcp.tool()
async def list_tickets() -> List[Dict[str, Any]]:
    """List all tickets for the authenticated organization"""
    organization_id = get_organization_id_from_context()
    tickets = crud.get_tickets(organization_id)
    return [
        {
            "id": ticket.id,
            "title": ticket.title,
            "assignee": ticket.assignee,
            "status": ticket.status,
            "description": ticket.description,
            "created_at": ticket.created_at.isoformat(),
            "updated_at": ticket.updated_at.isoformat()
        }
        for ticket in tickets
    ]

@mcp.tool()
async def get_ticket(ticket_id: str) -> Optional[Dict[str, Any]]:
    """Get a specific ticket by ID for the authenticated organization"""
    organization_id = get_organization_id_from_context()
    ticket = crud.get_ticket(ticket_id, organization_id)
    if ticket:
        return {
            "id": ticket.id,
            "title": ticket.title,
            "assignee": ticket.assignee,
            "status": ticket.status,
            "description": ticket.description,
            "created_at": ticket.created_at.isoformat(),
            "updated_at": ticket.updated_at.isoformat()
        }
    return None

@mcp.tool()
async def create_ticket(
    title: str, 
    assignee: str, 
    description: Optional[str] = None
) -> Dict[str, Any]:
    """Create a new ticket for the authenticated organization"""
    organization_id = get_organization_id_from_context()
    
    # Ensure organization exists
    crud.get_or_create_organization(organization_id)
    
    # Create ticket data
    ticket_data = schemas.TicketCreate(
        title=title,
        assignee=assignee,
        description=description
    )
    
    # Create the ticket
    ticket = crud.create_ticket(ticket_data, organization_id)
    
    return {
        "id": ticket.id,
        "title": ticket.title,
        "assignee": ticket.assignee,
        "status": ticket.status,
        "description": ticket.description,
        "created_at": ticket.created_at.isoformat(),
        "updated_at": ticket.updated_at.isoformat()
    }

@mcp.tool()
async def update_ticket_status(
    ticket_id: str, 
    status: str
) -> Optional[Dict[str, Any]]:
    """Update the status of a ticket"""
    organization_id = get_organization_id_from_context()
    ticket = crud.update_ticket_status(ticket_id, status, organization_id)
    if ticket:
        return {
            "id": ticket.id,
            "title": ticket.title,
            "assignee": ticket.assignee,
            "status": ticket.status,
            "description": ticket.description,
            "created_at": ticket.created_at.isoformat(),
            "updated_at": ticket.updated_at.isoformat()
        }
    return None

@mcp.tool()
async def delete_ticket(ticket_id: str) -> bool:
    """Delete a ticket from the authenticated organization"""
    organization_id = get_organization_id_from_context()
    return crud.delete_ticket(ticket_id, organization_id)



@mcp.tool()
async def get_organization(organization_id: str) -> Optional[Dict[str, Any]]:
    """Get a specific organization by ID"""
    org = crud.get_organization(organization_id)
    info = org.name if org else None
    return info

@mcp.tool()
async def search_tickets(
    status: Optional[str] = None,
    assignee: Optional[str] = None,
    title_contains: Optional[str] = None
) -> List[Dict[str, Any]]:
    """Search tickets with filters for the authenticated organization"""
    organization_id = get_organization_id_from_context()
    tickets = crud.search_tickets(
        organization_id,
        status=status,
        assignee=assignee,
        title_contains=title_contains,
    )
    
    return [
        {
            "id": ticket.id,
            "title": ticket.title,
            "assignee": ticket.assignee,
            "status": ticket.status,
            "description": ticket.description,
            "created_at": ticket.created_at.isoformat(),
            "updated_at": ticket.updated_at.isoformat()
        }
        for ticket in tickets
    ]

@mcp.tool()
async def get_ticket_statistics() -> Dict[str, Any]:
    """Get statistics about tickets for the authenticated organization"""
    organization_id = get_organization_id_from_context()
    tickets = crud.get_tickets(organization_id)
    
    total_tickets = len(tickets)
    status_counts = {}
    assignee_counts = {}
    
    for ticket in tickets:
        # Count by status
        status_counts[ticket.status] = status_counts.get(ticket.status, 0) + 1
        
        # Count by assignee
        assignee_counts[ticket.assignee] = assignee_counts.get(ticket.assignee, 0) + 1
    
    return {
        "total_tickets": total_tickets,
        "status_distribution": status_counts,
        "assignee_distribution": assignee_counts,
        "organization_id": organization_id
    }


@mcp.resource("tickets://authenticated", mime_type="application/json")
async def tickets_resource() -> List[Dict[str, Any]]:
    organization_id = get_organization_id_from_context()
    tickets = crud.get_tickets(organization_id)
    return [
        {
            "id": t.id,
            "title": t.title,
            "assignee": t.assignee,
            "status": t.status,
            "description": t.description,
            "created_at": t.created_at.isoformat() if t.created_at else None,
            "updated_at": t.updated_at.isoformat() if t.updated_at else None,
        }
        for t in tickets
    ]
