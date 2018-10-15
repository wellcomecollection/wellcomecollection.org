// @flow
import {Component} from 'react';
import {london} from '../../../utils/format-date';
import {getEarliestFutureDateRange} from '../../../utils/dates';
import {classNames, cssGrid, spacing} from '../../../utils/classnames';
import SegmentedControl from '../SegmentedControl/SegmentedControl';
import EventPromo from '../EventPromo/EventPromo';
import DailyTourPromo from '../DailyTourPromo/DailyTourPromo';
import type {UiEvent} from '../../../model/events';

type Props = {|
  events: UiEvent[]
|}

// recursive - TODO: make tail recursive?
function getMonthsInDateRange({start, end}, acc = []) {
  if (start.isSameOrBefore(end, 'month')) {
    const newAcc = acc.concat([start.format('MMMM')]);
    const newStart = start.add(1, 'month');
    return getMonthsInDateRange({start: newStart, end}, newAcc);
  } else {
    return acc;
  }
}

class EventsByMonth extends Component<Props> {
  state = {
    activeId: null
  }
  render() {
    const {events} = this.props;
    const {activeId} = this.state;

    const monthsIndex = {
      'January': 0,
      'February': 1,
      'March': 2,
      'April': 3,
      'May': 4,
      'June': 5,
      'July': 6,
      'August': 7,
      'September': 8,
      'October': 9,
      'November': 10,
      'December': 11
    };
    const eventsInMonths = events.filter(event => event.times.length > 0).map(event => {
      const firstRange = event.times[0];
      const lastRange = event.times[event.times.length - 1];

      const start = firstRange.range && london(firstRange.range.startDateTime);
      const end = lastRange.range && london(lastRange.range.endDateTime);

      const months = getMonthsInDateRange({start, end});
      return {event, months};
    }).reduce((acc, {event, months}) => {
      months.forEach(month => {
        // Only add if it has a time in the month that is the same or after today
        const hasDateInMonthRemaining = event.times.find(time => {
          const end = london(time.range.endDateTime);
          return end.isSame(london({M: monthsIndex[month]}), 'month') && end.isSameOrAfter(london(), 'day');
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
    Object.keys(eventsInMonths).sort((a, b) => {
      return monthsIndex[a] - monthsIndex[b];
    }).map(key => orderedMonths[key] = eventsInMonths[key]);

    const months = Object.keys(orderedMonths).map(month => ({
      id: month,
      url: `#${month}`,
      text: month
    }));

    // Need to order the events for each month based on their earliest future date range
    Object.keys(eventsInMonths).map(month => {
      eventsInMonths[month].sort((a, b) => {
        const aTimes = a.times.map(time => ({start: time.range.startDateTime, end: time.range.endDateTime}));
        const bTimes = b.times.map(time => ({start: time.range.startDateTime, end: time.range.endDateTime}));
        const aEarliestFuture = getEarliestFutureDateRange(aTimes, london({M: monthsIndex[month]})) || {};
        const bEarliestFuture = getEarliestFutureDateRange(bTimes, london({M: monthsIndex[month]})) || {};
        return aEarliestFuture.start - bEarliestFuture.start;
      });
    });

    return (
      <div className={classNames({})}>
        <div className={classNames({
          [spacing({s: 2}, { margin: ['bottom'] })]: true
        })}>
          <div className='css-grid__container'>
            <div className='css-grid'>
              <div className={classNames({
                [cssGrid({s: 12, m: 12, l: 12, xl: 12})]: true
              })}>
                <SegmentedControl
                  id='monthControls'
                  isTabControl={true}
                  activeId={months[0].id}
                  items={months}
                  onActiveIdChange={(id) => {
                    this.setState({activeId: id});
                  }} />
              </div>
            </div>
          </div>
        </div>

        {months.map(month => month.id).map(month =>
          <div
            key={month}
            className={classNames({
              [cssGrid({s: 12, m: 12, l: 12, xl: 12})]: true
            })}
            style={{
              display: !activeId ? 'block' : activeId === month ? 'block' : 'none'
            }}>
            <div className='css-grid__container'>
              <div className='css-grid'>
                <h2
                  id={month}
                  className={classNames({
                    'tabfocus': true,
                    [cssGrid({s: 12, m: 12, l: 12, xl: 12})]: true
                  })}>
                  {month}
                </h2>
              </div>
            </div>
            <div className='css-grid__container'>
              <div className='css-grid'>
                {eventsInMonths[month].map((event, i) => (
                  <div key={event.id} className={classNames({
                    [cssGrid({s: 12, m: 6, l: 4, xl: 4})]: true
                  })}>
                    <EventPromo
                      event={event}
                      position={i}
                      fromDate={london({M: monthsIndex[month]})}
                    />
                  </div>
                ))}
                <div key={`${month}-daily-tour`} className={classNames({
                  [cssGrid({s: 12, m: 6, l: 4, xl: 4})]: true
                })}>
                  <DailyTourPromo />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default EventsByMonth;
