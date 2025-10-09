import { Router } from 'express';
import { authorizeSessionMiddleware } from './auth.js';
import { TaskListService } from './TaskService.js';

const router = Router();

// All routes use authorization middleware
router.use(authorizeSessionMiddleware());

// Get all tasks
router.get('/tasks', async (req, res) => {
  try {
    const taskListService = new TaskListService(req.user!.user_id);
    const tasks = await taskListService.get();
    res.json({ tasks });
  } catch (error) {
    console.error('Error getting tasks:', error);
    res.status(500).json({ error: 'Failed to get tasks' });
  }
});

// Create a new task
router.post('/tasks', async (req, res) => {
  try {
    const { taskText } = req.body as { taskText: string };
    const taskListService = new TaskListService(req.user!.user_id);
    const tasks = await taskListService.add(taskText);
    res.json({ tasks });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Failed to add task' });
  }
});

// Mark task as complete
router.post('/tasks/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const taskListService = new TaskListService(req.user!.user_id);
    const tasks = await taskListService.markCompleted(id);
    res.json({ tasks });
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({ error: 'Failed to complete task' });
  }
});

// Delete a task
router.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const taskListService = new TaskListService(req.user!.user_id);
    const tasks = await taskListService.delete(id);
    res.json({ tasks });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
