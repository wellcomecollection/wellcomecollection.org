import { Fragment, FC } from 'react';
import type { EventSchedule as EventScheduleType } from '../../types/events';
import EventScheduleItem from './EventScheduleItem';
import { groupEventsBy } from '../../services/prismic/events';
import Space from '@weco/common/views/components/styled/Space';

type Props = {
  schedule: EventScheduleType;
};

const EventSchedule: FC<Props> = ({ schedule }) => {
  const events = schedule.map(({ event }) => event);
  const groupedEvents = groupEventsBy(events, 'day');
  const isNotLinkedIds = schedule
    .map(({ event, isNotLinked }) => {
      return isNotLinked ? event.id : null;
    })
    .filter(Boolean);

  return (
    <Fragment>
      {groupedEvents.map(
        eventsGroup =>
          eventsGroup.events.length > 0 && (
            <Fragment key={eventsGroup.label}>
              {groupedEvents.length > 1 && (
                <Space
                  v={{ size: 'm', properties: ['margin-bottom'] }}
                  as="h3"
                  className="h3"
                >
                  {eventsGroup.label}
                </Space>
              )}
              {eventsGroup.events.map(event => (
                <EventScheduleItem
                  key={event.id}
                  event={event}
                  isNotLinked={isNotLinkedIds.indexOf(event.id) > -1}
                />
              ))}
            </Fragment>
          )
      )}
    </Fragment>
  );
};
export default EventSchedule;
