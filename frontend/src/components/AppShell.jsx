import { BarChart3, CalendarDays, CheckCheck, LayoutDashboard, Settings } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAppStore } from '../store/useAppStore';
import { formatLongDate } from '../lib/date';

const mobileNav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/today', label: 'Today', icon: CheckCheck },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/statistics', label: 'Statistics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings }
];

export function AppShell() {
  const { selectedDate, offlineMode } = useAppStore();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <Sidebar />

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-slate-100/80 px-4 py-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 md:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Daily view</p>
                <h2 className="mt-1 text-xl font-semibold">{formatLongDate(selectedDate)}</h2>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                {offlineMode ? 'Offline fallback enabled' : 'API connected'}
              </span>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto md:hidden">
              {mobileNav.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium ${
                        isActive
                          ? 'bg-slate-900 text-white dark:bg-violet-500'
                          : 'bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-300'
                      }`
                    }
                  >
                    <Icon size={16} />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </header>

          <main className="flex-1 px-4 py-4 md:px-8 md:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
