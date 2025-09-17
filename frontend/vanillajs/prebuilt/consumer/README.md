# Stytch Consumer Vanilla JavaScript Prebuilt SDK Example

A vanilla JavaScript application demonstrating Stytch Consumer authentication with Stytch's hosted UI components. Users can authenticate via email magic links and manage sessions using pre-built UI.

## Features

- **Email Magic Link Authentication**: Users log in by clicking a link sent to their email
- **Google OAuth Login**: One-click authentication with Google (opt-in)
- **Session Management**: View session details and user information
- **Prebuilt UI**: Uses Stytch's hosted authentication components

## Quick Start

1. **Set up environment variables**:

   ```bash
   cp env.template .env
   ```

   **Find your Public Token:** Go to the [Stytch Dashboard](https://stytch.com/dashboard) → Project Overview page → copy your **Public Token** into the `.env` file.

2. **Install dependencies** (if you haven't already, from the root of the monorepo):

   ```bash
   cd ../../..  # Go to the root of the monorepo
   yarn install
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

1. Edit `js/config.js`
2. Set `ENABLE_OAUTH` to `true`:

   ```javascript
   export const ENABLE_OAUTH = true;
   ```

**When `ENABLE_OAUTH = true`:**

- Google OAuth login button will be visible
- OAuth authentication flows will be available

**When `ENABLE_OAUTH = false` (default):**

- Only email magic link authentication is available
- OAuth login button is hidden

## Tech Stack

- **Framework**: Vanilla JavaScript with ES6 modules
- **Styling**: Tailwind CSS
- **Authentication**: Stytch Consumer Prebuilt SDK
- **Server**: http-server
