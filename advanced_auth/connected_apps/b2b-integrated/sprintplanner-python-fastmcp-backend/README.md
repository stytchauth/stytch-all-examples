# B2B Integrated: Sprint Planner Python (FastAPI/FastMCP) Backend

This is a Python backend for the Sprint Planner example.
This backend uses FastAPI for the API and FastMCP for the MCP server.

To access this example via the frontend, use `sprintplanner-frontend`.

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

3. Initialize the database

    ```bash
    python init_db.py
    ```

4. Create an environment file

    ```bash
    cp .env.template .env.local
    ```

5. Set environment variables based on your Stytch project (see the [Stytch Dashboard](https://stytch.com/dashboard))

## Running locally

To start the API and MCP server, run the following command. The server will run on localhost:3001.

```bash
python main.py
```

## API Endpoints and MCP Tools

### REST API

- `GET /api/tickets` - Get all tickets for the organization
- `POST /api/tickets` - Create a new ticket
- `POST /api/tickets/{id}/status` - Update ticket status
- `DELETE /api/tickets/{id}` - Delete a ticket

### MCP Tools

- `list_tickets` - List all tickets for an organization
- `get_ticket` - Get a specific ticket by ID
- `create_ticket` - Create a new ticket
- `update_ticket_status` - Update ticket status
- `delete_ticket` - Delete a ticket
- `search_tickets` - Search tickets with filters
- `get_ticket_statistics` - Get ticket statistics and analytics

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
