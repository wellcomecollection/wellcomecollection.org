import { FunctionComponent, useMemo, useState } from 'react';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { classNames } from '@weco/common/utils/classnames';
import { gridSize12 } from '@weco/common/views/components/Layout';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import { EventBasic } from '@weco/content/types/events';
import { Link } from '@weco/content/types/link';
import CardGrid from '@weco/content/views/components/CardGrid';
import { data as dailyTourPromo } from '@weco/content/views/components/CardGrid/CardGrid.DailyTourCard';
import Tabs from '@weco/content/views/components/Tabs';

import { groupEventsByMonth, startOf } from './whats-on.EventsByMonth.helpers';

type Props = {
  events: EventBasic[];
  links?: Link[];
};

const EventsByMonth: FunctionComponent<Props> = ({ events, links }) => {
  const { isEnhanced } = useAppContext();
  // Group the events into the per-month tabs that we render on the
  // What's On page, e.g. a group for May, June, July, ...
  const monthsWithEvents = useMemo(
    () =>
      groupEventsByMonth(events)
        .map(({ month, events }) => {
          const id = `${month.month}-${month.year}`.toLowerCase();

          return {
            id,
            url: `#${id}`,
            text: month.month,
            month,
            // Add daily tour promo to each month's events array during grouping
            events: events.concat(dailyTourPromo),
          };
        })
        .slice(0, 4) // never show more than 4 months
        .filter(month => month.events.length > 0), // only include months that have events
    [events]
  );

  // We assume that there will always be some upcoming events scheduled,
  // which means there will be at least one month in `monthsWithEvents`
  // that has some events in it (as long as we have JS)
  const [activeId, setActiveId] = useState<string | undefined>();

  return (
    <>
      <Space $v={{ size: 'm', properties: ['margin-bottom'] }}>
        <Container>
          <Grid>
            <GridCell $sizeMap={gridSize12()}>
              <Tabs
                tabBehaviour="switch"
                label="Month control"
                selectedTab={activeId || monthsWithEvents[0].id}
                items={monthsWithEvents}
                setSelectedTab={setActiveId}
              />
            </GridCell>
          </Grid>
        </Container>
      </Space>

      {monthsWithEvents
        .filter(i =>
          isEnhanced ? i.id === (activeId || monthsWithEvents[0].id) : true
        )
        .map(({ id, month, events }) => (
          <GridCell
            $sizeMap={gridSize12()}
            key={id}
            className={classNames({
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
          </GridCell>
        ))}
    </>
  );
};

export default EventsByMonth;
