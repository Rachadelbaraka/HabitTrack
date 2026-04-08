import { motion } from 'framer-motion';

export function StatCard({ icon: Icon, label, value, hint, accent = 'from-violet-500 to-indigo-500' }) {
  return (
    <motion.div
      layout
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-r ${accent} p-3 text-white`}>
        <Icon size={18} />
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <h3 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{value}</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{hint}</p>
    </motion.div>
  );
}
