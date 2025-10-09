import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { TaskListService, Task } from './TaskService';

function formatResponse(description: string, newState: Task[]) {
  return {
    content: [
      {
        type: 'text' as const,
        text: `Success! ${description}\n\nNew state:\n${JSON.stringify(newState, null, 2)}`,
      },
    ],
  };
}

export function createMcpServer(userID: string): McpServer {
  const taskListService = new TaskListService(userID);
  const server = new McpServer({ name: 'TaskList Service', version: '1.0.0' });

  server.resource(
    'Tasks',
    new ResourceTemplate('taskapp://tasks/{id}', {
      list: async () => {
        const tasks = await taskListService.get();
        return {
          resources: tasks.map((task) => ({
            name: task.text,
            uri: `taskapp://tasks/${task.id}`,
          })),
        };
      },
    }),
    async (uri, { id }) => {
      const tasks = await taskListService.get();
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
    const tasks = await taskListService.add(taskText);
    return formatResponse('Task added successfully', tasks);
  });

  server.tool('markTaskComplete', 'Mark a task as complete', { taskID: z.string() }, async ({ taskID }) => {
    const tasks = await taskListService.markCompleted(taskID);
    return formatResponse('Task completed successfully', tasks);
  });

  server.tool('deleteTask', 'Mark a task as deleted', { taskID: z.string() }, async ({ taskID }) => {
    const tasks = await taskListService.delete(taskID);
    return formatResponse('Task deleted successfully', tasks);
  });

  return server;
}
