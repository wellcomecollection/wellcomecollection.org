import * as dateUtils from '@weco/common/utils/dates';

/** Override the return value of the `today()` function.
 *
 * This is useful for anything that tests date-time logic -- you can specify
 * the precise time that the code under test believes it to be.
 *
 * For example:
 *
 *      import mockToday from '@weco/common/test/utils/date-mocks';
 *
 *      mockToday({ as: new Date('2021-10-30') });
 *
 * Any code running in this test will be told that the current date is 30 October 2021.
 *
 */
export function mockToday({ as: overrideDate }: { as: Date }) {
  jest.spyOn(dateUtils, 'today').mockImplementation(() => overrideDate);

  // Implementation note: although `isFuture()` and `isPast()` both use the `today()`
  // function internally, they don't seem to be affected by the mock above.
  //
  // We override them here so they're consistent with the specified override date,
  // and to provide a consistent interface to this mocking behaviour.  One function
  // does everything!
  jest.spyOn(dateUtils, 'isFuture').mockImplementation(d => overrideDate < d);
  jest.spyOn(dateUtils, 'isPast').mockImplementation(d => d < overrideDate);
}

export default mockToday;
