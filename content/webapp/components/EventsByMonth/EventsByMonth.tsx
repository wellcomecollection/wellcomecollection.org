import { FunctionComponent, useState } from 'react';
import { classNames, cssGrid } from '@weco/common/utils/classnames';
import SegmentedControl from '@weco/common/views/components/SegmentedControl/SegmentedControl';
import { EventBasic } from '../../types/events';
import { Link } from '../../types/link';
import Space from '@weco/common/views/components/styled/Space';
import CssGridContainer from '@weco/common/views/components/styled/CssGridContainer';
import CardGrid from '../CardGrid/CardGrid';
import { groupEventsByMonth, startOf } from './group-event-utils';
import { gridSize12 } from '@weco/common/views/components/Layout12/Layout12';

type Props = {
  events: EventBasic[];
  links?: Link[];
};

const EventsByMonth: FunctionComponent<Props> = ({ events, links }) => {
  const eventsInMonths = groupEventsByMonth(events);

  // Order months correctly.  This returns the headings for each month,
  // now in chronological order.
  const groups = eventsInMonths.map(({ month, events }) => {
    const id = `${month.month}-${month.year}`.toLowerCase();

    return {
      id,
      url: `#${id}`,
      text: month.month,
      month,
      events,
    };
  });

  const [activeId, setActiveId] = useState(groups[0].id);

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
                items={groups}
              />
            </div>
          </div>
        </CssGridContainer>
      </Space>

      {groups.map(g => (
        <div
          key={g.id}
          className={cssGrid(gridSize12)}
          style={{
            display: activeId === g.id ? 'block' : 'none',
          }}
        >
          <h2
            className={classNames({
              container: true,
              'is-hidden': Boolean(activeId),
            })}
            id={g.id}
          >
            {g.month.month}
          </h2>
          <CardGrid
            items={g.events}
            itemsPerRow={3}
            links={links}
            fromDate={startOf(g.month)}
          />
        </div>
      ))}
    </div>
  );
};

export default EventsByMonth;
