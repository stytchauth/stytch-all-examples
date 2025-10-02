import os
from fastmcp import FastMCP
from pydantic import BaseModel
from typing import List

from .services.todos import TodoService, Task
from fastmcp.server.auth import BearerAuthProvider
from fastmcp.server.dependencies import get_access_token
from dotenv import load_dotenv

load_dotenv('.env.local')


# Configure FastMCP with JWT auth so get_access_token() is available
STYTCH_DOMAIN = os.getenv('STYTCH_DOMAIN')
STYTCH_PROJECT_ID = os.getenv('STYTCH_PROJECT_ID')
PUBLIC_BASE_URL = os.getenv('PUBLIC_BASE_URL', 'http://localhost:3001')

auth = BearerAuthProvider(
    jwks_uri=f"{STYTCH_DOMAIN}/.well-known/jwks.json",
    issuer=STYTCH_DOMAIN,
    algorithm="RS256",
    audience=STYTCH_PROJECT_ID
)

mcp = FastMCP(
    "TaskList Service",
    auth=auth,
    # Ensure we don't double-prefix paths when mounting under /mcp in FastAPI
    streamable_http_path="/",
)

def _get_user_id_from_token() -> str:
    token = get_access_token()
    if not token:
        raise ValueError("Unauthorized: missing access token")

    return token.claims.get("sub")

class TasksResponse(BaseModel):
    tasks: List[Task]

@mcp.tool()
async def createTask(taskText: str) -> TasksResponse:
    user_id = _get_user_id_from_token()
    service = TodoService(user_id)
    todos = await service.add(taskText)
    return TasksResponse(tasks=todos)

@mcp.tool()
async def markTaskComplete(taskID: str) -> TasksResponse:
    user_id = _get_user_id_from_token()
    service = TodoService(user_id)
    todos = await service.mark_completed(taskID)
    return TasksResponse(tasks=todos)

@mcp.tool()
async def deleteTask(taskID: str) -> TasksResponse:
    user_id = _get_user_id_from_token()
    service = TodoService(user_id)
    todos = await service.delete(taskID)
    return TasksResponse(tasks=todos)

@mcp.resource("resource://tasks")
async def tasks() -> TasksResponse:
    user_id = _get_user_id_from_token()
    service = TodoService(user_id)
    todos = await service.get()
    return TasksResponse(tasks=todos)

@mcp.resource("resource://tasks/{task_id}")
async def task(task_id: str) -> TasksResponse:
    user_id = _get_user_id_from_token()
    service = TodoService(user_id)
    todo = await service.get_by_id(task_id)
    return TasksResponse(tasks=[todo] if todo else [])