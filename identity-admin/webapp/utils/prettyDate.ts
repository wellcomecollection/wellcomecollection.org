import dayjs from 'dayjs';

type DayJSDate = Parameters<typeof dayjs>[0];

export const prettyDate = (date: DayJSDate = 'Invalid Date'): string => {
  return dayjs(date).format('DD/MM/YYYY HH:mm:ss');
};
