import { FunctionComponent, useState } from 'react';

// Helpers/Utils
import { cssGrid } from '@weco/common/utils/classnames';
import { gridSize12 } from '@weco/common/views/components/Layout12/Layout12';
import { groupEventsByMonth, startOf } from './group-event-utils';

// Components
import CardGrid from '../CardGrid/CardGrid';
import CssGridContainer from '@weco/common/views/components/styled/CssGridContainer';
import SegmentedControl from '@weco/common/views/components/SegmentedControl/SegmentedControl';
import Space from '@weco/common/views/components/styled/Space';

// Types
import { EventBasic } from '@weco/content/types/events';
import { Link } from '@weco/content/types/link';

type Props = {
  events: EventBasic[];
  links?: Link[];
};

const EventsByMonth: FunctionComponent<Props> = ({ events, links }) => {
  // Order months correctly.  This returns the headings for each month,
  // now in chronological order.
  const eventsInMonths = groupEventsByMonth(events).map(({ month, events }) => {
    const id = `${month.month}-${month.year}`.toLowerCase();

    return {
      id,
      url: `#${id}`,
      text: month.month,
      month,
      events,
    };
  });

  const [activeId, setActiveId] = useState(eventsInMonths[0].id);

  return (
    <div>
      <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
        <CssGridContainer>
          <div className="css-grid">
            <div className={cssGrid(gridSize12)}>
              <SegmentedControl
                id="monthControls"
                activeId={activeId}
                setActiveId={setActiveId}
                items={eventsInMonths}
              />
            </div>
          </div>
        </CssGridContainer>
      </Space>

      {eventsInMonths
        .filter(({ id }) => activeId === id)
        .map(({ id, month, events }) => (
          <div
            key={id}
            className={cssGrid(gridSize12)}
            style={{ display: 'block' }}
          >
            <h2 className="container" id={id}>
              {month.month}
            </h2>
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
