# Consumer Integrated: Task List Frontend

This is a Vite React frontend for the Task List backends:

- `tasklist-cfworkers-mcpsdk-backend`
- `tasklist-express-mcpsdk-backend`
- `tasklist-golang-backend`
- `tasklist-python-backend`

## Setup

Follow the steps below to get this application fully functional and running using your own Stytch credentials.

### Install dependencies

This is a Yarn workspace, part of the top-level `mcp-examples` project. Install dependencies by running:

```bash
yarn
```

### Pick a backend

Navigate to one of the backend folders and follow the instructions to configure it with your Stytch credentials.
Follow the directions in its README to set up and run it.

### Configure Stytch (in the Dashboard)

Make sure that you're using a Consumer project.
Learn about the difference between Consumer and B2B auth [here](https://stytch.com/docs/getting-started/b2b-vs-consumer-auth).

1. Navigate to [Frontend SDKs](https://stytch.com/dashboard/sdk-configuration?env=test) to enable the Frontend SDK in Test
   - Make sure that `http://localhost:3000` is added as an allowed host (this should be done by default)
2. Navigate to [Project Settings](https://stytch.com/dashboard/project-settings?env=test) to view your Project ID and API keys. You will need these values later.

### Configure Stytch (in the app environment)

1. Create an `.env.local` file that mirrors `.env.template`.

   ```bash
   cp .env.template .env.local
   ```

2. In `.env.local`, set `VITE_STYTCH_PUBLIC_TOKEN` to a Public Token found on [Project Settings](https://stytch.com/dashboard/project-settings?env=test).

   ```
   VITE_STYTCH_PUBLIC_TOKEN=public-token-test-...
   ```

## Running locally

To start the frontend, run:

```bash
yarn dev
```

The frontend will be available at [`http://localhost:3000/`](http://localhost:3000/).
Regardless of which backend you choose to use, the Vite frontend will proxy requests made to MCP- and API-related endpoints to it.
Specifically, this includes requests made to `/api`, `/.well-known`, `/mcp`, and `/sse`.

Test your MCP server using the [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector)

```bash
yarn dlx @modelcontextprotocol/inspector@latest
```

Navigate to the URL where the Inspector is running, and input the following values:

- Transport Type: `Streamable HTTP`
- URL: `http://localhost:3000/mcp` (the server is running on port 3001, but we set up Vite proxy rules to pass requests made on 3000 for convenience)

## Support and Documentation

- **Stytch Docs**: [https://stytch.com/docs](https://stytch.com/docs)
- **MCP Docs**: [https://modelcontextprotocol.io](https://modelcontextprotocol.io)
- **Community**: [Stytch Slack](https://stytch.com/docs/resources/support/overview)
- **Issues**: [GitHub Issues](https://github.com/stytchauth/mcp-examples/issues)
