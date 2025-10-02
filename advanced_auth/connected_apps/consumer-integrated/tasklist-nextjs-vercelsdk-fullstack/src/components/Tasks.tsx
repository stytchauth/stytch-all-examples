'use client';

import { useState, FormEvent, useEffect, useCallback } from 'react';
import { withLoginRequired } from './Auth';
import { useStytchUser } from '@stytch/nextjs';
import { Task } from '@/services/TaskService';
import { TaskClient } from '@/services/TaskClient';

const TaskEditor = withLoginRequired(() => {
  const [newTaskText, setNewTaskText] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useStytchUser();

  // Load tasks from our API
  const loadTasks = useCallback(async () => {
    if (!user) return;

    try {
      const tasks = await TaskClient.getTasks();
      setTasks(tasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  }, [user]);

  useEffect(() => {
    loadTasks();
  }, [user, loadTasks]);

  const onAddTask = async (evt: FormEvent) => {
    evt.preventDefault();
    if (!user || !newTaskText.trim()) return;

    try {
      const tasks = await TaskClient.createTask(newTaskText);
      setTasks(tasks);
      setNewTaskText('');
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const onCompleteTask = async (id: string) => {
    if (!user) return;

    try {
      const tasks = await TaskClient.completeTask(id);
      setTasks(tasks);
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  const onDeleteTask = async (id: string) => {
    if (!user) return;

    try {
      const tasks = await TaskClient.deleteTask(id);
      setTasks(tasks);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  return (
    <div className="taskEditor">
      <p>
        The task items shown below can be edited via the UI + REST API, or via the MCP Server. Connect to the MCP Server
        running at{' '}
        <span>
          <b>
            <code>{window.location.origin}/mcp</code>
          </b>
        </span>{' '}
        with your MCP Client to try it out.
      </p>
      <ul>
        <form onSubmit={onAddTask}>
          <li>
            <input type="text" value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} />
            <button type="submit" className="primary">
              Add Task
            </button>
          </li>
        </form>
        {tasks.map((task) => (
          <li key={task.id}>
            <div>
              {task.completed ? (
                <>
                  ✔️ <s>{task.text}</s>
                </>
              ) : (
                task.text
              )}
            </div>
            <div>
              {!task.completed && <button onClick={() => onCompleteTask(task.id)}>Complete</button>}
              <button onClick={() => onDeleteTask(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default TaskEditor;
