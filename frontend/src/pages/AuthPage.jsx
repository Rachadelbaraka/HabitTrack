import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

export function AuthPage() {
  const navigate = useNavigate();
  const { user, authenticate, busy, error } = useAppStore();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    name: 'Racha',
    email: 'demo@habittrack.app',
    password: 'demo12345'
  });

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [navigate, user]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await authenticate(mode, form);
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 dark:bg-slate-950 md:px-6">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.section initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-2xl shadow-slate-900/20">
          <p className="text-xs uppercase tracking-[0.32em] text-slate-300">HabitTrack</p>
          <h1 className="mt-4 text-4xl font-semibold">Suivi d'habitudes + journal quotidien</h1>
          <p className="mt-4 max-w-md text-slate-300">
            Un espace productif élégant avec habitudes, journal, analyses, mode sombre, fonctionnement hors ligne et export des données.
          </p>

          <div className="mt-8 space-y-3 text-sm text-slate-300">
            <p>✅ Habitudes quotidiennes et hebdomadaires</p>
            <p>📝 Journal avec sauvegarde auto</p>
            <p>📊 Séries et statistiques de progression</p>
            <p>📦 Mode démo hors ligne intégré</p>
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 md:p-8">
          <div className="mb-6 flex rounded-2xl bg-slate-100 p-1 dark:bg-slate-950">
            {['login', 'register'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                className={`flex-1 rounded-2xl px-4 py-2 text-sm font-semibold capitalize transition ${
                  mode === item ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {item === 'login' ? 'Connexion' : 'Inscription'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' ? (
              <label className="block text-sm text-slate-600 dark:text-slate-300">
                Nom complet
                <input
                  required
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-950"
                />
              </label>
            ) : null}

            <label className="block text-sm text-slate-600 dark:text-slate-300">
              Email
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-950"
              />
            </label>

            <label className="block text-sm text-slate-600 dark:text-slate-300">
              Mot de passe
              <input
                required
                type="password"
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-950"
              />
            </label>

            {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:bg-rose-500/10">{error}</p> : null}

            <button type="submit" disabled={busy} className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white dark:bg-violet-500 disabled:opacity-60">
              {busy ? 'Veuillez patienter…' : mode === 'login' ? 'Se connecter' : 'Créer un compte'}
            </button>
          </form>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-300">
            <p className="font-semibold text-slate-900 dark:text-white">Démo rapide</p>
            <p className="mt-1">Utilisez <code>demo@habittrack.app</code> / <code>demo12345</code> pour tester immédiatement le mode hors ligne.</p>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
