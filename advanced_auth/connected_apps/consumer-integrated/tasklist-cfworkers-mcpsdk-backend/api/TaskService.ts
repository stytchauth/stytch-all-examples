import { Task } from '../types';

/**
 * The `TaskListService` class provides methods for managing a task list backed by Cloudflare KV storage.
 * This includes operations such as retrieving tasks, adding new tasks,
 * deleting existing tasks, and marking tasks as completed.
 */
class TaskListService {
  constructor(
    private env: Env,
    private userID: string,
  ) {}

  get = async (): Promise<Task[]> => {
    const tasks = await this.env.TASKS.get<Task[]>(this.userID, 'json');
    return tasks || [];
  };

  #set = async (tasks: Task[]): Promise<Task[]> => {
    const sorted = tasks.sort((t1, t2) => {
      if (t1.completed === t2.completed) {
        return t1.id.localeCompare(t2.id);
      }
      return t1.completed ? 1 : -1;
    });

    await this.env.TASKS.put(this.userID, JSON.stringify(sorted));
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
    return this.#set(tasks);
  };

  delete = async (taskID: string): Promise<Task[]> => {
    const tasks = await this.get();
    const cleaned = tasks.filter((t) => t.id !== taskID);
    return this.#set(cleaned);
  };

  markCompleted = async (taskID: string): Promise<Task[]> => {
    const tasks = await this.get();
    const completedTask = tasks.find((t) => t.id === taskID);
    if (completedTask) {
      completedTask.completed = true;
      return this.#set(tasks);
    }
    return tasks;
  };
}

export const taskListService = (env: Env, userID: string) => new TaskListService(env, userID);
