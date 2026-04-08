import { BellRing, Download, MoonStar, SunMedium, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { useAppStore } from '../store/useAppStore';

export function SettingsPage() {
  const fileInputRef = useRef(null);
  const [notice, setNotice] = useState('');
  const { theme, setTheme, exportData, importData, offlineMode } = useAppStore();

  const handleExport = async () => {
    const payload = await exportData();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'habittrack-export.json';
    link.click();
    URL.revokeObjectURL(url);
    setNotice('Données exportées avec succès.');
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const text = await file.text();
    await importData(JSON.parse(text));
    setNotice('Données importées avec succès.');
  };

  const handleNotifications = async () => {
    if (!('Notification' in window)) {
      setNotice('Ce navigateur ne prend pas en charge les notifications.');
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      new Notification('Les rappels HabitTrack sont activés', {
        body: 'Vous pourrez désormais recevoir des rappels pendant que l’application est ouverte.'
      });
      setNotice('Notifications activées.');
      return;
    }

    setNotice('L’autorisation pour les notifications a été refusée.');
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Apparence</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Basculez instantanément entre mode clair et sombre.</p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold ${theme === 'light' ? 'bg-slate-900 text-white' : 'border border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200'}`}
            >
              <SunMedium size={16} /> Clair
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold ${theme === 'dark' ? 'bg-violet-500 text-white' : 'border border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200'}`}
            >
              <MoonStar size={16} /> Sombre
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Rappels et données</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Activez les rappels ou transférez vos données entre appareils.</p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={handleNotifications} className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white dark:bg-violet-500">
              <BellRing size={16} /> Activer les notifications
            </button>
            <button type="button" onClick={handleExport} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
              <Download size={16} /> Exporter JSON
            </button>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
              <Upload size={16} /> Importer JSON
            </button>
            <input ref={fileInputRef} type="file" accept="application/json" onChange={handleImport} className="hidden" />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Environnement</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
            <p className="text-sm text-slate-500 dark:text-slate-400">Mode API</p>
            <p className="mt-1 font-semibold text-slate-900 dark:text-white">{offlineMode ? 'Mode hors ligne' : 'MongoDB + API'}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
            <p className="text-sm text-slate-500 dark:text-slate-400">Support PWA</p>
            <p className="mt-1 font-semibold text-slate-900 dark:text-white">Activé via service worker</p>
          </div>
        </div>

        {notice ? <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">{notice}</p> : null}
      </section>
    </div>
  );
}
