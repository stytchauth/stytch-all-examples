# Stytch B2B Connected Apps MCP Auth with Firebase Auth in React/ExpressJS

This example app demonstrates how a React/ExpressJS application powered by Firebase auth can expose an MCP server using Stytch Connected Apps.
This demo has:

- User signups using Firebase [Auth](https://firebase.google.com/docs/auth).
- Data storage using Firebase [Firestore](https://firebase.google.com/docs/firestore)
- Frontend using [Vite](<[vite.dev/](https://vite.dev/)>).
- OAuth Identity Provider functionality using Stytch [Connected Apps](https://stytch.com/docs/b2b/guides/connected-apps/overview).
- Lightweight MCP server with the [MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk).

## Technologies used

- Frontend:
  - [Vite](https://github.com/vitejs/vite) - a React framework for production.
  - [Firebase](https://firebase.google.com) for user management and realtime data syncing.
  - Stytch [pre-built Identity Provider OAuth Authorization UI](https://stytch.com/docs/b2b/guides/connected-apps/getting-started).
- Backend:
  - [console.firebase.google.com](https://console.firebase.google.com/): Firestore database for use with Firebase Authentication
  - [stytch.com/dashboard](https://stytch.com/dashboard/): identity provider for MCP auth

## What this app does

This app is a simple access request manager. Users can sign up to join an organization based on their email domain and can make access requests.
Admins (the first person to sign up with a given domain) can approve/deny requests.

## Setup script

This repository includes a setup script that will guide you through the Firebase setup and perform much of the Stytch setup for you. To get started, run:

```
yarn
yarn setup
```

If you already have some parts of the setup flow done, you can choose to run specific setup steps.
You will be prompted to provide relevant parameters from other parts if they are not available:

```
yarn setup:firebase # no dependencies
yarn setup:stytch   # will ask for firebase parameters if not in .env.local
```

## Running Locally

Once you've setup a `.env.local` file, you can run the project locally to test it out. Just note that you will have to change your Authorization URL (Stytch setup step 3) to `http://localhost:3000/oauth/authorize` before you begin.

1. Install dependencies: `yarn`
2. Build the app: `yarn build`
3. Run the app: `yarn start`
4. Navigate to `http://localhost:3000` and sign up/log in

Note that `yarn dev` will work as well, but you won't be able to use the MCP server.

## Connecting to the MCP server

You can connect to your MCP server using a variety of clients. We'll use the MCP Inspector for this example:

1. Start the inspector: `yarn dlx @modelcontextprotocol/inspector@latest`
2. In the window, set your Transport Type to `Streamable HTTP`
3. Set your URL to `http://localhost:3000/mcp`
4. Click `Connect`

You should be prompted to (sign up/log in and) authorize access to your account from your app's authorization screen. Once you click Allow, you should be redirected to the inspector and be able to use various resources and tools.

In Firebase, this should result in your Profile being created (if you just signed up) or updated (if you use the update tool). In Stytch, this should result in a new Connected App being dynamically registered (the first time you connect) and a user being JIT provisioned (when you click Allow).

## More Stytch Examples & Resources

Coming soon!

## Authors

- [Stytch](https://stytch.com)
