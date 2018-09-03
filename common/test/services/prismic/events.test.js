// @flow
import {groupEventsBy} from '../../../services/prismic/events';

it('should group events by daterange', () => {
  const multiDayEvents = [{
    times: [{
      range: {
        startDateTime: new Date('2018-01-01'),
        endDateTime: new Date('2018-01-01')
      }
    }, {
      range: {
        startDateTime: new Date('2018-01-01'),
        endDateTime: new Date('2018-01-01')
      }
    }, {
      range: {
        startDateTime: new Date('2018-01-02'),
        endDateTime: new Date('2018-01-02')
      }
    }, {
      range: {
        startDateTime: new Date('2018-01-03'),
        endDateTime: new Date('2018-01-04')
      }
    }]
  }, {
    times: [{
      range: {
        startDateTime: new Date('2018-01-06'),
        endDateTime: new Date('2018-01-07')
      }
    }]
  }];

  // $FlowFixMe
  const eventsGroupedByDay = groupEventsBy(multiDayEvents, 'day');
  expect(eventsGroupedByDay.length).toBe(7);

  eventsGroupedByDay.forEach((eventsGroup, i) => {
    // Friday
    if (i === 4) {
      expect(eventsGroup.events.length).toBe(0);
    } else {
      expect(eventsGroup.events.length).toBe(1);
    }
  });
});
