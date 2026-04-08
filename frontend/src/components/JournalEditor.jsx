import { useEffect, useState } from 'react';

const moods = ['reflective', 'focused', 'grateful', 'calm', 'energized'];

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
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Daily journal</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Autosaves while you type. Markdown headings and lists work nicely.</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {saving ? 'Saving…' : 'Autosave on'}
        </span>
      </div>

      <label className="mb-3 block text-sm text-slate-600 dark:text-slate-300">
        Mood
        <select
          value={mood}
          onChange={(event) => setMood(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-950"
        >
          {moods.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        rows={12}
        placeholder="Write about what went well, what felt difficult, and the one thing you want to improve tomorrow…"
        className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-950"
      />
    </section>
  );
}
