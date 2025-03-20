import { FunctionComponent, useContext, useState } from 'react';

import { classNames, grid } from '@weco/common/utils/classnames';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import { gridSize12 } from '@weco/common/views/components/Layout';
import { Container } from '@weco/common/views/components/styled/Container';
import CssGridContainer from '@weco/common/views/components/styled/CssGridContainer';
import Space from '@weco/common/views/components/styled/Space';
import CardGrid from '@weco/content/components/CardGrid/CardGrid';
import Tabs from '@weco/content/components/Tabs';
import { EventBasic } from '@weco/content/types/events';
import { Link } from '@weco/content/types/link';

import { groupEventsByMonth, startOf } from './group-event-utils';

type Props = {
  events: EventBasic[];
  links?: Link[];
};

const EventsByMonth: FunctionComponent<Props> = ({ events, links }) => {
  const { isEnhanced } = useContext(AppContext);
  // Group the events into the per-month tabs that we render on the
  // What's On page, e.g. a group for May, June, July, ...
  const monthsWithEvents = groupEventsByMonth(events)
    .map(({ month, events }) => {
      const id = `${month.month}-${month.year}`.toLowerCase();

      return {
        id,
        url: `#${id}`,
        text: month.month,
        month,
        events,
      };
    })
    .slice(0, 4) // never show more than 4 months
    .filter(month => month.events.length > 0); // only include months that have events

  // We assume that there will always be some upcoming events scheduled,
  // which means there will be at least one month in `monthsWithEvents`
  // that has some events in it (as long as we have JS)
  const [activeId, setActiveId] = useState<string | undefined>();

  return (
    <>
      <Space $v={{ size: 'm', properties: ['margin-bottom'] }}>
        <CssGridContainer>
          <div className="grid">
            <div className={grid(gridSize12())}>
              <Tabs
                tabBehaviour="switch"
                label="Month control"
                selectedTab={activeId || monthsWithEvents[0].id}
                items={monthsWithEvents}
                setSelectedTab={setActiveId}
                trackWithSegment
              />
            </div>
          </div>
        </CssGridContainer>
      </Space>

      {monthsWithEvents
        .filter(i =>
          isEnhanced ? i.id === (activeId || monthsWithEvents[0].id) : true
        )
        .map(({ id, month, events }) => (
          <div
            key={id}
            className={classNames({
              [grid(gridSize12())]: true,
              'is-hidden': Boolean(activeId) && activeId !== id,
            })}
          >
            <Container
              as="h2"
              className={classNames({
                'is-hidden': Boolean(isEnhanced),
              })}
              id={id}
            >
              {month.month}
            </Container>
            <CardGrid
              items={events}
              itemsPerRow={3}
              links={links}
              fromDate={startOf(month)}
            />
          </div>
        ))}
    </>
  );
};

export default EventsByMonth;
