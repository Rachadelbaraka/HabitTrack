import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { addMonths, subMonths } from 'date-fns';
import { CalendarGrid } from '../components/CalendarGrid';
import { buildMonthGrid, formatLongDate, formatMonthTitle, toMonthKey } from '../lib/date';
import { buildDailyProgress, isHabitCompleteForDate } from '../lib/metrics';
import { useAppStore } from '../store/useAppStore';

export function CalendarPage() {
  const { habits, entries, selectedDate, setSelectedDate, fetchMonthEntries } = useAppStore();
  const [monthAnchor, setMonthAnchor] = useState(new Date(selectedDate));

  useEffect(() => {
    fetchMonthEntries(toMonthKey(monthAnchor));
  }, [fetchMonthEntries, monthAnchor]);

  const days = useMemo(() => buildMonthGrid(monthAnchor), [monthAnchor]);
  const selectedProgress = buildDailyProgress(habits, selectedDate);
  const selectedEntry = entries[selectedDate]?.content || '';
  const habitBreakdown = habits.map((habit) => ({
    ...habit,
    completed: isHabitCompleteForDate(habit, selectedDate)
  }));

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-4">
        <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <button type="button" onClick={() => setMonthAnchor((current) => subMonths(current, 1))} className="rounded-2xl border border-slate-200 p-2 dark:border-slate-700">
            <ChevronLeft size={18} />
          </button>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{formatMonthTitle(monthAnchor)}</h3>
          <button type="button" onClick={() => setMonthAnchor((current) => addMonths(current, 1))} className="rounded-2xl border border-slate-200 p-2 dark:border-slate-700">
            <ChevronRight size={18} />
          </button>
        </div>

        <CalendarGrid
          days={days}
          referenceMonth={monthAnchor}
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
          habits={habits}
          entries={entries}
        />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-400">Jour sélectionné</p>
        <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{formatLongDate(selectedDate)}</h3>

        <div className="mt-4 rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
          <p className="text-sm text-slate-500 dark:text-slate-400">Aperçu de progression</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{selectedProgress.percent}%</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{selectedProgress.completed}/{selectedProgress.total || 0} habitudes terminées</p>
        </div>

        <div className="mt-5 rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Habitudes du jour</p>
          <div className="mt-3 space-y-2">
            {habitBreakdown.map((habit) => (
              <div key={habit._id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-sm dark:bg-slate-950">
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <span>{habit.icon}</span>
                  {habit.name}
                </span>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${habit.completed ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' : 'bg-rose-500/10 text-rose-600 dark:text-rose-300'}`}>
                  {habit.completed ? 'Faite' : 'Manquée'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Entrée du journal</p>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {selectedEntry.trim() || "Aucune entrée enregistrée pour ce jour."}
          </p>
        </div>
      </section>
    </div>
  );
}
