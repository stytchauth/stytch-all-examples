# Stytch B2B Vanilla JavaScript Headless SDK Example

A vanilla JavaScript application demonstrating Stytch B2B authentication with custom UI components. Users can authenticate via email magic links, discover organizations, and manage sessions using raw HTML, CSS, and JavaScript.

## Features

- **Email Magic Link Authentication**: Users log in by clicking a link sent to their email
- **Google OAuth Login**: One-click authentication with Google (opt-in)
- **Organization Discovery**: Users can find and join existing organizations
- **Organization Creation**: Users can create new organizations
- **Session Management**: View session details and switch between organizations
- **Custom UI**: Built with vanilla HTML, CSS, and JavaScript

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
- **Authentication**: Stytch B2B Headless SDK
- **Server**: http-server
