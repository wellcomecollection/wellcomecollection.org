import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

type DayJSDate = Parameters<typeof dayjs>[0];

export const humanDate = (date: DayJSDate = 'Invalid Date'): string => {
  const dayJSDate = dayjs(date);

  return dayJSDate.isValid() ? dayJSDate.fromNow() : 'Invalid Date';
};
