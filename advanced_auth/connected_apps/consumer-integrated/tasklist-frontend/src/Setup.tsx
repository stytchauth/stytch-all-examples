import { ReactNode, useEffect, useState } from 'react';

type HealthCheckResponse = {
  status: 'ok' | 'error';
  message: string;
  errors?: Array<{ variable: string; description: string }>;
  configFile?: string;
};

export default function Setup({ children }: { children: ReactNode }) {
  const [backendHealth, setBackendHealth] = useState<HealthCheckResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await fetch('/api/healthcheck');
        const data: HealthCheckResponse = await response.json();
        setBackendHealth(data);
      } catch (error: unknown) {
        console.error(error);
        setBackendHealth({
          status: 'error',
          message: 'Failed to connect to backend',
          errors: [{ variable: 'CONNECTION', description: 'Backend is not running or unreachable' }],
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkBackendHealth();
  }, []);

  if (!import.meta.env.VITE_STYTCH_PUBLIC_TOKEN) {
    return (
      <>
        <h1>Error: Frontend Not Configured</h1>
        <p>
          Full setup instructions are available in the{' '}
          <a href="https://github.com/stytchauth/mcp-stytch-consumer-todo-list">README</a>. Make sure you have
          configured the following:
          <ul>
            <li>
              <code>VITE_STYTCH_PUBLIC_TOKEN</code> in your <code>.env.local</code>
            </li>
          </ul>
        </p>
      </>
    );
  }

  if (isLoading) {
    return null;
  }

  if (backendHealth?.status === 'error') {
    return (
      <>
        <h1>Error: Backend Configuration Issues</h1>
        <p>{backendHealth.message}</p>
        {backendHealth.errors && (
          <>
            <h3>Missing Configuration:</h3>
            <ul>
              {backendHealth.errors.map((error, index) => (
                <li key={index}>
                  <strong>
                    <code>{error.variable}</code>
                  </strong>
                  : {error.description}
                </li>
              ))}
            </ul>
          </>
        )}
        <p>
          {backendHealth.configFile && (
            <>
              Add the missing variables to your <code>{backendHealth.configFile}</code> file.{' '}
            </>
          )}
          <br />
          Full setup instructions are available in the{' '}
          <a href="https://github.com/stytchauth/mcp-stytch-consumer-todo-list">README</a>.
          <br />
          You can find these values in your{' '}
          <a href="https://stytch.com/dashboard/project-settings?env=test" target="_blank" rel="noopener noreferrer">
            Stytch Project Settings
          </a>
          .
        </p>
      </>
    );
  }

  return children;
}
