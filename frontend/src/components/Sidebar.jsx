import {
  BarChart3,
  CalendarDays,
  CheckCheck,
  LayoutDashboard,
  LogOut,
  MoonStar,
  Settings,
  SunMedium
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

const navigation = [
  { to: '/', label: 'Tableau de bord', icon: LayoutDashboard },
  { to: '/today', label: "Aujourd'hui", icon: CheckCheck },
  { to: '/calendar', label: 'Calendrier', icon: CalendarDays },
  { to: '/statistics', label: 'Statistiques', icon: BarChart3 },
  { to: '/settings', label: 'Paramètres', icon: Settings }
];

export function Sidebar() {
  const { user, theme, setTheme, logout, offlineMode } = useAppStore();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white/80 px-5 py-6 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 md:flex md:flex-col">
      <div className="mb-8 rounded-3xl bg-slate-900 p-4 text-white shadow-xl dark:bg-slate-900">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-300">HabitTrack</p>
        <h1 className="mt-2 text-2xl font-semibold">Journal quotidien & habitudes</h1>
        <p className="mt-2 text-sm text-slate-300">Suivez vos habitudes, écrivez vos réflexions et restez régulier.</p>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-300">
            {offlineMode ? 'Hors ligne' : 'En ligne'}
          </span>
        </div>
      </div>

      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-lg dark:bg-violet-500'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
                }`
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 pt-6">
        <button
          type="button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          <span className="flex items-center gap-3">
            {theme === 'dark' ? <SunMedium size={18} /> : <MoonStar size={18} />}
            {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
          </span>
        </button>

        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
        >
          <LogOut size={18} />
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
