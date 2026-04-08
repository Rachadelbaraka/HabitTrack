import { eachDayOfInterval, format, subDays } from 'date-fns';
import { getTrackingKey, toDayKey } from './date';

export const isHabitCompleteForDate = (habit, date) => {
  const trackingKey = getTrackingKey(date, habit.frequency);
  return habit?.completions?.some((item) => item.date === trackingKey);
};

export const buildDailyProgress = (habits = [], date = new Date()) => {
  const total = habits.length;
  const completed = habits.filter((habit) => isHabitCompleteForDate(habit, date)).length;

  return {
    total,
    completed,
    percent: total ? Math.round((completed / total) * 100) : 0
  };
};

export const buildTrendData = (habits = [], days = 7, endDate = new Date()) => {
  const startDate = subDays(endDate, days - 1);

  return eachDayOfInterval({ start: startDate, end: endDate }).map((date) => {
    const progress = buildDailyProgress(habits, date);

    return {
      label: format(date, 'MMM d'),
      date: toDayKey(date),
      ...progress
    };
  });
};

export const buildStats = (habits = [], entries = {}) => {
  const monthlyTrend = buildTrendData(habits, 30);
  const weeklyTrend = buildTrendData(habits, 7);

  const completionRate = monthlyTrend.length
    ? Math.round(monthlyTrend.reduce((sum, item) => sum + item.percent, 0) / monthlyTrend.length)
    : 0;

  let streak = 0;
  for (let index = monthlyTrend.length - 1; index >= 0; index -= 1) {
    const day = monthlyTrend[index];
    if (day.percent === 100 && day.total > 0) {
      streak += 1;
    } else {
      break;
    }
  }

  const journalDays = Object.values(entries).filter((entry) => entry?.content?.trim()).length;
  const bestDay = monthlyTrend.reduce(
    (best, current) => (current.percent >= best.percent ? current : best),
    monthlyTrend[0] || { label: '—', percent: 0 }
  );

  return {
    streak,
    completionRate,
    journalDays,
    bestDay,
    weeklyTrend,
    monthlyTrend
  };
};
