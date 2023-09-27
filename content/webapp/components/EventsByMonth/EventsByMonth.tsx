import { FunctionComponent, useState } from 'react';

// Helpers/Utils
import { cssGrid, classNames } from '@weco/common/utils/classnames';
import { gridSize12 } from '@weco/common/views/components/Layout12/Layout12';
import { groupEventsByMonth, startOf } from './group-event-utils';

// Components
import CardGrid from '../CardGrid/CardGrid';
import CssGridContainer from '@weco/common/views/components/styled/CssGridContainer';
import SegmentedControl, {
  ItemID,
} from '@weco/content/components/SegmentedControl/SegmentedControl';
import Space from '@weco/common/views/components/styled/Space';
import { Container } from '@weco/common/views/components/styled/Container';

// Types
import { EventBasic } from '@weco/content/types/events';
import { Link } from '@weco/content/types/link';

type Props = {
  events: EventBasic[];
  links?: Link[];
};

const EventsByMonth: FunctionComponent<Props> = ({ events, links }) => {
  // Group the events into the per-month tabs that we render on the
  // What's On page, e.g. a group for May, June, July, ...
  const monthsWithEvents = groupEventsByMonth(events).map(
    ({ month, events }) => {
      const id = `${month.month}-${month.year}`.toLowerCase() as ItemID;

      return {
        id,
        url: `#${id}`,
        text: month.month,
        month,
        events,
      };
    }
  );

  // We assume that there will always be some upcoming events scheduled,
  // which means there will be at least one month in `monthsWithEvents`
  // that has some events in it (as long as we have JS)
  const [activeId, setActiveId] = useState<ItemID | undefined>();

  return (
    <div>
      <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
        <CssGridContainer>
          <div className="css-grid">
            <div className={cssGrid(gridSize12)}>
              <SegmentedControl
                id="monthControls"
                activeId={activeId || monthsWithEvents[0].id}
                setActiveId={setActiveId}
                items={monthsWithEvents}
              />
            </div>
          </div>
        </CssGridContainer>
      </Space>

      {monthsWithEvents.map(({ id, month, events }) => (
        <div
          key={id}
          className={classNames({
            [cssGrid(gridSize12)]: true,
            'is-hidden': Boolean(activeId) && activeId !== id,
          })}
        >
          <Container
            as="h2"
            className={classNames({
              'is-hidden': Boolean(activeId),
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
    </div>
  );
};

export default EventsByMonth;
