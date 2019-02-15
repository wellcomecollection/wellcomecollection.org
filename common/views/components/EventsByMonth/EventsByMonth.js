// @flow
import { type Node, Component } from 'react';
import sortBy from 'lodash.sortby';
import { london } from '../../../utils/format-date';
import { getEarliestFutureDateRange } from '../../../utils/dates';
import { classNames, cssGrid, spacing } from '../../../utils/classnames';
import SegmentedControl from '../SegmentedControl/SegmentedControl';
import CardGrid from '../CardGrid/CardGrid';
import { data as dailyTourPromo } from '../DailyTourPromo/DailyTourPromo';
import type { UiEvent } from '../../../model/events';

type Props = {|
  events: UiEvent[],
  children: Node,
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
    const { events } = this.props;
    const { activeId } = this.state;

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
            const monthAndYear = london(month);
            return (
              end.isSame(
                london({
                  M: monthAndYear.month(),
                  Y: monthAndYear.year(),
                }),
                'month'
              ) && end.isSameOrAfter(london(), 'day')
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

    const months = Object.keys(orderedMonths).map(month => ({
      id: month,
      url: `#${month}`,
      text: london(month).format('MMMM'),
    }));

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

    return (
      <div>
        <div
          className={classNames({
            [spacing({ s: 2 }, { margin: ['bottom'] })]: true,
          })}
        >
          <div className="css-grid__container">
            <div className="css-grid">
              <div
                className={classNames({
                  [cssGrid({ s: 12, m: 12, l: 12, xl: 12 })]: true,
                })}
              >
                <SegmentedControl
                  id="monthControls"
                  activeId={months[0].id}
                  items={months}
                  extraClasses={'segmented-control__list--inline'}
                  onActiveIdChange={id => {
                    this.setState({ activeId: id });
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {months.map(month => (
          <div
            key={month.id}
            className={classNames({
              [cssGrid({ s: 12, m: 12, l: 12, xl: 12 })]: true,
            })}
            style={{
              display: !activeId
                ? 'block'
                : activeId === month.id
                ? 'block'
                : 'none',
            }}
          >
            <div className="css-grid__container">
              <div className="css-grid">
                <h2
                  id={month.id}
                  className={classNames({
                    tabfocus: true,
                    [cssGrid({ s: 12, m: 12, l: 12, xl: 12 })]: true,
                  })}
                >
                  {month.id}
                </h2>
              </div>
            </div>
            <CardGrid items={eventsInMonths[month.id].concat(dailyTourPromo)}>
              {this.props.children}
            </CardGrid>
          </div>
        ))}
      </div>
    );
  }
}

export default EventsByMonth;
