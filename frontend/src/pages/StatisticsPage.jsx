import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, AreaChart, Area } from 'recharts';
import { Flame, TrendingUp } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { buildStats } from '../lib/metrics';
import { useAppStore } from '../store/useAppStore';

export function StatisticsPage() {
  const { habits, entries } = useAppStore();
  const stats = buildStats(habits, entries);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Flame} label="Streak" value={`${stats.streak} days`} hint="Consecutive perfect days." accent="from-orange-500 to-rose-500" />
        <StatCard icon={TrendingUp} label="Completion rate" value={`${stats.completionRate}%`} hint="Average consistency across 30 days." accent="from-sky-500 to-cyan-500" />
        <StatCard icon={TrendingUp} label="Journal days" value={stats.journalDays} hint="Days with a written reflection." accent="from-emerald-500 to-teal-500" />
        <StatCard icon={TrendingUp} label="Best day" value={stats.bestDay.label} hint={`${stats.bestDay.percent}% completion`} accent="from-violet-500 to-indigo-500" />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">30-day trend</h3>
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Completion percentage over the last month.</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyTrend}>
                <defs>
                  <linearGradient id="habitFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.25} />
                <XAxis dataKey="label" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[0, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="percent" stroke="#8b5cf6" fill="url(#habitFill)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">7-day breakdown</h3>
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Completed habits each day.</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.2} />
                <XAxis dataKey="label" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="completed" fill="#22c55e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
