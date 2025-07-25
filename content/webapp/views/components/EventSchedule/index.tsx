import { Fragment, FunctionComponent } from 'react';

import { font } from '@weco/common/utils/classnames';
import { isPast } from '@weco/common/utils/dates';
import Space from '@weco/common/views/components/styled/Space';
import {
  EventsGroup,
  groupEventsByDay,
} from '@weco/content/services/prismic/events';
import type {
  EventSchedule as EventScheduleType,
  Event as EventType,
} from '@weco/content/types/events';

import EventScheduleItem from './EventSchedule.Item';

const EventScheduleList: FunctionComponent<{
  groupedEvents: EventsGroup<EventType>[];
  isNotLinkedIds: string[];
}> = ({ groupedEvents, isNotLinkedIds }) => (
  <>
    {groupedEvents.map(
      eventsGroup =>
        eventsGroup.events.length > 0 && (
          <Fragment key={eventsGroup.label}>
            {groupedEvents.length > 1 && (
              <Space
                $v={{ size: 'm', properties: ['margin-bottom'] }}
                as="h3"
                className={font('wb', 4)}
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

  // We split scheduled events into two headings: Events and Past Events.
  //
  // This is primarily for the benefit of long-running, repeating events
  // like the Lights Up sessions for Milk.  There are lots of events in
  // the schedule, but we want future/upcoming events to be prioritised
  // on the page; readers shouldn't have to scroll past half a dozen past
  // events to find the ticket link for the next event.
  //
  // See e.g. https://wellcomecollection.org/events/ZCRYYRQAAB3ySUc2
  const pastEvents = groupedEvents.filter(group => isPast(group.end));
  const futureEvents = groupedEvents.filter(group => !isPast(group.end));

  return (
    <div data-component="event-schedule">
      {futureEvents.length > 0 && (
        <>
          <h2 className={font('wb', 3)}>Events</h2>
          <EventScheduleList
            groupedEvents={futureEvents}
            isNotLinkedIds={isNotLinkedIds}
          />
        </>
      )}
      {pastEvents.length > 0 && (
        <>
          <h2 className={font('wb', 3)}>Past events</h2>
          <EventScheduleList
            groupedEvents={pastEvents}
            isNotLinkedIds={isNotLinkedIds}
          />
        </>
      )}
    </div>
  );
};
export default EventSchedule;
