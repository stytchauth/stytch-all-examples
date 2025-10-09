#!/usr/bin/env python3
"""
Database initialization script for the Ticket Board application
"""

from database import engine
import models
import crud
import schemas
from sqlalchemy.orm import Session
from database import SessionLocal

def init_db():
    """Initialize the database with tables and sample data"""
    
    # Create all tables
    print("Creating database tables...")
    models.Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully!")
    
    

if __name__ == "__main__":
    init_db()
