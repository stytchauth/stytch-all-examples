from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Base schemas
class TicketBase(BaseModel):
    title: str
    assignee: str

class TicketCreate(TicketBase):
    pass

class TicketUpdate(BaseModel):
    title: Optional[str] = None
    assignee: Optional[str] = None
    status: Optional[str] = None
    description: Optional[str] = None

class TicketStatusUpdate(BaseModel):
    status: str

# Response schemas
class TicketResponse(TicketBase):
    id: str
    status: str
    organization_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class OrganizationResponse(BaseModel):
    id: str
    name: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# List responses
class TicketListResponse(BaseModel):
    tickets: List[TicketResponse]

class OrganizationListResponse(BaseModel):
    organizations: List[OrganizationResponse]
