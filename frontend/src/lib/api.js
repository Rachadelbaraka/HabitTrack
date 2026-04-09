import axios from 'axios';
import { localDb } from './local-db';

const hasCustomApiUrl = Boolean(import.meta.env.VITE_API_URL);
const isGithubPages = typeof window !== 'undefined' && window.location.hostname.endsWith('github.io');
const preferLocalMode = isGithubPages && !hasCustomApiUrl;

const api = axios.create({
  baseURL: hasCustomApiUrl ? import.meta.env.VITE_API_URL : '/api',
  timeout: 8000
});

const isLocalToken = (token) => String(token || '').startsWith('local-');
const shouldUseLocalDb = (token) => preferLocalMode || isLocalToken(token);

const shouldFallback = (error) => {
  if (preferLocalMode || !error.response) {
    return true;
  }

  return error.response.status >= 500 || error.response.status === 503;
};

const normalizeError = (error) => {
  const message = error?.response?.data?.message || error.message || 'Erreur inattendue lors de la requête.';
  return new Error(message);
};

const authHeader = (token) =>
  token && !isLocalToken(token)
    ? {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    : {};

export const apiClient = {
  async register(payload) {
    if (preferLocalMode) {
      return localDb.register(payload);
    }

    try {
      const { data } = await api.post('/auth/register', payload);
      return { ...data, offlineMode: false };
    } catch (error) {
      if (shouldFallback(error)) {
        return localDb.register(payload);
      }

      throw normalizeError(error);
    }
  },

  async login(payload) {
    if (preferLocalMode) {
      return localDb.login(payload);
    }

    try {
      const { data } = await api.post('/auth/login', payload);
      return { ...data, offlineMode: false };
    } catch (error) {
      if (shouldFallback(error)) {
        return localDb.login(payload);
      }

      throw normalizeError(error);
    }
  },

  async me(token) {
    if (shouldUseLocalDb(token)) {
      return localDb.me(token);
    }

    try {
      const { data } = await api.get('/auth/me', authHeader(token));
      return { ...data, offlineMode: false };
    } catch (error) {
      if (shouldFallback(error)) {
        return localDb.me(token);
      }

      throw normalizeError(error);
    }
  },

  async listHabits(token) {
    if (shouldUseLocalDb(token)) {
      return localDb.listHabits(token);
    }

    try {
      const { data } = await api.get('/habits', authHeader(token));
      return data;
    } catch (error) {
      if (shouldFallback(error)) {
        return localDb.listHabits(token);
      }

      throw normalizeError(error);
    }
  },

  async saveHabit(token, habit) {
    if (shouldUseLocalDb(token)) {
      return localDb.saveHabit(token, habit);
    }

    try {
      const { data } = habit._id
        ? await api.put(`/habits/${habit._id}`, habit, authHeader(token))
        : await api.post('/habits', habit, authHeader(token));

      return data;
    } catch (error) {
      if (shouldFallback(error)) {
        return localDb.saveHabit(token, habit);
      }

      throw normalizeError(error);
    }
  },

  async deleteHabit(token, habitId) {
    if (shouldUseLocalDb(token)) {
      return localDb.deleteHabit(token, habitId);
    }

    try {
      const { data } = await api.delete(`/habits/${habitId}`, authHeader(token));
      return data;
    } catch (error) {
      if (shouldFallback(error)) {
        return localDb.deleteHabit(token, habitId);
      }

      throw normalizeError(error);
    }
  },

  async toggleHabit(token, habitId, date) {
    if (shouldUseLocalDb(token)) {
      return localDb.toggleHabit(token, habitId, date);
    }

    try {
      const { data } = await api.post(`/habits/${habitId}/toggle`, { date }, authHeader(token));
      return data;
    } catch (error) {
      if (shouldFallback(error)) {
        return localDb.toggleHabit(token, habitId, date);
      }

      throw normalizeError(error);
    }
  },

  async reorderHabits(token, orderedIds) {
    if (shouldUseLocalDb(token)) {
      return localDb.reorderHabits(token, orderedIds);
    }

    try {
      const { data } = await api.post('/habits/reorder', { orderedIds }, authHeader(token));
      return data;
    } catch (error) {
      if (shouldFallback(error)) {
        return localDb.reorderHabits(token, orderedIds);
      }

      throw normalizeError(error);
    }
  },

  async getEntry(token, date) {
    if (shouldUseLocalDb(token)) {
      return localDb.getEntry(token, date);
    }

    try {
      const { data } = await api.get(`/entries/${date}`, authHeader(token));
      return data;
    } catch (error) {
      if (shouldFallback(error)) {
        return localDb.getEntry(token, date);
      }

      throw normalizeError(error);
    }
  },

  async listEntries(token, filters = {}) {
    if (shouldUseLocalDb(token)) {
      return localDb.listEntries(token, filters);
    }

    try {
      const { data } = await api.get('/entries', {
        ...authHeader(token),
        params: filters
      });
      return data;
    } catch (error) {
      if (shouldFallback(error)) {
        return localDb.listEntries(token, filters);
      }

      throw normalizeError(error);
    }
  },

  async saveEntry(token, date, payload) {
    if (shouldUseLocalDb(token)) {
      return localDb.saveEntry(token, date, payload);
    }

    try {
      const { data } = await api.put(`/entries/${date}`, payload, authHeader(token));
      return data;
    } catch (error) {
      if (shouldFallback(error)) {
        return localDb.saveEntry(token, date, payload);
      }

      throw normalizeError(error);
    }
  },

  async exportData(token) {
    if (shouldUseLocalDb(token)) {
      return localDb.exportData(token);
    }

    const [habits, entries] = await Promise.all([
      this.listHabits(token),
      this.listEntries(token, {})
    ]);

    return { habits, entries };
  },

  async importData(token, payload) {
    if (shouldUseLocalDb(token)) {
      return localDb.importData(token, payload);
    }

    const existingHabits = await this.listHabits(token);
    await Promise.all(existingHabits.map((habit) => this.deleteHabit(token, habit._id)));

    const importedHabits = Array.isArray(payload.habits) ? payload.habits : [];
    const importedEntries = Array.isArray(payload.entries)
      ? payload.entries
      : Object.values(payload.entries || {});

    await Promise.all(importedHabits.map((habit) => this.saveHabit(token, { ...habit, _id: undefined })));
    await Promise.all(
      importedEntries.map((entry) =>
        this.saveEntry(token, entry.date, { content: entry.content || '', mood: entry.mood || 'reflective' })
      )
    );

    return {
      habits: await this.listHabits(token),
      entries: await this.listEntries(token, {})
    };
  }
};
