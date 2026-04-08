import { useEffect, useState } from 'react';

const defaultValues = {
  name: '',
  icon: '✨',
  color: '#8b5cf6',
  frequency: 'daily',
  reminderTime: ''
};

export function HabitComposer({ habit, onSubmit, onClose }) {
  const [form, setForm] = useState(defaultValues);

  useEffect(() => {
    setForm(habit ? { ...defaultValues, ...habit } : defaultValues);
  }, [habit]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {habit ? 'Edit habit' : 'Add a new habit'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Create a habit with icon, color, frequency and reminders.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <span>Name</span>
          <input
            required
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-950"
            placeholder="Walk 30 minutes"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <span>Icon</span>
          <input
            value={form.icon}
            onChange={(event) => updateField('icon', event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-950"
            placeholder="💪"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <span>Color</span>
          <input
            type="color"
            value={form.color}
            onChange={(event) => updateField('color', event.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-2 dark:border-slate-700 dark:bg-slate-950"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <span>Frequency</span>
          <select
            value={form.frequency}
            onChange={(event) => updateField('frequency', event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </label>

        <label className="space-y-2 text-sm text-slate-600 dark:text-slate-300 md:col-span-2">
          <span>Reminder time</span>
          <input
            type="time"
            value={form.reminderTime || ''}
            onChange={(event) => updateField('reminderTime', event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="submit" className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white dark:bg-violet-500">
          {habit ? 'Save changes' : 'Create habit'}
        </button>
        <button type="button" onClick={onClose} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
          Cancel
        </button>
      </div>
    </form>
  );
}
