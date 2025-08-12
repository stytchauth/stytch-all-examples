# Stytch B2B React Headless SDK Example

This is an example app demonstrating how to use the **Stytch B2B React Headless SDK** with a custom UI. The app showcases B2B authentication flows including magic link login, organization management, and session handling.

## Features

- **Magic Link Authentication**: Email-based login with discovery flow
- **Organization Management**: Create and join organizations
- **Session Management**: View and manage user sessions

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (v18 or higher)
- Yarn

### Installation & Running

1. **Install dependencies** at the top level of the project:

   ```bash
   yarn install
   ```

2. **Start the development server**:

   ```bash
   yarn dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

### Environment Variables

Create a `.env` file in this directory and add your Stytch public token

```bash
VITE_STYTCH_PUBLIC_TOKEN=your_stytch_public_token_here
```
