package mcpserver

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/modelcontextprotocol/go-sdk/mcp"

	"github.com/stytchauth/mcp-examples/consumer-integrated/tasklist-golang-backend/internal/auth"
	"github.com/stytchauth/mcp-examples/consumer-integrated/tasklist-golang-backend/internal/config"
	"github.com/stytchauth/mcp-examples/consumer-integrated/tasklist-golang-backend/internal/storage"
)

// HTTPHandler returns an MCP Streamable HTTP handler mounted under /.
func HTTPHandler(cfg *config.Config) http.Handler {
	// Build per-request server with tools/resources
	h := mcp.NewStreamableHTTPHandler(func(r *http.Request) *mcp.Server {
		userID, ok := auth.UserIDFrom(r.Context())
		if !ok || userID == "" {
			// Authentication failed - this should not happen since auth middleware should catch this
			panic("MCP server requires authentication - no user ID found in context")
		}
		srv := mcp.NewServer(&mcp.Implementation{Name: "TaskList Service", Version: "1.0.0"}, nil)

		// createTask tool
		type CreateTaskArgs struct {
			TaskText string `json:"taskText" jsonschema:"the text of the task to create"`
		}
		mcp.AddTool(srv, &mcp.Tool{Name: "createTask", Description: "Create a task for the currently authorized user"}, func(ctx context.Context, req *mcp.CallToolRequest, args CreateTaskArgs) (*mcp.CallToolResult, any, error) {
			tasks, err := storage.Get().Add(userID, args.TaskText)
			if err != nil {
				return &mcp.CallToolResult{
					Content: []mcp.Content{&mcp.TextContent{Text: "Error: " + err.Error()}},
					IsError: true,
				}, nil, nil
			}
			return &mcp.CallToolResult{
				Content: []mcp.Content{&mcp.TextContent{Text: "Task created successfully. Current tasks:\n" + toJSON(tasks)}},
			}, nil, nil
		})

		// markTaskComplete tool
		type MarkTaskCompleteArgs struct {
			TaskID string `json:"taskID" jsonschema:"the ID of the task to mark as complete"`
		}
		mcp.AddTool(srv, &mcp.Tool{Name: "markTaskComplete", Description: "Mark a specified task completed"}, func(ctx context.Context, req *mcp.CallToolRequest, args MarkTaskCompleteArgs) (*mcp.CallToolResult, any, error) {
			tasks, err := storage.Get().MarkCompleted(userID, args.TaskID)
			if err != nil {
				return &mcp.CallToolResult{
					Content: []mcp.Content{&mcp.TextContent{Text: "Error: " + err.Error()}},
					IsError: true,
				}, nil, nil
			}
			return &mcp.CallToolResult{
				Content: []mcp.Content{&mcp.TextContent{Text: "Task marked complete. Current tasks:\n" + toJSON(tasks)}},
			}, nil, nil
		})

		// deleteTask tool
		type DeleteTaskArgs struct {
			TaskID string `json:"taskID" jsonschema:"the ID of the task to delete"`
		}
		mcp.AddTool(srv, &mcp.Tool{Name: "deleteTask", Description: "Delete a task"}, func(ctx context.Context, req *mcp.CallToolRequest, args DeleteTaskArgs) (*mcp.CallToolResult, any, error) {
			tasks, err := storage.Get().Delete(userID, args.TaskID)
			if err != nil {
				return &mcp.CallToolResult{
					Content: []mcp.Content{&mcp.TextContent{Text: "Error: " + err.Error()}},
					IsError: true,
				}, nil, nil
			}
			return &mcp.CallToolResult{
				Content: []mcp.Content{&mcp.TextContent{Text: "Task deleted. Current tasks:\n" + toJSON(tasks)}},
			}, nil, nil
		})

		// Resources
		srv.AddResource(&mcp.Resource{Name: "Tasks", URI: "resource://tasks"}, func(ctx context.Context, req *mcp.ReadResourceRequest) (*mcp.ReadResourceResult, error) {
			tasks, err := storage.Get().List(userID)
			if err != nil {
				return nil, err
			}
			return &mcp.ReadResourceResult{
				Contents: []*mcp.ResourceContents{{
					URI:      "resource://tasks",
					MIMEType: "application/json",
					Text:     toJSON(tasks),
				}},
			}, nil
		})

		return srv
	}, &mcp.StreamableHTTPOptions{})

	return h
}

func toJSON(v any) string {
	b, _ := json.MarshalIndent(v, "", "  ")
	return string(b)
}
