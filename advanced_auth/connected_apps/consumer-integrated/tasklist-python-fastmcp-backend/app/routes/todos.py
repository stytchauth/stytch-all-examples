from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel
from typing import List

from ..services.todos import TodoService, Task

router = APIRouter()

class TasksResponse(BaseModel):
    tasks: List[Task]

class CreateTaskBody(BaseModel):
    taskText: str

@router.get('/tasks', response_model=TasksResponse)
async def get_tasks(request: Request):
    user_id = request.state.user.user_id  # type: ignore[attr-defined]
    todos = await TodoService(user_id).get()
    return { 'tasks': todos }

@router.post('/tasks', response_model=TasksResponse)
async def create_task(body: CreateTaskBody, request: Request):
    user_id = request.state.user.user_id  # type: ignore[attr-defined]
    todos = await TodoService(user_id).add(body.taskText)
    return { 'tasks': todos }

@router.post('/tasks/{task_id}/complete', response_model=TasksResponse)
async def complete_task(task_id: str, request: Request):
    user_id = request.state.user.user_id  # type: ignore[attr-defined]
    todos = await TodoService(user_id).mark_completed(task_id)
    return { 'tasks': todos }

@router.delete('/tasks/{task_id}', response_model=TasksResponse)
async def delete_task(task_id: str, request: Request):
    user_id = request.state.user.user_id  # type: ignore[attr-defined]
    todos = await TodoService(user_id).delete(task_id)
    return { 'tasks': todos }
