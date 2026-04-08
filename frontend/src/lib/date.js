import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek
} from 'date-fns';

const resolveDate = (value = new Date()) => {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'string') {
    return parseISO(value.length > 10 ? value : `${value}T12:00:00`);
  }

  return new Date(value);
};

export const toDayKey = (value = new Date()) => format(resolveDate(value), 'yyyy-MM-dd');
export const toMonthKey = (value = new Date()) => format(resolveDate(value), 'yyyy-MM');

export const getTrackingKey = (value, frequency = 'daily') => {
  const date = resolveDate(value);

  if (frequency === 'weekly') {
    return format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  }

  return toDayKey(date);
};

export const formatLongDate = (value) => format(resolveDate(value), 'EEEE, MMMM d');
export const formatMediumDate = (value) => format(resolveDate(value), 'MMM d, yyyy');
export const formatMonthTitle = (value) => format(resolveDate(value), 'MMMM yyyy');
export const formatWeekday = (value) => format(resolveDate(value), 'EEE');
export const isTodayKey = (value) => isToday(resolveDate(value));
export const isSameMonthValue = (value, reference) => isSameMonth(resolveDate(value), resolveDate(reference));

export const buildMonthGrid = (value) => {
  const date = resolveDate(value);

  return eachDayOfInterval({
    start: startOfWeek(startOfMonth(date), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(date), { weekStartsOn: 1 })
  });
};
