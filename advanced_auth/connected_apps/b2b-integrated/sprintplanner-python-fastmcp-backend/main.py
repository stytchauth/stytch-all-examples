from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import crud
import models
import schemas
from database import engine
from mcp_server import mcp  
from stytch_client import stytch_client

# SETUP steps
models.Base.metadata.create_all(bind=engine)
# Build MCP ASGI app first to wire lifespan
mcp_app = mcp.http_app(path="/")
# Pass MCP lifespan into FastAPI so StreamableHTTP session manager is initialized
app = FastAPI(title="Ticket Board API", version="1.0.0", lifespan=mcp_app.lifespan)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the MCP endpoints at /mcp
app.mount("/mcp", mcp_app)

async def verify_stytch_session(request: Request):
    
    session_jwt = request.cookies.get('stytch_session_jwt')
    
    if not session_jwt:
        raise HTTPException(status_code=401, detail="Missing session cookie")

    session = await stytch_client.verify_session(session_jwt)
    
    if not session or not session.get("organization_id"):
        raise HTTPException(status_code=401, detail="Invalid or expired session")

    return session

@app.get("/")
async def root():
    return {"message": "Ticket Board API"}

@app.get("/api/tickets", response_model=schemas.TicketListResponse)
async def get_tickets(
    session: dict = Depends(verify_stytch_session)
):
    """Get all tickets for the organization"""
    org_id = session["organization_id"]
    
    # Ensure organization exists
    crud.get_or_create_organization(org_id)
    
    tickets = crud.get_tickets(org_id)
    return schemas.TicketListResponse(tickets=tickets)

@app.post("/api/tickets", response_model=schemas.TicketListResponse)
async def create_ticket(
    request: Request,
    session: dict = Depends(verify_stytch_session)
):
    """Create a new ticket"""
    # Parse the JSON manually to see what's being sent
    try:
        import json
        body = await request.body()
        if body:
            json_data = json.loads(body)
            
            # Validate against schema
            ticket_data = schemas.TicketCreate(**json_data)
        else:
            raise HTTPException(status_code=400, detail="Empty request body")
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail="Invalid JSON")
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))
    
    org_id = session["organization_id"]
    
    # Ensure organization exists
    organization = crud.get_or_create_organization(org_id)
    
    # Create the ticket
    new_ticket = crud.create_ticket(ticket_data, org_id)
    
    # Return all tickets for the organization
    tickets = crud.get_tickets(org_id)
    
    response = schemas.TicketListResponse(tickets=tickets)
    return response

@app.post("/api/tickets/{ticket_id}/status", response_model=schemas.TicketListResponse)
async def update_ticket_status(
    ticket_id: str,
    request: Request,
    session: dict = Depends(verify_stytch_session)
):
    """Update ticket status"""
    org_id = session["organization_id"]
    
    # Parse the JSON manually to see what's being sent
    try:
        import json
        body = await request.body()
        if body:
            json_data = json.loads(body)
            
            # Validate against schema
            status_data = schemas.TicketStatusUpdate(**json_data)
        else:
            raise HTTPException(status_code=400, detail="Empty request body")
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail="Invalid JSON")
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))
    
    # Validate status
    valid_statuses = ["backlog", "in-progress", "review", "done"]
    if status_data.status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    # Update the ticket
    ticket = crud.update_ticket_status(ticket_id, status_data.status, org_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    # Return all tickets for the organization
    tickets = crud.get_tickets(org_id)
    return schemas.TicketListResponse(tickets=tickets)

@app.delete("/api/tickets/{ticket_id}", response_model=schemas.TicketListResponse)
async def delete_ticket(
    ticket_id: str,
    session: dict = Depends(verify_stytch_session)
):
    """Delete a ticket"""
    org_id = session["organization_id"]
    
    # Delete the ticket
    success = crud.delete_ticket(ticket_id, org_id)
    if not success:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    # Return all tickets for the organization
    tickets = crud.get_tickets(org_id)
    return schemas.TicketListResponse(tickets=tickets)

@app.get("/.well-known/oauth-protected-resource")
async def oauth_metadata(request: Request) -> JSONResponse:
    base_url = str(request.base_url).rstrip("/")

    return JSONResponse(
        {
            "resource": base_url,
            "authorization_servers": [os.getenv("STYTCH_DOMAIN")],
            "scopes_supported": ["openid", "email", "profile"]
        }
    )

@app.get('/.well-known/oauth-protected-resource/{transport:path}')
def oauth_protected_resource_transport(request: Request, transport: str):
    base_url = str(request.base_url).rstrip('/')
    return {
        "resource": base_url,
        "authorization_servers": [os.getenv("STYTCH_DOMAIN")],
        "scopes_supported": ["openid", "email", "profile"],
    }

# Back-compat: OAuth Authorization Server metadata
@app.get('/.well-known/oauth-authorization-server')
def oauth_authorization_server(request: Request):
    base_url = str(request.base_url).rstrip('/')
    auth_domain = os.getenv("STYTCH_DOMAIN")
    return {
        "issuer": auth_domain,
        "authorization_endpoint": f"{base_url}/oauth/authorize",
        "token_endpoint": f"{auth_domain}/v1/oauth2/token",
        "registration_endpoint": f"{auth_domain}/v1/oauth2/register",
        "scopes_supported": ["openid", "email", "profile"],
        "response_types_supported": ["code"],
        "response_modes_supported": ["query"],
        "grant_types_supported": ["authorization_code", "refresh_token"],
        "token_endpoint_auth_methods_supported": ["none"],
        "code_challenge_methods_supported": ["S256"],
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=3001)
