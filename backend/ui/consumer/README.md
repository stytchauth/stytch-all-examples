# Stytch B2B Shared UI

A React + TypeScript + Vite application that provides a shared UI for backend server examples. This UI demonstrates B2B authentication flows and communicates with backend APIs via HTTP requests.

## What This UI Does

- **Email Magic Link Authentication**: Users log in by clicking a link sent to their email
- **Google OAuth Login**: One-click authentication with Google (opt-in)
- **Organization Discovery**: Users can find and join existing organizations
- **Organization Creation**: Users can create new organizations
- **Session Management**: View session details and switch between organizations
- **Backend Integration**: Communicates with backend APIs via HTTP requests
- **Code Snippets**: Interactive code examples showing API calls

## Quick Start

1. **Install dependencies**:

   ```bash
   yarn install
   ```

2. **Configure your Stytch token**:
   Copy the template file and add your Stytch public token:

   ```bash
   cp .env.template .env
   ```

   **Find your Public Token:** Go to the [Stytch Dashboard](https://stytch.com/dashboard) → Project Overview page → copy your **Public Token** into the `.env` file.

   ```bash
   VITE_STYTCH_PUBLIC_TOKEN=your_stytch_public_token_here
   ```

3. **Start the development server**:

   ```bash
   yarn dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3001](http://localhost:3001)

**Note**: This UI is designed to work with backend servers. See the backend-specific READMEs (e.g., `../golang/README.md`) for instructions on running the complete full-stack application.

## Configuration

### OAuth Configuration

By default, this app only includes email magic link authentication. To enable Google OAuth login:

1. Open `src/config.ts`
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

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Authentication**: Stytch B2B SDK
- **Backend Communication**: HTTP API calls with CORS support
- **Code Highlighting**: Shiki syntax highlighter
