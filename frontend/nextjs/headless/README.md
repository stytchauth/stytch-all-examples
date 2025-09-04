# Stytch B2B Next.js Headless SDK Example

A Next.js application demonstrating Stytch B2B authentication with custom UI components. Users can authenticate via email magic links, discover organizations, and manage sessions.

## Features

- **Email Magic Link Authentication**: Users log in by clicking a link sent to their email
- **Google OAuth Login**: One-click authentication with Google (opt-in)
- **Organization Discovery**: Users can find and join existing organizations
- **Organization Creation**: Users can create new organizations
- **Session Management**: View session details and switch between organizations

## Quick Start

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Configure your Stytch token**:
   Copy the template file and add your Stytch public token:

   ```bash
   cp .env.template .env
   ```

   Then edit `.env` with your actual Stytch public token:

   ```bash
   NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN=your_stytch_public_token_here
   ```

3. **Start the development server**:

   ```bash
   npm run dev
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
- **Authentication**: Stytch B2B Headless SDK
- **Language**: TypeScript
