# Stytch Consumer Go Backend Example

A Go HTTP server demonstrating Stytch Consumer authentication with a shared React UI. This backend handles authentication flows and session handling while communicating with a frontend UI application.

## What This Backend Does

- **Email Magic Link Authentication**: Handles magic link authentication requests
- **OAuth Authentication**: Handles OAuth authentication flows
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
   cd ../../ui/consumer
   yarn dev
   ```

   The UI will start on [http://localhost:3001](http://localhost:3001)

5. **Open your browser**:
   Navigate to [http://localhost:3001](http://localhost:3001) to use the application

## Configuration

### OAuth Configuration

By default, the UI app only includes email magic link authentication. To enable Google OAuth login:

1. Open `../../ui/consumer/src/config.ts`
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

This setup demonstrates a full-stack Consumer authentication system:

- **Backend**: Go HTTP server (port 3000)
- **Frontend**: React + TypeScript + Vite (port 3001)
- **Authentication**: Stytch Consumer SDK
- **Session Management**: HTTP cookies with CORS support
- **Communication**: REST API calls between frontend and backend

## API Endpoints

- `POST /magic_links/email/send` - Send magic link email
- `POST /magic_links/authenticate` - Authenticate magic link token
- `POST /oauth/authenticate` - Authenticate OAuth token
- `GET /session` - Get current session
- `POST /logout` - Logout user
- `GET /authenticate` - Universal authenticate endpoint

## Tech Stack

- **Backend**: Go with net/http
- **Authentication**: Stytch Consumer Go SDK
- **Session Management**: gorilla/sessions
- **CORS**: Custom middleware
- **Environment**: godotenv for .env support
