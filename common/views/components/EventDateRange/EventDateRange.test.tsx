import mockToday from '@weco/common/test/utils/date-mocks';

import { getEarliestFutureDateRange } from '.';

describe('getEarliestFutureDateRange', () => {
  mockToday({ as: new Date('2022-08-30') });

  it('picks the single range available if it’s after now', () => {
    const dateRanges = [
      {
        start: new Date('2022-10-06T19:00:00.000+0100'),
        end: new Date('2022-10-06T19:30:00.000+0100'),
      },
    ];
    const fromDate = new Date('2022-10-01T00:00:00.000+0100');

    const result = getEarliestFutureDateRange(dateRanges, fromDate);
    expect(result).toBe(dateRanges[0]);
  });

  it('skips the single range available if it’s in the past', () => {
    const dateRanges = [
      {
        start: new Date('2002-10-06T19:00:00.000+0100'),
        end: new Date('2002-10-06T19:30:00.000+0100'),
      },
    ];
    const fromDate = new Date('2022-10-01T00:00:00.000+0100');

    const result = getEarliestFutureDateRange(dateRanges, fromDate);
    expect(result).toBeUndefined();
  });

  it('picks the earliest valid range, if multiple are available', () => {
    // Note that the dateRanges argument is in descending order, to make sure
    // we're sorting properly and not relying on the order that ranges are passed.
    const earliestRange = {
      start: new Date('2022-10-04T19:00:00.000+0100'),
      end: new Date('2022-10-04T19:30:00.000+0100'),
    };

    const dateRanges = [
      {
        start: new Date('2022-10-06T19:00:00.000+0100'),
        end: new Date('2022-10-06T19:30:00.000+0100'),
      },
      {
        start: new Date('2022-10-05T19:00:00.000+0100'),
        end: new Date('2022-10-05T19:30:00.000+0100'),
      },
      earliestRange,
    ];
    const fromDate = new Date('2022-10-01T00:00:00.000+0100');

    const result = getEarliestFutureDateRange(dateRanges, fromDate);
    expect(result).toBe(earliestRange);
  });

  it('filters based on the fromDate', () => {
    const septemberEvent = {
      start: new Date('2022-09-01T19:00:00.000+0100'),
      end: new Date('2022-09-01T19:30:00.000+0100'),
    };
    const octoberEvent = {
      start: new Date('2022-10-01T19:00:00.000+0100'),
      end: new Date('2022-10-01T19:30:00.000+0100'),
    };
    const novemberEvent = {
      start: new Date('2022-11-01T19:00:00.000+0100'),
      end: new Date('2022-11-01T19:30:00.000+0100'),
    };

    const dateRanges = [septemberEvent, octoberEvent, novemberEvent];

    const fromNow = getEarliestFutureDateRange(dateRanges);
    expect(fromNow).toBe(septemberEvent);

    const fromMidSept = getEarliestFutureDateRange(
      dateRanges,
      new Date('2022-09-15')
    );
    expect(fromMidSept).toBe(octoberEvent);

    const fromMidOct = getEarliestFutureDateRange(
      dateRanges,
      new Date('2022-10-15')
    );
    expect(fromMidOct).toBe(novemberEvent);

    const fromMidNov = getEarliestFutureDateRange(
      dateRanges,
      new Date('2022-11-15')
    );
    expect(fromMidNov).toBeUndefined();
  });
});
