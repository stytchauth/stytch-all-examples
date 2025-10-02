# Consumer Integrated: Task List Python (FastAPI/FastMCP) Backend

This is a Python backend for the Task List example.
This backend uses FastAPI for the API and FastMCP for the MCP server.

To access this example via the frontend, use `tasklist-frontend`.

## Setup

1. Create and activate a virtual environment

    ```bash
    # Create virtual environment
    python -m venv env

    # Activate virtual environment
    # On macOS/Linux:
    source env/bin/activate

    # On Windows:
    # env\Scripts\activate
    ```

2. Install dependencies using pip

    ```bash
    pip install -r requirements.txt
    ```

3. Create an environment file

    ```bash
    cp .env.template .env.local
    ```

4. Set environment variables based on your Stytch project (see the [Stytch Dashboard](https://stytch.com/dashboard))

## Running locally

To start the API and MCP server, run the following command. The server will run on localhost:3001.

```bash
uvicorn app.main:app --reload --port ${PORT:-3001}
```

## API Endpoints and MCP Tools

### REST API

- `GET /todos` - Get all tasks for a user
- `POST /todos` - Create a new task
- `POST /todos/{todo_id}/complete` - Mark a todo item as completed
- `DELETE /todos/{todo_id}` - Delete a todo item

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
