const Periods = [
  'today',
  'this-weekend',
  'current-and-coming-up',
  'past',
  'coming-up',
  'this-week',
  'next-seven-days',
] as const;

export type Period = (typeof Periods)[number];

export const isOfTypePeriod = (input: string): input is Period => {
  return (Periods as readonly string[]).includes(input);
};
