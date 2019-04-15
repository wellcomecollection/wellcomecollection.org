// @flow

import { Component } from 'react';
import sortBy from 'lodash.sortby';
import { london } from '../../../utils/format-date';
import { getEarliestFutureDateRange } from '../../../utils/dates';
import CardGrid from '../CardGrid/CardGrid';
import { data as dailyTourPromo } from '../DailyTourPromo/DailyTourPromo';
import { type UiEvent } from '../../../model/events';
import { type Link } from '../../../model/link';

type Props = {|
  events: UiEvent[],
  links?: Link[],
|};

type State = {|
  activeId: ?string,
|};

// recursive - TODO: make tail recursive?
function getMonthsInDateRange({ start, end }, acc = []) {
  if (start.isSameOrBefore(end, 'month')) {
    const newAcc = acc.concat([start.format('YYYY-MM')]);
    const newStart = start.add(1, 'month');
    return getMonthsInDateRange({ start: newStart, end }, newAcc);
  } else {
    return acc;
  }
}

class EventsByMonth extends Component<Props, State> {
  state = {
    activeId: null,
  };
  render() {
    const { events, links } = this.props;
    const monthsIndex = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };
    const eventsInMonths = events
      .filter(event => event.times.length > 0)
      .map(event => {
        const firstRange = event.times[0];
        const lastRange = event.times[event.times.length - 1];

        const start =
          firstRange.range && london(firstRange.range.startDateTime);
        const end = lastRange.range && london(lastRange.range.endDateTime);

        const months = getMonthsInDateRange({ start, end });
        return { event, months };
      })
      .reduce((acc, { event, months }) => {
        months.forEach(month => {
          // Only add if it has a time in the month that is the same or after today
          const hasDateInMonthRemaining = event.times.find(time => {
            const end = london(time.range.endDateTime);
            const start = london(time.range.startDateTime);
            const monthAndYear = london(month);
            return (
              (end.isSame(
                london({
                  M: monthAndYear.month(),
                  Y: monthAndYear.year(),
                }),
                'month'
              ) ||
                start.isSame(
                  london({
                    M: monthAndYear.month(),
                    Y: monthAndYear.year(),
                  }),
                  'month'
                )) &&
              end.isSameOrAfter(london(), 'day')
            );
          });
          if (hasDateInMonthRemaining) {
            if (!acc[month]) {
              acc[month] = [];
            }
            acc[month].push(event);
          }
        });
        return acc;
      }, {});

    // Order months correctly
    const orderedMonths = {};
    Object.keys(eventsInMonths)
      .sort((a, b) => {
        return (
          london(a)
            .toDate()
            .getTime() -
          london(b)
            .toDate()
            .getTime()
        );
      })
      .map(key => (orderedMonths[key] = eventsInMonths[key]));

    // Need to order the events for each month based on their earliest future date range
    Object.keys(eventsInMonths).map(month => {
      eventsInMonths[month] = sortBy(eventsInMonths[month], [
        m => {
          const times = m.times.map(time => ({
            start: time.range.startDateTime,
            end: time.range.endDateTime,
          }));
          const earliestRange = getEarliestFutureDateRange(
            times,
            london({ M: monthsIndex[london(month).format('MMMM')] })
          );
          return earliestRange && earliestRange.start;
        },
      ]);
    });
    const eventsArray = Object.keys(eventsInMonths)
      .reduce(function(r, k) {
        return r.concat(eventsInMonths[k]);
      }, [])
      .concat(dailyTourPromo);
    return <CardGrid items={eventsArray} itemsPerRow={3} links={links} />;
  }
}

export default EventsByMonth;
