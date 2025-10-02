import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { taskListService } from './TaskService';
import { Task } from '../types';

function formatResponse(
  description: string,
  newState: Task[],
): {
  content: Array<{ type: 'text'; text: string }>;
} {
  return {
    content: [
      {
        type: 'text',
        text: `Success! ${description}\n\nNew state:\n${JSON.stringify(newState, null, 2)}}`,
      },
    ],
  };
}

// Creates a stateless MCP Server instance to process the request
// The MCP Server will be bound to the provided userID and will only access that user's information
export function createMcpServer(env: Env, userID: string): McpServer {
  const taskListSvc = taskListService(env, userID);

  const server = new McpServer({ name: 'TaskList Service', version: '1.0.0' });

  server.resource(
    'Tasks',
    new ResourceTemplate('taskapp://tasks/{id}', {
      list: async () => {
        const tasks = await taskListSvc.get();

        return {
          resources: tasks.map((task) => ({
            name: task.text,
            uri: `taskapp://tasks/${task.id}`,
          })),
        };
      },
    }),
    async (uri, { id }) => {
      const tasks = await taskListSvc.get();
      const task = tasks.find((task) => task.id === id);
      return {
        contents: [
          {
            uri: uri.href,
            text: task ? `text: ${task.text} completed: ${task.completed}` : 'NOT FOUND',
          },
        ],
      };
    },
  );

  server.tool('createTask', 'Add a new task', { taskText: z.string() }, async ({ taskText }) => {
    const tasks = await taskListSvc.add(taskText);
    return formatResponse('Task added successfully', tasks);
  });

  server.tool('markTaskComplete', 'Mark a task as complete', { taskID: z.string() }, async ({ taskID }) => {
    const tasks = await taskListSvc.markCompleted(taskID);
    return formatResponse('Task completed successfully', tasks);
  });

  server.tool('deleteTask', 'Mark a task as deleted', { taskID: z.string() }, async ({ taskID }) => {
    const tasks = await taskListSvc.delete(taskID);
    return formatResponse('Task deleted successfully', tasks);
  });

  return server;
}
