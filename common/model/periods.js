// @flow
export const Periods = {
  Today: 'today',
  ThisWeekend: 'this-weekend',
  CurrentAndComingUp: 'current-and-coming-up',
  Past: 'past',
  ComingUp: 'coming-up',
  ThisWeek: 'this-week',
  NextSevenDays: 'next-seven-days'
};

export type Period = $Values<typeof Periods>;
