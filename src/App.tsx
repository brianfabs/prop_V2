import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateAccount from './pages/CreateAccount';
import ProposalView from './pages/ProposalView';
import CreateProposal from './pages/CreateProposal';
import EditProposal from './pages/EditProposal';
import AdminDashboard from './pages/AdminDashboard';
import { auth } from './firebase/firebase-config';
import { signOut } from 'firebase/auth';

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const [debugError, setDebugError] = React.useState<string | null>(null);
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const resetTimer = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(async () => {
        try {
          if (auth.currentUser) {
            await signOut(auth);
            window.location.href = '/login';
          }
        } catch (err: any) {
          setDebugError(err.message || 'Unknown error in inactivity timeout');
        }
      }, 10 * 60 * 1000); // 10 minutes
    };
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();
    return () => {
      if (timeout) clearTimeout(timeout);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/proposal/:id" element={<ProposalView />} />
      <Route path="/create-proposal" element={<CreateProposal />} />
      <Route path="/edit-proposal/:id" element={<EditProposal />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
