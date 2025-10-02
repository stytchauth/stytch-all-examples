import os
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
from . import mcp_server

from .routes.health import router as health_router
from .routes.todos import router as tasks_router
from .security import authorize_session

load_dotenv('.env.local')

class Settings(BaseSettings):
    PORT: int = int(os.getenv('PORT', '3001'))
    STYTCH_PROJECT_ID: str | None = os.getenv('STYTCH_PROJECT_ID')
    STYTCH_PROJECT_SECRET: str | None = os.getenv('STYTCH_PROJECT_SECRET')
    STYTCH_DOMAIN: str | None = os.getenv('STYTCH_DOMAIN')

settings = Settings()

mcp_app = mcp_server.mcp.http_app(path="/")
app = FastAPI(title="Tasklist Python Backend", lifespan=mcp_app.lifespan)
app.mount("/mcp", mcp_app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Mount REST routes
app.include_router(health_router, prefix="/api")
app.include_router(tasks_router, prefix="/api", dependencies=[Depends(authorize_session)])

# OAuth Protected Resource metadata
@app.get('/.well-known/oauth-protected-resource')
def oauth_protected_resource_root(request: Request):
    base_url = str(request.base_url).rstrip('/')
    return {
        "resource": base_url,
        "authorization_servers": [settings.STYTCH_DOMAIN],
        "scopes_supported": ["openid", "email", "profile"],
    }

@app.get('/.well-known/oauth-protected-resource/{transport:path}')
def oauth_protected_resource_transport(request: Request, transport: str):
    base_url = str(request.base_url).rstrip('/')
    return {
        "resource": base_url,
        "authorization_servers": [settings.STYTCH_DOMAIN],
        "scopes_supported": ["openid", "email", "profile"],
    }

# Back-compat: OAuth Authorization Server metadata
@app.get('/.well-known/oauth-authorization-server')
def oauth_authorization_server(request: Request):
    base_url = str(request.base_url).rstrip('/')
    auth_domain = settings.STYTCH_DOMAIN
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
