# Consumer Integrated: Task List Go (MCP + REST) Backend

This is a Go backend for the Task List example.
To access this example via the frontend, use `tasklist-frontend`.

## Setup

1. Install Go 1.22+
2. Create env file

   ```
   cp .env.template .env.local
   ```

3. Fill in the Required variables:

- `STYTCH_PROJECT_ID`
- `STYTCH_PROJECT_SECRET`
- `STYTCH_DOMAIN` (e.g., https://test.stytch.com)

## Run

```
go run ./cmd/server
```

Server runs on `http://localhost:${PORT:-3001}`

## API Endpoints and MCP Tools

### REST API

- `GET /tasks` - Get all tasks for a user
- `POST /tasks` - Create a new task
- `POST /tasks/{task_id}/complete` - Mark a task as completed
- `DELETE /tasks/{task_id}` - Delete a task

### MCP Tools

- `create_task` - Create a task for the currently authorized user
- `mark_task_completed` - Mark a specified task completed
- `delete_task` - Delete a task

## Testing with the MCP Inspector

Test your MCP server using the [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector)

```bash
yarn dlx @modelcontextprotocol/inspector@latest
```

Navigate to the URL where the Inspector is running, and input the following values:

- Transport Type: `Streamable HTTP`
- URL: `http://localhost:3001/mcp`

If you use the Vite frontend, you can also use port 3000 for the MCP server -- Vite will proxy relevant requests appropriately.

## Support and Documentation

- **Stytch Docs**: [https://stytch.com/docs](https://stytch.com/docs)
- **MCP Docs**: [https://modelcontextprotocol.io](https://modelcontextprotocol.io)
- **Community**: [Stytch Slack](https://stytch.com/docs/resources/support/overview)
- **Issues**: [GitHub Issues](https://github.com/stytchauth/mcp-examples/issues)
