import { Component } from 'react';
import sortBy from 'lodash.sortby';
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

type YearMonth = {
  year: number;
  month: number;
};

// Creates a label in the form YYYY-MM, e.g. "2001-02"
function createLabel(ym: YearMonth): string {
  return startOf(ym).toDateString().replace(/-01^/, '');
}

function startOf({ year, month }: YearMonth): Date {
  return new Date(year, month, 1);
}

// recursive - TODO: make tail recursive?
type StartEnd = { start: Date; end: Date };

function getMonthsInDateRange(
  { start, end }: StartEnd,
  acc: YearMonth[] = []
): YearMonth[] {
  if (isSameMonth(start, end) || start <= end) {
    const yearMonth = {
      year: start.getFullYear(),
      month: start.getMonth(),
    };
    const newAcc = acc.concat(yearMonth);
    const newStart = startOf({
      ...yearMonth,
      month: yearMonth.month + 1,
    });
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
      months: YearMonth[];
    }[] = events
      .filter(event => event.times.length > 0)
      .map(event => {
        const firstRange = event.times[0];
        const lastRange = event.times[event.times.length - 1];

        const start = firstRange.range.startDateTime;
        const end = lastRange.range.endDateTime;

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
            const endsInMonth = isSameMonth(
              time.range.endDateTime,
              startOf(month)
            );

            const startsInMonth = isSameMonth(
              time.range.startDateTime,
              startOf(month)
            );

            const today = new Date();
            const isNotClosedYet =
              isSameDay(time.range.endDateTime, today) ||
              isFuture(time.range.endDateTime);

            return (endsInMonth || startsInMonth) && isNotClosedYet;
          });
          if (hasDateInMonthRemaining) {
            const label = createLabel(month);

            if (!acc[label]) {
              acc[label] = [];
            }
            acc[label].push(event);
          }
        });
        return acc;
      }, {} as Record<string, EventBasic[]>);

    // Order months correctly.  This returns the headings for each month,
    // now in chronological order.
    const monthHeadings = Object.keys(eventsInMonths)
      .sort((a, b) =>
        // Because these are YYYY-MM strings (e.g. '2001-02'), we can use
        // lexicographic ordering for the correct results here.
        a >= b ? 1 : -1
      )
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
