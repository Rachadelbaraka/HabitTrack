import { getTrackingKey, toDayKey } from './date';

const STORAGE_KEY = 'habittrack-local-db';

const makeId = (prefix) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

const starterHabits = (userId) => [
  {
    _id: makeId('habit'),
    userId,
    name: 'Boire de l’eau',
    icon: '💧',
    color: '#0ea5e9',
    frequency: 'daily',
    reminderTime: '09:00',
    order: 0,
    completions: [{ date: toDayKey(new Date()) }]
  },
  {
    _id: makeId('habit'),
    userId,
    name: 'Session de travail profond',
    icon: '🎯',
    color: '#8b5cf6',
    frequency: 'daily',
    reminderTime: '10:00',
    order: 1,
    completions: []
  },
  {
    _id: makeId('habit'),
    userId,
    name: 'Bilan hebdomadaire',
    icon: '🗓️',
    color: '#22c55e',
    frequency: 'weekly',
    reminderTime: '18:00',
    order: 2,
    completions: []
  }
];

const starterEntries = (userId) => [
  {
    _id: makeId('entry'),
    userId,
    date: toDayKey(new Date()),
    content: "## Aujourd’hui\nJe veux rester régulier, terminer une tâche importante et écrire une courte réflexion ce soir.",
    mood: 'focused',
    updatedAt: new Date().toISOString()
  }
];

const readDb = () => {
  if (typeof window === 'undefined') {
    return { accounts: [], habits: [], entries: [] };
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return { accounts: [], habits: [], entries: [] };
  }

  try {
    return JSON.parse(raw);
  } catch {
    return { accounts: [], habits: [], entries: [] };
  }
};

const writeDb = (db) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }
};

const ensureDemoAccount = () => {
  const db = readDb();

  if (db.accounts.length > 0) {
    return db;
  }

  const userId = makeId('user');
  const account = {
    id: userId,
    name: 'Utilisateur démo',
    email: 'demo@habittrack.app',
    password: 'demo12345'
  };

  const seeded = {
    accounts: [account],
    habits: starterHabits(userId),
    entries: starterEntries(userId)
  };

  writeDb(seeded);
  return seeded;
};

const getAccountFromToken = (token) => {
  const db = ensureDemoAccount();
  const userId = String(token || '').replace('local-', '');
  const account = db.accounts.find((item) => item.id === userId);

  if (!account) {
    throw new Error('La session locale a expiré. Veuillez vous reconnecter.');
  }

  return { db, account };
};

const sanitizeUser = (account) => ({
  id: account.id,
  name: account.name,
  email: account.email
});

const byUser = (collection, userId) => collection.filter((item) => item.userId === userId);

const toEntryMap = (entries) => Object.fromEntries(entries.map((entry) => [entry.date, entry]));

