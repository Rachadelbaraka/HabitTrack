import { useEffect, useRef } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { AuthPage } from './pages/AuthPage';
import { CalendarPage } from './pages/CalendarPage';
import { DashboardPage } from './pages/DashboardPage';
import { SettingsPage } from './pages/SettingsPage';
import { StatisticsPage } from './pages/StatisticsPage';
import { TodayPage } from './pages/TodayPage';
import { useAppStore } from './store/useAppStore';

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-950">
      <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5 text-sm font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        Chargement de HabitTrack…
      </div>
    </div>
  );
}

function ProtectedRoute() {
  const { user, loadingApp } = useAppStore();

  if (loadingApp) {
    return <FullScreenLoader />;
  }

  return user ? <Outlet /> : <Navigate to="/auth" replace />;
}

function PublicRoute() {
  const { user, loadingApp } = useAppStore();

  if (loadingApp) {
    return <FullScreenLoader />;
  }

  return user ? <Navigate to="/" replace /> : <AuthPage />;
}

export default function App() {
  const initializeApp = useAppStore((state) => state.initializeApp);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) {
      return;
    }

    hasInitialized.current = true;
    initializeApp();
  }, [initializeApp]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<PublicRoute />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/today" element={<TodayPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
