# Stytch B2B Go Backend Example

A Go HTTP server demonstrating Stytch B2B authentication with a shared React UI. This backend handles authentication flows, organization management, and session handling while communicating with a frontend UI application.

## What This Backend Does

- **Email Magic Link Authentication**: Handles magic link authentication requests
- **Organization Discovery**: Lists organizations for authenticated users
- **Organization Creation**: Creates new organizations via discovery flow
- **Session Management**: Manages user sessions and cookies
- **CORS Support**: Enables cross-origin requests from the UI app

## Quick Start

1. **Install Go dependencies**:

   ```bash
   go mod tidy
   ```

2. **Configure your Stytch credentials**:
   Copy the template file and add your Stytch credentials:

   ```bash
   cp .env.template .env
   ```

   **Find your credentials:** Go to the [Stytch Dashboard](https://stytch.com/dashboard) → Project Overview page → copy your **Project ID** and **Secret** into the `.env` file.

   ```bash
   PROJECT_ID=your_stytch_project_id_here
   PROJECT_SECRET=your_stytch_secret_here
   ```

3. **Start the Go backend server**:

   ```bash
   go run .
   ```

   The server will start on [http://localhost:3000](http://localhost:3000)

4. **Start the shared UI app** (in a separate terminal):

   ```bash
   cd ../../ui/b2b
   yarn dev
   ```

   The UI will start on [http://localhost:3001](http://localhost:3001)

5. **Open your browser**:
   Navigate to [http://localhost:3001](http://localhost:3001) to use the application

## Configuration

### OAuth Configuration

By default, the UI app only includes email magic link authentication. To enable Google OAuth login:

1. Open `../../ui/b2b/src/config.ts`
2. Change `ENABLE_OAUTH` from `false` to `true`:

```typescript
export const ENABLE_OAUTH = true;
```

**When `ENABLE_OAUTH = true`:**

- Google OAuth login button will be visible
- OAuth authentication flows will be available

**When `ENABLE_OAUTH = false` (default):**

- Only email magic link authentication is available
- OAuth login button is hidden

## Architecture

This setup demonstrates a full-stack B2B authentication system:

- **Backend**: Go HTTP server (port 3000)
- **Frontend**: React + TypeScript + Vite (port 3001)
- **Authentication**: Stytch B2B SDK
- **Session Management**: HTTP cookies with CORS support
- **Communication**: REST API calls between frontend and backend

## API Endpoints

- `POST /magic-links/email/discovery/send` - Send discovery magic link
- `POST /magic-links/email/discovery/authenticate` - Authenticate magic link
- `GET /discovery/organizations` - List discovered organizations
- `POST /discovery/organizations` - Create new organization
- `POST /session/exchange` - Exchange session for organization
- `GET /session/current` - Get current session
- `POST /session/logout` - Logout user

## Tech Stack

- **Backend**: Go with net/http
- **Authentication**: Stytch B2B Go SDK
- **Session Management**: gorilla/sessions
- **CORS**: Custom middleware
- **Environment**: godotenv for .env support
