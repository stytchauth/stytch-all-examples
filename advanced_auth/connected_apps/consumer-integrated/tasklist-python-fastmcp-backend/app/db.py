import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

DB_PATH = os.path.join(os.getcwd(), 'todos.db')
DB_URL = f"sqlite:///{DB_PATH}"

# For SQLite with FastAPI, allow multithreaded access
engine = create_engine(DB_URL, future=True, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)

class Base(DeclarativeBase):
    pass


def init_db() -> None:
    # Import models to register metadata
    from . import models  # noqa: F401
    Base.metadata.create_all(bind=engine)
