// @flow
import {Fragment} from 'react';
import EventScheduleItem from '../EventScheduleItem/EventScheduleItem';
import {groupEventsBy} from '../../../services/prismic/events';
import {classNames, spacing} from '../../../utils/classnames';
import type {UiEvent} from '../../../model/events';

type Props = {|
  events: UiEvent[]
|}

const EventSchedule = ({events}: Props) => {
  const groupedEvents = groupEventsBy(events, 'day');

  return groupedEvents.map(eventsGroup => (
    eventsGroup.events.length > 0 &&
      <Fragment key={eventsGroup.label}>
        {groupedEvents.length > 0 && <h3 className={classNames({
          'h3': true,
          [spacing({s: 4}, {margin: ['bottom']})]: true
        })}>{eventsGroup.label}</h3>}
        {eventsGroup.events.map(event =>
          <EventScheduleItem key={event.id} event={event} />
        )}
      </Fragment>
  ));
};
export default EventSchedule;
