import { Component } from 'react';
import sortBy from 'lodash.sortby';
import { Moment } from 'moment';
import { london } from '@weco/common/utils/format-date';
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

type Props = {
  events: EventBasic[];
  links?: Link[];
};

type State = {
  activeId?: string;
};

// recursive - TODO: make tail recursive?
type StartEnd = { start: Moment; end: Moment };

function getMonthsInDateRange(
  { start, end }: StartEnd,
  acc: string[] = []
): string[] {
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
    activeId: undefined,
  };

  render() {
    const { events, links } = this.props;
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

    // Returns a list of events and the months they fall in.
    // The months are formatted as YYYY-MM labels like "2001-02".
    const eventsWithMonths: {
      event: EventBasic;
      months: string[];
    }[] = events
      .filter(event => event.times.length > 0)
      .map(event => {
        const firstRange = event.times[0];
        const lastRange = event.times[event.times.length - 1];

        const start = london(firstRange.range.startDateTime);
        const end = london(lastRange.range.endDateTime);

        const months = getMonthsInDateRange({ start, end });
        return { event, months };
      });

    // Key: a YYYY-MM month label like "2001-02"
    // Value: a list of events that fall somewhere in this month
    const eventsInMonths: Record<string, EventBasic[]> =
      eventsWithMonths.reduce((acc, { event, months }) => {
        months.forEach(month => {
          // Only add if it has a time in the month that is the same or after today
          //
          // NOTE: this means a very long-running event wouldn't appear in the events
          // for a month, e.g. a Jan-Feb-Mar event wouldn't appear in the February events.
          // Do we have any such long-running events?  If so, this is probably okay.
          const hasDateInMonthRemaining = event.times.find(time => {
            const monthAndYear = london(month);

            const endsInMonth = isSameMonth(
              time.range.endDateTime,
              monthAndYear.toDate()
            );

            const startsInMonth = isSameMonth(
              time.range.startDateTime,
              monthAndYear.toDate()
            );

            const today = new Date();
            const isNotClosedYet =
              isSameDay(time.range.endDateTime, today) ||
              isFuture(time.range.endDateTime);

            return (endsInMonth || startsInMonth) && isNotClosedYet;
          });
          if (hasDateInMonthRemaining) {
            if (!acc[month]) {
              acc[month] = [];
            }
            acc[month].push(event);
          }
        });
        return acc;
      }, {} as Record<string, EventBasic[]>);

    // Order months correctly.  This returns the headings for each month,
    // now in chronological order.
    const monthHeadings = Object.keys(eventsInMonths)
      .sort((a, b) => {
        return london(a).toDate().getTime() - london(b).toDate().getTime();
      })
      .map(month => ({
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
              fromDate={london(month.id)}
            />
          </div>
        ))}
      </div>
    );
  }
}

export default EventsByMonth;
