from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from typing import List, Optional
import models
import schemas
from database import SessionLocal

# Organization CRUD operations
def get_organization(org_id: str) -> Optional[models.Organization]:
    with SessionLocal() as db:
        return db.query(models.Organization).filter(models.Organization.id == org_id).first()

def create_organization(name: str) -> models.Organization:
    with SessionLocal() as db:
        db_org = models.Organization(name=name)
        db.add(db_org)
        db.commit()
        db.refresh(db_org)
        return db_org

def get_or_create_organization(org_id: str, name: str = "Default Organization") -> models.Organization:
    """Get existing organization or create a new one"""
    with SessionLocal() as db:
        org = db.query(models.Organization).filter(models.Organization.id == org_id).first()
        if not org:
            org = models.Organization(id=org_id, name=name)
            db.add(org)
            db.commit()
            db.refresh(org)
        return org

# Ticket CRUD operations
def get_tickets(org_id: str) -> List[models.Ticket]:
    with SessionLocal() as db:
        return db.query(models.Ticket).filter(models.Ticket.organization_id == org_id).all()

def search_tickets(
    org_id: str,
    status: Optional[str] = None,
    assignee: Optional[str] = None,
    title_contains: Optional[str] = None,
) -> List[models.Ticket]:
    """Search tickets for an organization using DB-side filtering."""
    with SessionLocal() as db:
        query = db.query(models.Ticket).filter(models.Ticket.organization_id == org_id)

        if status:
            query = query.filter(models.Ticket.status == status)
        if assignee:
            query = query.filter(func.lower(models.Ticket.assignee) == assignee.lower())
        if title_contains:
            query = query.filter(func.lower(models.Ticket.title).contains(title_contains.lower()))

        return query.all()

def get_ticket(ticket_id: str, org_id: str) -> Optional[models.Ticket]:
    with SessionLocal() as db:
        return db.query(models.Ticket).filter(
            and_(models.Ticket.id == ticket_id, models.Ticket.organization_id == org_id)
        ).first()

def create_ticket(ticket: schemas.TicketCreate, org_id: str) -> models.Ticket:
    with SessionLocal() as db:
        db_ticket = models.Ticket(
            title=ticket.title,
            assignee=ticket.assignee,
            description=getattr(ticket, 'description', None),  # Handle optional description field
            organization_id=org_id
        )
        db.add(db_ticket)
        db.commit()
        db.refresh(db_ticket)
        return db_ticket

def update_ticket_status(ticket_id: str, status: str, org_id: str) -> Optional[models.Ticket]:
    with SessionLocal() as db:
        ticket = db.query(models.Ticket).filter(
            and_(models.Ticket.id == ticket_id, models.Ticket.organization_id == org_id)
        ).first()
        if ticket:
            ticket.status = status
            db.commit()
            db.refresh(ticket)
        return ticket

def update_ticket(ticket_id: str, ticket_update: schemas.TicketUpdate, org_id: str) -> Optional[models.Ticket]:
    with SessionLocal() as db:
        ticket = db.query(models.Ticket).filter(
            and_(models.Ticket.id == ticket_id, models.Ticket.organization_id == org_id)
        ).first()
        if ticket:
            update_data = ticket_update.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(ticket, field, value)
            db.commit()
            db.refresh(ticket)
        return ticket

def delete_ticket(ticket_id: str, org_id: str) -> bool:
    with SessionLocal() as db:
        ticket = db.query(models.Ticket).filter(
            and_(models.Ticket.id == ticket_id, models.Ticket.organization_id == org_id)
        ).first()
        if ticket:
            db.delete(ticket)
            db.commit()
            return True
        return False

