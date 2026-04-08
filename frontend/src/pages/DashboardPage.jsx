import { Flame, NotebookPen, Sparkles, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatCard } from '../components/StatCard';
import { buildDailyProgress, buildStats } from '../lib/metrics';
import { useAppStore } from '../store/useAppStore';

export function DashboardPage() {
  const { habits, entries, selectedDate } = useAppStore();
  const stats = buildStats(habits, entries);
  const todayProgress = buildDailyProgress(habits, selectedDate);
  const todayEntry = entries[selectedDate]?.content || '';

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-4 md:grid-cols-2">
        <StatCard icon={Flame} label="Série actuelle" value={`${stats.streak} jour${stats.streak === 1 ? '' : 's'}`} hint="Jours parfaits consécutifs." accent="from-orange-500 to-rose-500" />
        <StatCard icon={Target} label="Taux mensuel" value={`${stats.completionRate}%`} hint="Moyenne de réussite sur les 30 derniers jours." accent="from-sky-500 to-cyan-500" />
        <StatCard icon={Sparkles} label="Aujourd'hui" value={`${todayProgress.completed}/${todayProgress.total || 0}`} hint="Habitudes validées pour le jour sélectionné." accent="from-violet-500 to-indigo-500" />
        <StatCard icon={NotebookPen} label="Régularité du journal" value={`${stats.journalDays} entrées`} hint="Jours où vous avez écrit une réflexion." accent="from-emerald-500 to-teal-500" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Rythme sur 7 jours</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Un aperçu rapide de votre régularité.</p>
            </div>
            <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-600 dark:bg-violet-500/10 dark:text-violet-200">
              Meilleur : {stats.bestDay.label}
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-7">
            {stats.weeklyTrend.map((day) => (
              <div key={day.date} className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950">
                <p className="text-xs text-slate-500 dark:text-slate-400">{day.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{day.percent}%</p>
                <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className={`h-2 rounded-full ${day.percent >= 100 ? 'bg-emerald-500' : day.percent >= 50 ? 'bg-amber-400' : 'bg-rose-400'}`} style={{ width: `${day.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Aperçu du journal</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {todayEntry.trim()
              ? todayEntry.slice(0, 220)
              : "Aucune entrée pour ce jour. Utilisez l'onglet Aujourd'hui pour écrire."}
          </p>
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-300">
            <p className="font-semibold text-slate-900 dark:text-white">Expérience premium, usage simple</p>
            <p className="mt-2">Utilisez le calendrier pour l'historique, les statistiques pour les tendances et les paramètres pour le thème et l'export.</p>
          </div>
        </motion.div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {habits.slice(0, 3).map((habit) => (
          <motion.div key={habit._id} layout className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-xl" style={{ backgroundColor: `${habit.color}20`, color: habit.color }}>
                {habit.icon}
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{habit.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{habit.frequency === 'daily' ? 'quotidienne' : 'hebdomadaire'} • rappel {habit.reminderTime || 'désactivé'}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
