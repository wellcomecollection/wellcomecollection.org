import { Component } from 'react';
import sortBy from 'lodash.sortby';
import {
  getEarliestFutureDateRange,
  isFuture,
  isSameDay,
  isSameMonth,
} from '@weco/common/utils/dates';
import { classNames, cssGrid } from '@weco/common/utils/classnames';
import SegmentedControl from '@weco/common/views/components/SegmentedControl/SegmentedControl';
import { EventBasic } from '../../types/events';
import { Link } from '../../types/link';
import Space from '@weco/common/views/components/styled/Space';
import CssGridContainer from '@weco/common/views/components/styled/CssGridContainer';
import CardGrid from '../CardGrid/CardGrid';
import {
  createLabel,
  findMonthsThatEventSpans,
  parseLabel,
  startOf,
} from './group-event-utils';

type Props = {
  events: EventBasic[];
  links?: Link[];
};

type State = {
  activeId?: string;
};

class EventsByMonth extends Component<Props, State> {
  state = {
    activeId: undefined,
  };

  render() {
    const { events, links } = this.props;
    const { activeId } = this.state;
    const monthsIndex = {
      1: 'January',
      2: 'February',
      3: 'March',
      4: 'April',
      5: 'May',
      6: 'June',
      7: 'July',
      8: 'August',
      9: 'September',
      10: 'October',
      11: 'November',
      12: 'December',
    };

    const eventsWithTheirMonths = findMonthsThatEventSpans(events);

    // Key: a YYYY-MM month label like "2001-02"
    // Value: a list of events that fall somewhere in this month
    const eventsInMonths: Record<string, EventBasic[]> =
      eventsWithTheirMonths.reduce((acc, { event, months }) => {
        months.forEach(month => {
          // Only add if it has a time in the month that is the same or after today
          //
          // NOTE: this means a very long-running event wouldn't appear in the events
          // for a month, e.g. a Jan-Feb-Mar event wouldn't appear in the February events.
          // Do we have any such long-running events?  If so, this is probably okay.
          const hasDateInMonthRemaining = event.times.find(time => {
            const start = time.range.startDateTime;
            const end = time.range.endDateTime;

            const endsInMonth = isSameMonth(end, startOf(month));

            const startsInMonth = isSameMonth(start, startOf(month));

            const today = new Date();
            const isNotClosedYet = isSameDay(end, today) || isFuture(end);

            return (endsInMonth || startsInMonth) && isNotClosedYet;
          });
          if (hasDateInMonthRemaining) {
            const label = createLabel(month);

            if (!acc[label]) {
              acc[label] = [];
            }
            acc[label].push(event);

            console.log(`@@AWLC label = ${label}`);
            console.log(`@@AWLC events = ${acc[label].map(event => event.id)}`);
          }
        });
        return acc;
      }, {} as Record<string, EventBasic[]>);
    console.log('');

    // Order months correctly.  This returns the headings for each month,
    // now in chronological order.
    const monthHeadings = Object.keys(eventsInMonths)
      .sort((a, b) =>
        // Because these are YYYY-MM strings (e.g. '2001-02'), we can use
        // lexicographic ordering for the correct results here.
        a >= b ? 1 : -1
      )
      .map(label => {
        const yearMonth = parseLabel(label);

        return {
          id: label,
          url: `#${label}`,
          text: monthsIndex[yearMonth.month],
        };
      });

    // Need to order the events for each month based on their earliest future date range
    Object.keys(eventsInMonths).map(label => {
      eventsInMonths[label] = sortBy(eventsInMonths[label], [
        m => {
          console.log(`@@AWLC m = ${JSON.stringify(m.id)}`);
          console.log(`@@AWLC m.times = ${JSON.stringify(m.times)}`);
          const times = m.times.map(time => ({
            start: time.range.startDateTime,
            end: time.range.endDateTime,
          }));
          const fromDate = startOf(parseLabel(label));

          const earliestRange = getEarliestFutureDateRange(times, fromDate);
          console.log(`@@AWLC key = ${earliestRange && earliestRange.start}`);
          return earliestRange && earliestRange.start;
        },
      ]);
    });

    return (
      <div>
        <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
          <CssGridContainer>
            <div className="css-grid">
              <div
                className={classNames({
                  [cssGrid({ s: 12, m: 12, l: 12, xl: 12 })]: true,
                })}
              >
                <SegmentedControl
                  id="monthControls"
                  activeId={monthHeadings[0]?.id}
                  items={monthHeadings}
                  extraClasses={'segmented-control__list--inline'}
                  onActiveIdChange={id => {
                    this.setState({ activeId: id });
                  }}
                />
              </div>
            </div>
          </CssGridContainer>
        </Space>

        {monthHeadings.map(month => (
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
            <CssGridContainer>
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
            </CssGridContainer>
            <CardGrid
              items={eventsInMonths[month.id]}
              itemsPerRow={3}
              links={links}
              fromDate={startOf(parseLabel(month.id))}
            />
          </div>
        ))}
      </div>
    );
  }
}

export default EventsByMonth;
