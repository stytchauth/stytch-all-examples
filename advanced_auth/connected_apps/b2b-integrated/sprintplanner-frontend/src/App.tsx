import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { StytchB2BUIClient } from '@stytch/vanilla-js/b2b';
import { StytchB2BProvider } from '@stytch/react/b2b';

import SprintPlanner from './SprintPlanner';
import { Authorize, Login, Logout } from './Auth';

const stytch = new StytchB2BUIClient(import.meta.env.VITE_STYTCH_PUBLIC_TOKEN ?? '');

function App() {
  return (
    <StytchB2BProvider stytch={stytch}>
      <main>
        <h1>Sprint Planner MCP Demo</h1>
        <Router>
          <Routes>
            <Route path="/oauth/authorize" element={<Authorize />} />
            <Route path="/login" element={<Login />} />
            <Route path="/authenticate" element={<Login />} />
            <Route path="/tickets" element={<SprintPlanner />} />
            <Route path="*" element={<Navigate to="/tickets" />} />
          </Routes>
        </Router>
      </main>
      <footer>
        <Logout />
      </footer>
    </StytchB2BProvider>
  );
}

export default App;
