import { create } from 'zustand';
import { apiClient } from '../lib/api';
import { toDayKey, toMonthKey } from '../lib/date';

const TOKEN_KEY = 'habittrack-token';
const THEME_KEY = 'habittrack-theme';

const getStoredValue = (key, fallback = '') => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  return window.localStorage.getItem(key) || fallback;
};

const applyTheme = (theme) => {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.classList.toggle('dark', theme === 'dark');
};

const initialTheme = getStoredValue(THEME_KEY, 'dark');
applyTheme(initialTheme);

// Central Zustand store: authentication, habits, entries, theme, and offline-friendly actions.
export const useAppStore = create((set, get) => ({
  theme: initialTheme,
  token: getStoredValue(TOKEN_KEY, ''),
  user: null,
  habits: [],
  entries: {},
  selectedDate: toDayKey(new Date()),
  loadingApp: true,
  busy: false,
  savingEntry: false,
  offlineMode: false,
  error: '',

  async initializeApp() {
    applyTheme(get().theme);

    const token = getStoredValue(TOKEN_KEY, '');
    if (!token) {
      set({ loadingApp: false });
      return;
    }

    try {
      const response = await apiClient.me(token);
      set({ token, user: response.user, offlineMode: Boolean(response.offlineMode) });
      await get().refreshData(get().selectedDate);
    } catch (error) {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(TOKEN_KEY);
      }
      set({ token: '', user: null, loadingApp: false, error: error.message });
      return;
    }

    set({ loadingApp: false });
  },

  async authenticate(mode, payload) {
    set({ busy: true, error: '' });

    try {
      const response = mode === 'register' ? await apiClient.register(payload) : await apiClient.login(payload);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(TOKEN_KEY, response.token);
      }

      set({
        token: response.token,
        user: response.user,
        offlineMode: Boolean(response.offlineMode)
      });

      await get().refreshData(get().selectedDate);
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ busy: false, loadingApp: false });
    }
  },

  async refreshData(date = get().selectedDate) {
    const { token } = get();
    if (!token) {
      return;
    }

    set({ busy: true, selectedDate: date });

    try {
      const month = toMonthKey(date);
      const [habits, entry, entries] = await Promise.all([
        apiClient.listHabits(token),
        apiClient.getEntry(token, date),
        apiClient.listEntries(token, { month })
      ]);

      set((state) => ({
        habits,
        entries: {
          ...state.entries,
          ...entries,
          [date]: entry
        },
        error: ''
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ busy: false });
    }
  },

  async fetchMonthEntries(month) {
    const { token } = get();
    if (!token) {
      return;
    }

    try {
      const entries = await apiClient.listEntries(token, { month });
      set((state) => ({ entries: { ...state.entries, ...entries } }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  async setSelectedDate(date) {
    set({ selectedDate: date });
    await get().refreshData(date);
  },

  async saveHabit(values) {
    const { token } = get();
    const savedHabit = await apiClient.saveHabit(token, values);

    set((state) => {
      const exists = state.habits.some((habit) => habit._id === savedHabit._id);
      const habits = exists
        ? state.habits.map((habit) => (habit._id === savedHabit._id ? savedHabit : habit))
        : [...state.habits, savedHabit];

      return {
        habits: habits.sort((left, right) => left.order - right.order)
      };
    });
  },

  async deleteHabit(habitId) {
    const { token } = get();
    await apiClient.deleteHabit(token, habitId);
    set((state) => ({ habits: state.habits.filter((habit) => habit._id !== habitId) }));
  },

  async toggleHabit(habitId, date) {
    const { token } = get();
    const updatedHabit = await apiClient.toggleHabit(token, habitId, date);

    set((state) => ({
      habits: state.habits.map((habit) => (habit._id === updatedHabit._id ? updatedHabit : habit))
    }));
  },

  async reorderHabits(orderedIds) {
    const { token } = get();
    const habits = await apiClient.reorderHabits(token, orderedIds);
    set({ habits });
  },

  async saveEntry(date, content, mood = 'reflective') {
    const { token } = get();
    set({ savingEntry: true });

    try {
      const entry = await apiClient.saveEntry(token, date, { content, mood });
      set((state) => ({ entries: { ...state.entries, [date]: entry } }));
    } finally {
      set({ savingEntry: false });
    }
  },

  setTheme(theme) {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_KEY, theme);
    }

    applyTheme(theme);
    set({ theme });
  },

  async exportData() {
    const { token } = get();
    return apiClient.exportData(token);
  },

  async importData(payload) {
    const { token } = get();
    set({ busy: true });

    try {
      const imported = await apiClient.importData(token, payload);
      set((state) => ({
        habits: imported.habits,
        entries: { ...state.entries, ...imported.entries }
      }));
    } finally {
      set({ busy: false });
    }
  },

  logout() {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(TOKEN_KEY);
    }

    set({
      token: '',
      user: null,
      habits: [],
      entries: {},
      error: '',
      offlineMode: false
    });
  }
}));
