// @flow
import EventScheduleItem from '../EventScheduleItem/EventScheduleItem';
import {groupEventsBy} from '../../../services/prismic/events';
import {classNames} from '../../../utils/classnames';
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

  return groupedEvents.map((eventsGroup, i) => (
    eventsGroup.events.length > 0 &&
      <div key={eventsGroup.label} style={{position: 'relative'}} id={`event-schedule-group-${i}`}>
        {groupedEvents.length > 1 &&
          <div
            className='flex'
            style={{position: 'sticky', top: 0, background: 'white'}}>
            <h3 className={classNames({
              'h3': true,
              'no-margin': true,
              'flex-1': true
            })}>
              {eventsGroup.label}
            </h3>
            <a href={`#event-schedule-group-${i - 1}`} className='h3 margin-right-s1 js-scroll-to-info'>{'<='}</a>
            <a href={`#event-schedule-group-${i + 1}`} className='h3 js-scroll-to-info'>{'=>'}</a>
          </div>
        }
        {eventsGroup.events.map(event =>
          <EventScheduleItem
            key={event.id}
            event={event}
            isNotLinked={isNotLinkedIds.indexOf(event.id) > -1} />
        )}
      </div>
  ));
};
export default EventSchedule;
