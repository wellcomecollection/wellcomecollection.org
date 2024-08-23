import { secondsToHoursMinutesAndSeconds } from './format-time';

it('formats seconds as [hh:]mm:ss', () => {
  const result1 = secondsToHoursMinutesAndSeconds(10);
  const result2 = secondsToHoursMinutesAndSeconds(100);
  const result3 = secondsToHoursMinutesAndSeconds(1000);
  const result4 = secondsToHoursMinutesAndSeconds(10000);

  expect(result1).toEqual('00:10');
  expect(result2).toEqual('01:40');
  expect(result3).toEqual('16:40');
  expect(result4).toEqual('02:46:40');
});
