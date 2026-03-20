import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import OAuthCallback from './pages/OAuthCallback';
import SpacesPage from './pages/SpacesPage';
import CalendarPage from './pages/CalendarPage';
import ReportsPage from './pages/ReportsPage';
import InboxPage from './pages/InboxPage';
import SettingsPage from './pages/SettingsPage';
import { useEffect, useState } from 'react';
import { isTauriDesktopRuntime } from './utils/wrikeAuth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('wrike_access_token') || import.meta.env.VITE_WRIKE_PERMANENT_TOKEN;
      setIsAuthenticated(!!token && token !== 'undefined');
    };
    let isDisposed = false;
    let unlistenTauriAuth: (() => void) | null = null;

    checkAuth();
    window.addEventListener('storage', checkAuth);

    if (isTauriDesktopRuntime()) {
      void import('@tauri-apps/api/event')
        .then(({ listen }) => listen('wrike-auth-success', checkAuth))
        .then((unlisten) => {
          if (isDisposed) {
            unlisten();
            return;
          }
          unlistenTauriAuth = unlisten;
        })
        .catch(() => {});
    }

    return () => {
      isDisposed = true;
      window.removeEventListener('storage', checkAuth);
      unlistenTauriAuth?.();
    };
  }, []);

  if (isAuthenticated === null) return null;

  return (
    <Routes>
      <Route path="/login"           element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/oauth/callback"  element={<OAuthCallback />} />
      <Route path="/dashboard"       element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/spaces"          element={isAuthenticated ? <SpacesPage /> : <Navigate to="/login" />} />
      <Route path="/calendar"        element={isAuthenticated ? <CalendarPage /> : <Navigate to="/login" />} />
      <Route path="/reports"         element={isAuthenticated ? <ReportsPage /> : <Navigate to="/login" />} />
      <Route path="/inbox"           element={isAuthenticated ? <InboxPage /> : <Navigate to="/login" />} />
      <Route path="/settings"        element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" />} />
      <Route path="*"                element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
    </Routes>
  );
}

export default App;
