// @flow
import { Fragment } from 'react';
import type { EventSchedule as EventScheduleType } from '../../../model/events';
import EventScheduleItem from '../EventScheduleItem/EventScheduleItem';
import { groupEventsBy } from '../../../services/prismic/events';
import Space from '../styled/Space';

type Props = {|
  schedule: EventScheduleType,
|};

const EventSchedule = ({ schedule }: Props) => {
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
