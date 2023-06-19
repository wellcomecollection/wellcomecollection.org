import { Fragment, FunctionComponent } from 'react';
import type { EventSchedule as EventScheduleType } from '../../types/events';
import EventScheduleItem from './EventScheduleItem';
import { groupEventsByDay } from '../../services/prismic/events';
import Space from '@weco/common/views/components/styled/Space';

type Props = {
  schedule: EventScheduleType;
};

// Note: if you're working on this component, a good test case is
// "Festival of Minds and Bodies" (XagmOxAAACIAo0v8), which is
// a multi-day event with repeated schedule items.  Some of the items
// span multiple days.
const EventSchedule: FunctionComponent<Props> = ({ schedule }) => {
  const events = schedule.map(({ event }) => event);
  const groupedEvents = groupEventsByDay(events);
  const isNotLinkedIds = schedule
    .filter(({ isNotLinked }) => isNotLinked)
    .map(({ event }) => event.id);

  return (
    <>
      <h2 className="h2">Events</h2>
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
    </>
  );
};
export default EventSchedule;
