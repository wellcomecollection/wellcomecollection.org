// @flow
import {Fragment} from 'react';
import EventScheduleItem from '../EventScheduleItem/EventScheduleItem';
import {groupEventsBy} from '../../../services/prismic/events';
import {classNames, spacing} from '../../../utils/classnames';
import type {EventSchedule as EventScheduleType} from '../../../model/events';

type Props = {|
  schedule: EventScheduleType
|}

const EventSchedule = ({schedule}: Props) => {
  const events = schedule.map(({event}) => event);
  const groupedEvents = groupEventsBy(events, 'day');
  const isNotLinkedIds = schedule.map(({event, isNotLinked}) => {
    return isNotLinked ? event.id : null;
  }).filter(Boolean);

  return groupedEvents.map(eventsGroup => (
    eventsGroup.events.length > 0 &&
      <Fragment key={eventsGroup.label}>
        {groupedEvents.length > 1 && <h3 className={classNames({
          'h3': true,
          [spacing({s: 4}, {margin: ['bottom']})]: true
        })}>{eventsGroup.label}</h3>}
        {eventsGroup.events.map(event =>
          <EventScheduleItem
            key={event.id}
            event={event}
            isNotLinked={isNotLinkedIds.indexOf(event.id) > -1} />
        )}
      </Fragment>
  ));
};
export default EventSchedule;
