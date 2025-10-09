import { Router } from 'express';

const router = Router();

// Healthcheck endpoint
router.get('/healthcheck', (req, res) => {
  const errors: Array<{ variable: string; description: string }> = [];

  if (!process.env.STYTCH_PROJECT_ID) {
    errors.push({
      variable: 'STYTCH_PROJECT_ID',
      description: 'Your Stytch project ID (e.g., project-test-6c20cd16-73d5-44f7-852c-9a7e7b2ccf62)',
    });
  }
  if (!process.env.STYTCH_PROJECT_SECRET) {
    errors.push({
      variable: 'STYTCH_PROJECT_SECRET',
      description: 'Your Stytch secret key from Project Settings',
    });
  }

  if (errors.length > 0) {
    return res.status(500).json({
      status: 'error',
      errors,
      message: 'Backend configuration is incomplete. Add missing variables to .env.local file.',
      configFile: '.env.local',
    });
  }

  return res.json({
    status: 'ok',
    message: 'All environment variables are configured correctly',
  });
});

export default router;
