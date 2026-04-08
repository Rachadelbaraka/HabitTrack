import { motion } from 'framer-motion';
import { buildDailyProgress } from '../lib/metrics';
import { formatWeekday, isSameMonthValue, isTodayKey, toDayKey } from '../lib/date';

export function CalendarGrid({ days, referenceMonth, selectedDate, onSelect, habits, entries }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 grid grid-cols-7 gap-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <p key={day} className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {day}
          </p>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dateKey = toDayKey(day);
          const progress = buildDailyProgress(habits, day);
          const hasJournal = Boolean(entries[dateKey]?.content?.trim());
          const selected = selectedDate === dateKey;

          return (
            <motion.button
              key={dateKey}
              whileHover={{ y: -2 }}
              type="button"
              onClick={() => onSelect(dateKey)}
              className={`min-h-24 rounded-2xl border p-2 text-left transition ${
                selected
                  ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10'
                  : 'border-slate-200 bg-slate-50 hover:border-violet-300 dark:border-slate-800 dark:bg-slate-950'
              } ${isSameMonthValue(day, referenceMonth) ? '' : 'opacity-40'}`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span
                  className={`text-sm font-semibold ${
                    isTodayKey(day)
                      ? 'rounded-full bg-slate-900 px-2 py-1 text-white dark:bg-violet-500'
                      : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {day.getDate()}
                </span>
                {hasJournal ? <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> : null}
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">{formatWeekday(day)}</p>
              <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className={`h-2 rounded-full ${progress.percent >= 100 ? 'bg-emerald-500' : progress.percent >= 50 ? 'bg-amber-400' : 'bg-rose-400'}`}
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                {progress.completed}/{progress.total || 0} habits
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
