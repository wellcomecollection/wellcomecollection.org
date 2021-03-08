import { prettyDate } from './prettyDate';

describe('prettyDate', () => {
  it('formats a date string', () => {
    expect(prettyDate('2021-03-08T09:37:38.803Z')).toEqual(
      '08/03/2021 09:37:38'
    );
  });

  it('formats a date code', () => {
    expect(prettyDate(1615196247054)).toEqual('08/03/2021 09:37:27');
  });

  it('handles invalid dates', () => {
    expect(prettyDate()).toEqual('Invalid Date');
    expect(prettyDate('')).toEqual('Invalid Date');
    expect(prettyDate('Batman')).toEqual('Invalid Date');
  });
});
