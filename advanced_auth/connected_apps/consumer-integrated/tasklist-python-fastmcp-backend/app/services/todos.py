from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy import select, update, delete
from ..db import SessionLocal, init_db
from ..models import TaskORM

class Task(BaseModel):
    id: str
    text: str
    completed: bool

class TodoService:
    def __init__(self, user_id: str):
        self.user_id = user_id
        init_db()

    def _to_model(self, orm: TaskORM) -> Task:
        return Task(id=orm.id, text=orm.text, completed=bool(orm.completed))

    async def get(self) -> List[Task]:
        with SessionLocal() as session:
            stmt = select(TaskORM).where(TaskORM.user_id == self.user_id).order_by(TaskORM.completed.asc(), TaskORM.id.asc())
            rows = session.execute(stmt).scalars().all()
            return [self._to_model(row) for row in rows]

    async def get_by_id(self, todo_id: str) -> Optional[Task]:
        with SessionLocal() as session:
            stmt = select(TaskORM).where(TaskORM.id == todo_id, TaskORM.user_id == self.user_id)
            row = session.execute(stmt).scalar_one_or_none()
            return self._to_model(row) if row else None

    async def add(self, todo_text: str) -> List[Task]:
        with SessionLocal() as session:
            new_id = str(int(__import__('time').time() * 1000))
            todo = TaskORM(id=new_id, user_id=self.user_id, text=todo_text, completed=0)
            session.add(todo)
            session.commit()
            return await self.get()

    async def delete(self, todo_id: str) -> List[Task]:
        with SessionLocal() as session:
            stmt = delete(TaskORM).where(TaskORM.id == todo_id, TaskORM.user_id == self.user_id)
            session.execute(stmt)
            session.commit()
            return await self.get()

    async def mark_completed(self, todo_id: str) -> List[Task]:
        with SessionLocal() as session:
            stmt = update(TaskORM).where(TaskORM.id == todo_id, TaskORM.user_id == self.user_id).values(completed=1)
            session.execute(stmt)
            session.commit()
            return await self.get()
