import { Task } from './TaskService';

export class TaskClient {
  private static createHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
    };
  }

  static async getTasks(): Promise<Task[]> {
    const response = await fetch('/api/tasks');

    if (!response.ok) {
      throw new Error('Failed to load tasks');
    }

    const data = await response.json();
    return data.tasks;
  }

  static async createTask(text: string): Promise<Task[]> {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: this.createHeaders(),
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Failed to add task');
    }

    const data = await response.json();
    return data.tasks;
  }

  static async completeTask(id: string): Promise<Task[]> {
    const response = await fetch(`/api/tasks/${id}/complete`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to complete task');
    }

    const data = await response.json();
    return data.tasks;
  }

  static async deleteTask(id: string): Promise<Task[]> {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete task');
    }

    const data = await response.json();
    return data.tasks;
  }
}
