import * as stytch from 'stytch';

export type Task = {
  id: string;
  text: string;
  completed: boolean;
};

/**
 * The `TaskListService` class provides methods for managing a task list using Stytch user metadata storage.
 */
export class TaskListService {
  constructor(
    private client: stytch.Client,
    private userID: string,
  ) {}

  get = async (): Promise<Task[]> => {
    const user = await this.client.users.get({ user_id: this.userID });
    return user.untrusted_metadata?.tasks || [];
  };

  set = async (tasks: Task[]): Promise<Task[]> => {
    const sorted = tasks.sort((t1, t2) => {
      if (t1.completed === t2.completed) {
        return t1.id.localeCompare(t2.id);
      }
      return t1.completed ? 1 : -1;
    });

    await this.client.users.update({
      user_id: this.userID,
      untrusted_metadata: { tasks: sorted },
    });
    return sorted;
  };

  add = async (taskText: string): Promise<Task[]> => {
    const tasks = await this.get();
    const newTask: Task = {
      id: Date.now().toString(),
      text: taskText,
      completed: false,
    };
    tasks.push(newTask);
    return this.set(tasks);
  };

  delete = async (taskID: string): Promise<Task[]> => {
    const tasks = await this.get();
    const cleaned = tasks.filter((t) => t.id !== taskID);
    return this.set(cleaned);
  };

  markCompleted = async (taskID: string): Promise<Task[]> => {
    const tasks = await this.get();
    const taskIndex = tasks.findIndex((t) => t.id === taskID);

    if (taskIndex === -1) {
      return tasks;
    }
    const updatedTasks = [
      ...tasks.slice(0, taskIndex),
      { ...tasks[taskIndex], completed: true },
      ...tasks.slice(taskIndex + 1),
    ];
    return this.set(updatedTasks);
  };
}
