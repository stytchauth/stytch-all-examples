import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import { Task, TaskListService } from '@/services/TaskService';
import { z } from 'zod';
import { getStytchClient } from '@/lib/stytch';

export const initializeMCPServer = (server: McpServer) => {
  const taskListService = (authInfo: AuthInfo | undefined) => {
    if (!authInfo) throw new Error('No authInfo provided');
    const { subject } = authInfo.extra as { subject: string };

    return new TaskListService(getStytchClient(), subject);
  };

  const formatResponse = (
    description: string,
    newState: Task[],
  ): {
    content: Array<{ type: 'text'; text: string }>;
  } => {
    return {
      content: [
        {
          type: 'text',
          text: `Success! ${description}\n\nNew state:\n${JSON.stringify(newState, null, 2)}}`,
        },
      ],
    };
  };

  server.tool('whoami', 'Who am i anyway', async ({ authInfo }) => ({
    content: [
      {
        type: 'text',
        text: `AuthInfo Contents: ${JSON.stringify(authInfo, null, 2)}`,
      },
    ],
  }));

  server.resource(
    'Tasks',
    new ResourceTemplate('taskapp://tasks/{id}', {
      list: async ({ authInfo }) => {
        const tasks = await taskListService(authInfo).get();

        return {
          resources: tasks.map((task) => ({
            name: task.text,
            uri: `taskapp://tasks/${task.id}`,
          })),
        };
      },
    }),
    async (uri, { id }, { authInfo }) => {
      const tasks = await taskListService(authInfo).get();
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

  server.tool('createTask', 'Add a new task', { taskText: z.string() }, async ({ taskText }, { authInfo }) => {
    const tasks = await taskListService(authInfo).add(taskText);
    return formatResponse('Task added successfully', tasks);
  });

  server.tool(
    'markTaskComplete',
    'Mark a task as complete',
    { taskID: z.string() },
    async ({ taskID }, { authInfo }) => {
      const tasks = await taskListService(authInfo).markCompleted(taskID);
      return formatResponse('Task completed successfully', tasks);
    },
  );

  server.tool('deleteTask', 'Mark a task as deleted', { taskID: z.string() }, async ({ taskID }, { authInfo }) => {
    const tasks = await taskListService(authInfo).delete(taskID);
    return formatResponse('Task deleted successfully', tasks);
  });
};
