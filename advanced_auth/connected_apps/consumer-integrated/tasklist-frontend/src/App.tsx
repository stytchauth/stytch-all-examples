import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { StytchUIClient } from '@stytch/vanilla-js';
import { StytchProvider } from '@stytch/react';

import TaskEditor from './Tasks.tsx';
import { Authenticate, Authorize, Login, Logout } from './Auth.tsx';

const stytch = new StytchUIClient(import.meta.env.VITE_STYTCH_PUBLIC_TOKEN ?? '');

function App() {
  return (
    <StytchProvider stytch={stytch}>
      <main>
        <h1>Task App MCP Demo</h1>
        <Router>
          <Routes>
            <Route path="/oauth/authorize" element={<Authorize />} />
            <Route path="/login" element={<Login />} />
            <Route path="/authenticate" element={<Authenticate />} />
            <Route path="/taskapp" element={<TaskEditor />} />
            <Route path="*" element={<Navigate to="/taskapp" />} />
          </Routes>
        </Router>
      </main>
      <footer>
        <Logout />
      </footer>
    </StytchProvider>
  );
}

export default App;
