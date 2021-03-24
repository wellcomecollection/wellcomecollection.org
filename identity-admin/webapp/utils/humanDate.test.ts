import { humanDate } from './humanDate';

describe('humanDate', () => {
  it('formats a date string for humans', () => {
    const fiveMinutes = 300000;
    const fiveMinutesAgo: string = new Date(
      Date.now() - fiveMinutes
    ).toISOString();
    // something like '2021-03-24T14:20:00.761Z'
    expect(humanDate(fiveMinutesAgo)).toEqual('5 minutes ago');
  });

  it('formats a date code for humans', () => {
    const fiveMonths = 12096000000;
    const fiveMonthsAgo: number = Date.now() - fiveMonths;
    // something like 1616596004847
    expect(humanDate(fiveMonthsAgo)).toEqual('5 months ago');
  });

  it('handles invalid dates', () => {
    expect(humanDate()).toEqual('Invalid Date');
    expect(humanDate('')).toEqual('Invalid Date');
    expect(humanDate('Batman')).toEqual('Invalid Date');
  });
});
