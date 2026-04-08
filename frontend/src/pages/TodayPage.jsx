import { GripVertical, Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { HabitComposer } from '../components/HabitComposer';
import { JournalEditor } from '../components/JournalEditor';
import { buildDailyProgress, isHabitCompleteForDate } from '../lib/metrics';
import { useAppStore } from '../store/useAppStore';

export function TodayPage() {
  const {
    habits,
    selectedDate,
    setSelectedDate,
    toggleHabit,
    saveHabit,
    deleteHabit,
    reorderHabits,
    entries,
    saveEntry,
    savingEntry
  } = useAppStore();

  const [showComposer, setShowComposer] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [draggedId, setDraggedId] = useState('');

  const entry = entries[selectedDate] || { date: selectedDate, content: '', mood: 'reflective' };
  const progress = useMemo(() => buildDailyProgress(habits, selectedDate), [habits, selectedDate]);

  const handleDrop = async (targetId) => {
    if (!draggedId || draggedId === targetId) {
      return;
    }

    const currentIds = habits.map((habit) => habit._id);
    const draggedIndex = currentIds.indexOf(draggedId);
    const targetIndex = currentIds.indexOf(targetId);

    if (draggedIndex === -1 || targetIndex === -1) {
      return;
    }

    const reordered = [...currentIds];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    await reorderHabits(reordered);
    setDraggedId('');
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Suivi du jour</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{progress.completed}/{progress.total || 0} habitudes terminées • {progress.percent}%</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-950"
              />
              <button
                type="button"
                onClick={() => {
                  setEditingHabit(null);
                  setShowComposer((value) => !value);
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-violet-500"
              >
                <Plus size={16} />
                Nouvelle habitude
              </button>
            </div>
          </div>

          {showComposer ? (
            <div className="mt-5">
              <HabitComposer
                habit={editingHabit}
                onSubmit={saveHabit}
                onClose={() => {
                  setEditingHabit(null);
                  setShowComposer(false);
                }}
              />
            </div>
          ) : null}

          <div className="mt-5 space-y-3">
            {habits.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 px-5 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                Aucune habitude pour l'instant. Ajoutez-en une pour commencer votre série.
              </div>
            ) : (
              habits.map((habit) => {
                const completed = isHabitCompleteForDate(habit, selectedDate);

                return (
                  <motion.div
                    key={habit._id}
                    layout
                    draggable
                    onDragStart={() => setDraggedId(habit._id)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => handleDrop(habit._id)}
                    className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <button type="button" className="cursor-grab text-slate-400" aria-label="Réordonner l'habitude">
                      <GripVertical size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleHabit(habit._id, selectedDate)}
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xl transition ${completed ? 'scale-95 bg-emerald-500 text-white' : ''}`}
                      style={{ backgroundColor: completed ? undefined : `${habit.color}20`, color: completed ? undefined : habit.color }}
                    >
                      {habit.icon}
                    </button>

                    <div className="flex-1">
                      <p className={`font-semibold ${completed ? 'text-emerald-600 line-through dark:text-emerald-300' : 'text-slate-900 dark:text-white'}`}>
                        {habit.name}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{habit.frequency === 'daily' ? 'quotidienne' : 'hebdomadaire'} • rappel {habit.reminderTime || 'désactivé'}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingHabit(habit);
                          setShowComposer(true);
                        }}
                        className="rounded-xl border border-slate-200 p-2 text-slate-600 dark:border-slate-700 dark:text-slate-300"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteHabit(habit._id)}
                        className="rounded-xl border border-rose-200 p-2 text-rose-600 dark:border-rose-500/30"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </section>
      </div>

      <JournalEditor date={selectedDate} entry={entry} onSave={saveEntry} saving={savingEntry} />
    </div>
  );
}
