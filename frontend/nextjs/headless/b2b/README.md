# Stytch B2B Next.js Headless SDK Example

A Next.js application demonstrating Stytch B2B authentication with custom UI components. Users can authenticate via email magic links, discover organizations, and manage sessions.

## Features

- **Email Magic Link Authentication**: Users log in by clicking a link sent to their email
- **Google OAuth Login**: One-click authentication with Google (opt-in)
- **Organization Discovery**: Users can find and join existing organizations
- **Organization Creation**: Users can create new organizations
- **Session Management**: View session details and switch between organizations

## Quick Start

1. **Install dependencies** (from the root of the monorepo):

   ```bash
   cd ../../..  # Go to the root of the monorepo
   yarn install
   ```

2. **Configure your Stytch tokens**:
   Copy the template file and add your Stytch tokens:

   ```bash
   cp .env.template .env
   ```

   **Find your tokens:** Go to the [Stytch Dashboard](https://stytch.com/dashboard) → Project Overview page → copy your tokens into the `.env` file.

   ```bash
   NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN=your_stytch_public_token_here
   PROJECT_ID=your_stytch_project_id_here
   PROJECT_SECRET=your_stytch_secret_here
   ```

3. **Start the development server**:

   ```bash
   yarn dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

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

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Authentication**: Stytch B2B Headless SDK (client-side) + Stytch Node.js SDK (server-side)
- **Language**: TypeScript
