# Stytch Connected Apps: MCP Examples

A comprehensive collection of example apps demonstrating how to integrate [Stytch](https://stytch.com/) authentication with various frameworks to build AI-accessible services using the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/).

## Overview

This repository contains examples for both **Consumer** and **B2B** authentication flows, with implementations across multiple frameworks and deployment platforms.
Each example demonstrates how to build applications that can be extended for AI agent use through MCP integration.

All of the examples in this repository use Stytch to turn apps into OIDC-compliant identity providers.
Most of the examples also use Stytch as the authentication provider, but we have included a couple that use other authentication providers in conjunction with Stytch.

## Repository Structure

The examples in this repository are split by vertical (consumer, B2B), whether they use Stytch for auth (integrated) or not (standalone), and framework.
For the integrated examples, you'll find a single Vite-powered frontend that can be used with the Cloudflare Workers, Express.js, and Python backends.

```
connected-apps-examples
├── consumer-integrated         # MCP/OAuth integration with Stytch Consumer Auth
│   ├── tasklist-frontend       # React frontend (works with all backends except Next.js)
│   ├── tasklist-cfworkers-mcpsdk-backend
│   ├── tasklist-express-mcpsdk-backend
│   ├── tasklist-python-fastmcp-backend
│   └── tasklist-nextjs-vercelsdk-fullstack
├── consumer-standalone         # MCP/OAuth integration with external Consumer Auth
|   └── supabase-nextjs-user-management
├── b2b-integrated              # MCP/OAuth integration with Stytch B2B Auth
│   ├── sprintplanner-frontend  # React frontend (works with all backends)
│   ├── sprintplanner-express-mcpsdk-backend
│   └── sprintplanner-python-fastmcp-backend
└── b2b-standalone              # MCP/OAuth integration with external B2B Auth
    └── firebase-express-access-management
```

### Consumer Authentication Examples

- **Task List Application** - A todo list application demonstrating Consumer auth
- **Frameworks**: React frontend with Python (FastMCP), Express.js, and Cloudflare Workers backends; plus, a Next.js implementation
- **Features**: User registration, OAuth flows, task management, MCP integration

### B2B Authentication Examples

- **Sprint Planner Application** - A sprint tasks management application for organizations
- **Frameworks**: React frontend with Python (FastMCP) and Express.js backends
- **Features**: Organization management, team collaboration, task tracking, MCP integration

### Standalone Examples

- The consumer app is a simple social blogging platform that uses Supabase as the auth and database provider
- The B2B app is a simple access request manager that uses Firebase as the auth and database provider
- Both of these demonstrate how to use Stytch to make an app OIDC-compliant while retaining a third-party authentication provider

## Key Technologies

- **Authentication**: [Stytch Consumer](https://stytch.com/b2c) and [Stytch B2B](https://stytch.com/b2b)
- **AI Integration**: [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
- **Frameworks**: React (Vite), Next.js, Express.js, Python FastAPI/FastMCP, Cloudflare Workers
- **Platforms**: Vercel, Cloudflare, Supabase, Firebase

## Getting Started

Each example suite/app may have additional instructions -- make sure to read the embedded READMEs as well.
However, you'll need to perform the steps below for all the examples.

### Prerequisites

1. Create a [Stytch account](https://stytch.com/)
2. Choose **Consumer Authentication** or **B2B Authentication** based on your needs
3. Enable [Connected Apps](https://stytch.com/dashboard/connected-apps) for MCP integration
   - Under Settings, add an Authorization URL (http://localhost:3000/oauth/authorize) and turn on Dynamic Client Registration
   - For the standalone examples, you'll need to modify Access Token Template Content, but not for the integrated examples
4. Node.js 18+ (see `.nvmrc`) and Yarn 3

### Quickstart

1. **Clone the repository**

   ```bash
   git clone https://github.com/stytchauth/mcp-examples.git
   cd mcp-examples
   ```

2. **Install dependencies**

   ```bash
   yarn
   ```

3. **Choose an example to run**

   For the Consumer Task List with Next.js:

   ```bash
   cd consumer-integrated/tasklist-nextjs-vercelsdk-fullstack
   ```

   For B2B Sprint Planner with Python (FastMCP):

   ```bash
   cd b2b-integrated/sprintplanner-python-fastmcp-backend
   ```

4. **Follow the setup instructions** in each example's README

## Development Commands

```bash
# Build all examples
yarn build

# Lint all examples
yarn lint

# Run a specific example
yarn workspace @mcp-examples/[example-name] dev
```

## MCP Integration

Each example demonstrates how to:

- Expose application functionality through MCP tools
- Implement OAuth Protected Resource discovery (and an Authorization Server for backwards-compatibility)
- Support multiple MCP transports (Streamble HTTP, SSE)
- Provide AI agents with authenticated access to user data

### Testing MCP Servers

```bash
# Install and run the MCP Inspector
yarn dlx @modelcontextprotocol/inspector@latest

# Test any MCP-enabled backend
# Navigate to inspector URL and use http://localhost:3001/mcp
# If you're running the Vite frontends, you can also use http://localhost:3000/mcp
```

## Authentication Flows

### Consumer Authentication

- **Use case**: Consumer-facing applications, personal productivity tools
- **Features**: Email/SMS auth, OAuth providers, guest users
- **Example**: Personal task management application

### B2B Authentication

- **Use case**: Business applications, team collaboration tools
- **Features**: Organization management, SSO, member invitations, RBAC
- **Example**: Team sprint management application

## Architecture Patterns

Each integrated example follows a consistent pattern:

- **Frontend**: React application with Stytch SDK integration
- **Backend**: REST API + MCP server with user-scoped data access
- **Authentication**: OAuth 2.0 with PKCE and JWT tokens
- **AI Integration**: MCP tools and resources for agent interaction

## Support and Documentation

- **Stytch Docs**: [https://stytch.com/docs](https://stytch.com/docs)
- **MCP Docs**: [https://modelcontextprotocol.io](https://modelcontextprotocol.io)
- **Community**: [Stytch Slack](https://stytch.com/docs/resources/support/overview)
- **Issues**: [GitHub Issues](https://github.com/stytchauth/mcp-examples/issues)

## Contributing

We welcome contributions! Please see individual example READMEs for specific setup instructions and contribution guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
