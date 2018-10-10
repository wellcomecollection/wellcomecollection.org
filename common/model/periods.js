// @flow
// We use this in routing, so we use standard JS
export const Periods = {
  Today: 'today',
  ThisWeekend: 'this-weekend',
  CurrentAndComingUp: 'current-and-coming-up',
  Past: 'past',
  ComingUp: 'coming-up',
  ThisWeek: 'this-week'
};

export type Period = $Values<typeof Periods>;
