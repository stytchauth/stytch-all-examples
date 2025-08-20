# Stytch B2B Prebuilt - Vanilla JavaScript

This is a vanilla JavaScript implementation of the Stytch B2B prebuilt authentication flow. It demonstrates how to build a B2B authentication app using raw HTML, CSS, and JavaScript with the Stytch Prebuilt SDK.

## Features

- **Magic Link Authentication**: Users can log in using email magic links
- **Organization Discovery**: Users can discover and join existing organizations
- **Organization Creation**: Users can create new organizations
- **Session Management**: View session information and manage sessions
- **Automatic Redirects**: Smart routing based on authentication state

## Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Configure Stytch**:

   - Open `js/config.js`
   - Replace `'your-project-public-token-here'` with your actual Stytch project public token

3. **Start the development server**:

   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000`

## Project Structure

```
frontend/vanillajs/prebuilt/
├── index.html              # Login page
├── authenticate.html        # Magic link authentication
├── organizations.html       # Organization selection/creation
├── view-session.html        # Session information
├── js/
│   ├── config.js           # Configuration and constants
│   ├── stytch-client.js    # Stytch client initialization
│   ├── login.js            # Login page logic
│   ├── authenticate.js     # Authentication logic
│   ├── organizations.js    # Organizations page logic
│   └── view-session.js     # Session view logic
├── css/
│   └── styles.css          # Custom styles and fonts
├── fonts/                  # Booton font files
└── package.json
```

## How it Works

1. **Login Flow**: Users enter their email and receive a magic link
2. **Authentication**: Clicking the magic link authenticates the user
3. **Organization Selection**: Users can join existing organizations or create new ones
4. **Session Management**: View session details and perform session operations

## Key Differences from React/Next.js Version

- Uses vanilla JavaScript instead of React hooks
- Separate HTML files for each route instead of Next.js routing
- Manual DOM manipulation instead of React state management
- `http-server` instead of Next.js development server
- Direct Stytch Prebuilt SDK usage instead of React-specific hooks

## Stytch Prebuilt SDK Usage

The app uses the Stytch Prebuilt SDK which provides pre-built UI components and handles most of the authentication logic automatically:

- `stytch.mount()` - Mount the prebuilt UI components
- `stytch.member.getSync()` - Get current member information
- `stytch.organization.getSync()` - Get current organization information
- `stytch.session.getTokens()` - Get session tokens
- `stytch.session.revoke()` - Revoke session (logout)

The prebuilt SDK handles:

- Magic link sending and authentication
- Organization discovery and creation
- Session management
- UI state management
- Error handling

## Browser Support

This app uses ES6 modules and modern JavaScript features. It requires a modern browser that supports:

- ES6 modules (`import`/`export`)
- `async`/`await`
- Template literals
- Arrow functions
- `const`/`let`

## Development

- **Development server**: `npm run dev` (with cache disabled)
- **Production server**: `npm start` (with caching enabled)

The app runs on `http://localhost:3000` to match the redirect URLs configured in the Stytch dashboard.
