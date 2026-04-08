import { useEffect, useState } from 'react';

const moods = [
  { value: 'reflective', label: 'Réflexif' },
  { value: 'focused', label: 'Concentré' },
  { value: 'grateful', label: 'Reconnaissant' },
  { value: 'calm', label: 'Calme' },
  { value: 'energized', label: 'Énergisé' }
];

export function JournalEditor({ date, entry, onSave, saving }) {
  const [content, setContent] = useState(entry?.content || '');
  const [mood, setMood] = useState(entry?.mood || 'reflective');

  useEffect(() => {
    setContent(entry?.content || '');
    setMood(entry?.mood || 'reflective');
  }, [entry?.content, entry?.mood, date]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (content !== (entry?.content || '') || mood !== (entry?.mood || 'reflective')) {
        onSave(date, content, mood);
      }
    }, 800);

    return () => window.clearTimeout(timeoutId);
  }, [content, date, entry?.content, entry?.mood, mood, onSave]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Journal du jour</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Sauvegarde automatique pendant la frappe. Les titres et listes Markdown sont bien pris en charge.</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {saving ? 'Enregistrement…' : 'Sauvegarde auto active'}
        </span>
      </div>

      <label className="mb-3 block text-sm text-slate-600 dark:text-slate-300">
        Humeur
        <select
          value={mood}
          onChange={(event) => setMood(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-950"
        >
          {moods.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        rows={12}
        placeholder="Écrivez ce qui s’est bien passé, ce qui a été difficile et la chose à améliorer demain…"
        className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-950"
      />
    </section>
  );
}
