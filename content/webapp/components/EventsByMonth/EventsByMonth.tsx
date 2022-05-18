import { Component } from 'react';
import { classNames, cssGrid } from '@weco/common/utils/classnames';
import SegmentedControl from '@weco/common/views/components/SegmentedControl/SegmentedControl';
import { EventBasic } from '../../types/events';
import { Link } from '../../types/link';
import Space from '@weco/common/views/components/styled/Space';
import CssGridContainer from '@weco/common/views/components/styled/CssGridContainer';
import CardGrid from '../CardGrid/CardGrid';
import {
  groupEventsByMonth,
  parseLabel,
  sortByEarliestFutureDateRange,
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

  render(): JSX.Element {
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

    const eventsInMonths = groupEventsByMonth(events);

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
      eventsInMonths[label] = sortByEarliestFutureDateRange(
        eventsInMonths[label]
      );
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
