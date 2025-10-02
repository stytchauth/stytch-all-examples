# Consumer Integrated: Sprint Planner Express.js Backend

This is an Express.js backend for the Sprint Planner example.
This backend uses the official MCP SDK for the MCP server.

To access this example via the frontend, use `sprintplanner-frontend`.

## Setup

1. Install dependencies

   ```bash
   yarn
   ```

2. Create an environment file

   ```bash
   cp .env.template .env.local
   ```

3. Set environment variables based on your Stytch project (see the [Stytch Dashboard](https://stytch.com/dashboard))

## Running locally

To start the API and MCP server, run the following command. The server will run on localhost:3001.

```bash
# if running from this directory
yarn dev
# if running from the `mcp-examples` directory
yarn workspace @mcp-examples/tasklist-express-mcpsdk-backend dev
```

## API Endpoints and MCP Tools

### REST API

- `GET /todos` - Get all tasks for a user
- `POST /todos` - Create a new task
- `POST /todos/{todo_id}/complete` - Mark a todo item as completed
- `DELETE /todos/{todo_id}` - Delete a todo item

### MCP Tools

- `createTask(taskText: string)` - Add a new task
- `markTaskComplete(taskID: string)` - Mark a task as complete
- `deleteTask(taskID: string)` - Delete a task

### MCP Resources

- `taskapp://tasks/{id}` - Individual task resources

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