export const localDb = {
  register(payload) {
    const db = readDb();

    if (db.accounts.some((account) => account.email === payload.email)) {
      throw new Error('Un compte existe déjà avec cette adresse e-mail.');
    }

    const userId = makeId('user');
    const account = {
      id: userId,
      name: payload.name,
      email: payload.email,
      password: payload.password
    };

    const nextDb = {
      accounts: [...db.accounts, account],
      habits: [...db.habits, ...starterHabits(userId)],
      entries: [...db.entries, ...starterEntries(userId)]
    };

    writeDb(nextDb);

    return {
      token: `local-${userId}`,
      user: sanitizeUser(account),
      offlineMode: true
    };
  },

  login(payload) {
    const db = ensureDemoAccount();
    const account = db.accounts.find((item) => item.email === payload.email);

    if (!account || account.password !== payload.password) {
      throw new Error('E-mail ou mot de passe invalide. Essayez demo@habittrack.app / demo12345.');
    }

    return {
      token: `local-${account.id}`,
      user: sanitizeUser(account),
      offlineMode: true
    };
  },

  me(token) {
    const { account } = getAccountFromToken(token);

    return {
      user: sanitizeUser(account),
      offlineMode: true
    };
  },

  listHabits(token) {
    const { db, account } = getAccountFromToken(token);
    return byUser(db.habits, account.id).sort((left, right) => left.order - right.order);
  },

  saveHabit(token, habit) {
    const { db, account } = getAccountFromToken(token);
    const userHabits = byUser(db.habits, account.id).sort((left, right) => left.order - right.order);

    let nextHabits;
    if (habit._id) {
      nextHabits = db.habits.map((item) =>
        item._id === habit._id ? { ...item, ...habit, userId: account.id } : item
      );
    } else {
      nextHabits = [
        ...db.habits,
        {
          _id: makeId('habit'),
          userId: account.id,
          name: habit.name,
          icon: habit.icon || '✨',
          color: habit.color || '#8b5cf6',
          frequency: habit.frequency || 'daily',
          reminderTime: habit.reminderTime || '',
          order: userHabits.length,
          completions: []
        }
      ];
    }

    writeDb({ ...db, habits: nextHabits });
    return nextHabits.find((item) => item._id === (habit._id || nextHabits[nextHabits.length - 1]._id));
  },

  deleteHabit(token, habitId) {
    const { db } = getAccountFromToken(token);
    writeDb({ ...db, habits: db.habits.filter((item) => item._id !== habitId) });
    return { message: 'Habitude supprimée avec succès.' };
  },

  toggleHabit(token, habitId, date) {
    const { db } = getAccountFromToken(token);
    let updatedHabit = null;

    const habits = db.habits.map((habit) => {
      if (habit._id !== habitId) {
        return habit;
      }

      const trackingKey = getTrackingKey(date, habit.frequency);
      const alreadyDone = habit.completions.some((item) => item.date === trackingKey);

      updatedHabit = {
        ...habit,
        completions: alreadyDone
          ? habit.completions.filter((item) => item.date !== trackingKey)
          : [...habit.completions, { date: trackingKey }]
      };

      return updatedHabit;
    });

    writeDb({ ...db, habits });
    return updatedHabit;
  },

  reorderHabits(token, orderedIds) {
    const { db, account } = getAccountFromToken(token);

    const reordered = db.habits.map((habit) => {
      if (habit.userId !== account.id) {
        return habit;
      }

      return {
        ...habit,
        order: orderedIds.indexOf(habit._id)
      };
    });

    writeDb({ ...db, habits: reordered });
    return byUser(reordered, account.id).sort((left, right) => left.order - right.order);
  },

  getEntry(token, date) {
    const { db, account } = getAccountFromToken(token);
    const entry = db.entries.find((item) => item.userId === account.id && item.date === date);

    return (
      entry || {
        _id: makeId('entry'),
        userId: account.id,
        date,
        content: '',
        mood: 'reflective',
        updatedAt: new Date().toISOString()
      }
    );
  },

  listEntries(token, filters = {}) {
    const { db, account } = getAccountFromToken(token);
    const userEntries = byUser(db.entries, account.id).filter((entry) => {
      if (filters.month) {
        return entry.date.startsWith(filters.month);
      }

      if (filters.start && filters.end) {
        return entry.date >= filters.start && entry.date <= filters.end;
      }

      return true;
    });

    return toEntryMap(userEntries);
  },

  saveEntry(token, date, payload) {
    const { db, account } = getAccountFromToken(token);
    const existing = db.entries.find((entry) => entry.userId === account.id && entry.date === date);

    let nextEntries;
    if (existing) {
      nextEntries = db.entries.map((entry) =>
        entry._id === existing._id
          ? {
              ...entry,
              content: payload.content,
              mood: payload.mood || entry.mood,
              updatedAt: new Date().toISOString()
            }
          : entry
      );
    } else {
      nextEntries = [
        ...db.entries,
        {
          _id: makeId('entry'),
          userId: account.id,
          date,
          content: payload.content,
          mood: payload.mood || 'reflective',
          updatedAt: new Date().toISOString()
        }
      ];
    }

    writeDb({ ...db, entries: nextEntries });
    return nextEntries.find((entry) => entry.userId === account.id && entry.date === date);
  },

  exportData(token) {
    const { db, account } = getAccountFromToken(token);

    return {
      habits: byUser(db.habits, account.id),
      entries: toEntryMap(byUser(db.entries, account.id))
    };
  },

  importData(token, payload) {
    const { db, account } = getAccountFromToken(token);
    const importedHabits = Array.isArray(payload.habits) ? payload.habits : [];
    const importedEntries = Array.isArray(payload.entries)
      ? payload.entries
      : Object.values(payload.entries || {});

    const habits = db.habits.filter((item) => item.userId !== account.id).concat(
      importedHabits.map((habit, index) => ({
        ...habit,
        _id: habit._id || makeId('habit'),
        userId: account.id,
        order: index
      }))
    );

    const entries = db.entries.filter((item) => item.userId !== account.id).concat(
      importedEntries.map((entry) => ({
        ...entry,
        _id: entry._id || makeId('entry'),
        userId: account.id
      }))
    );

    writeDb({ ...db, habits, entries });

    return {
      habits: byUser(habits, account.id).sort((left, right) => left.order - right.order),
      entries: toEntryMap(byUser(entries, account.id))
    };
  }
};
