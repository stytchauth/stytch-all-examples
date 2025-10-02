# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This is a Yarn 3 monorepo containing MCP (Model Context Protocol) examples using Stytch authentication. The main components are:

- `consumer-integrated/tasklist-cfworkers-mcpsdk-backend/` - Cloudflare Workers backend with Hono framework serving both REST API and MCP server
- `consumer-integrated/tasklist-frontend/` - React frontend using Vite and Stytch authentication

## Common Commands

### Root level commands

```bash
# Build all workspaces
yarn build

# Lint all workspaces
yarn lint
```

### Backend (Cloudflare Workers)

```bash
# Run backend locally
yarn workspace @mcp-examples/tasklist-cfworkers-mcpsdk-backend dev

# Deploy to Cloudflare
yarn workspace @mcp-examples/tasklist-cfworkers-mcpsdk-backend deploy

# Build TypeScript
yarn workspace @mcp-examples/tasklist-cfworkers-mcpsdk-backend build

# Generate Cloudflare types
yarn workspace @mcp-examples/tasklist-cfworkers-mcpsdk-backend cf-typegen
```

### Frontend (React/Vite)

```bash
# Run frontend locally
yarn workspace @mcp-examples/tasklist-frontend dev

# Build for production
yarn workspace @mcp-examples/tasklist-frontend build

# Lint frontend code
yarn workspace @mcp-examples/tasklist-frontend lint

# Preview build
yarn workspace @mcp-examples/tasklist-frontend preview
```

### MCP Testing

```bash
# Test MCP server with Inspector
yarn dlx @modelcontextprotocol/inspector@latest
```

## Architecture Overview

### Backend Architecture

- **Framework**: Hono on Cloudflare Workers
- **Authentication**: Stytch Consumer OAuth with JWT tokens
- **Storage**: Cloudflare KV for task persistence
- **MCP Server**: Implements Model Context Protocol with tools (createTask, markTaskComplete, deleteTask) and resources
- **Transport**: Supports both SSE (`/sse`) and HTTP Streaming (`/mcp`) transports
- **OAuth**: Implements OAuth Protected Resource discovery with `.well-known` endpoints

### Frontend Architecture

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Authentication**: Stytch React SDK
- **Routing**: React Router DOM
- **Auth Flow**: OAuth authorization code flow with PKCE

### Key Integration Points

- Backend serves MCP at `http://localhost:3001/mcp` (authenticated)
- Frontend handles OAuth authorization flow at `/oauth/authorize`
- Both components use Stytch for user authentication and session management
- MCP server is user-scoped - each authenticated user gets their own task context

### Configuration Files

- Backend uses `.dev.vars` for local environment variables (Stytch credentials)
- Frontend uses `.env.local` for Stytch public token
- Cloudflare Workers configuration in `wrangler.jsonc` includes KV namespace binding
