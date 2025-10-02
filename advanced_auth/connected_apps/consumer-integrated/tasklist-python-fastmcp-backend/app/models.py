from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.sql import func
from .db import Base

class TaskORM(Base):
    __tablename__ = 'tasks'

    id = Column(String, primary_key=True)
    user_id = Column(String, nullable=False, index=True)
    text = Column(String, nullable=False)
    completed = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
