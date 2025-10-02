import { useState, useEffect, FormEvent } from 'react';
import { withLoginRequired } from './utils/withLoginRequired';
import { Task } from '../types';

const handleTaskResponse = async (res: Response) => {
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status}`);
  }
  const body: { tasks: Task[] } = await res.json();
  return body.tasks;
};

const createTask = (taskText: string) =>
  fetch(`${window.location.origin}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskText }),
  }).then(handleTaskResponse);

const getTasks = () =>
  fetch(`${window.location.origin}/api/tasks`, {
    method: 'GET',
  }).then(handleTaskResponse);

const deleteTask = (id: string) =>
  fetch(`${window.location.origin}/api/tasks/${id}`, {
    method: 'DELETE',
  }).then(handleTaskResponse);

const markComplete = (id: string) =>
  fetch(`${window.location.origin}/api/tasks/${id}/complete`, {
    method: 'POST',
  }).then(handleTaskResponse);

const TaskEditor = withLoginRequired(() => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');

  // Fetch tasks on component mount
  useEffect(() => {
    getTasks().then((tasks) => setTasks(tasks));
  }, []);

  const onAddTask = (evt: FormEvent) => {
    evt.preventDefault();
    createTask(newTaskText).then((tasks) => setTasks(tasks));
    setNewTaskText('');
  };

  const onCompleteTask = (id: string) => {
    markComplete(id).then((tasks) => setTasks(tasks));
  };

  const onDeleteTask = (id: string) => {
    deleteTask(id).then((tasks) => setTasks(tasks));
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
