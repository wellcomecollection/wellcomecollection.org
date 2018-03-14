// @flow

import {grid, font, spacing} from '../../../utils/classnames';
import Icon from '../Icon/Icon';
import Author from '../Author/Author';
import MoreInfoLink from '../MoreInfoLink/MoreInfoLink';
import ButtonButton from '../Buttons/ButtonButton/ButtonButton';
import Image from '../Image/Image';
import camelize from '../../../utils/camelize';
import formatTime from '../../../utils/format-date';

type Props = {|
  event: any, // TODO: type event
  eventInfo: any // TODO: type eventInfo
|}

function getTicketInfo(event, eventInfo) {
  if (event.isDropIn) {
    return 'Drop in';
  } else if (event.cost) {
    return 'Guaranteed entry';
  } else if (eventInfo.eventbriteId && !eventInfo.isCompletelySoldOut) {
    return 'First come, first seated';
  } else if (event.bookingEnquiryTeam) {

  } else {
    return 'Ticketed';
  }
}

function getTicketButton(eventInfo) {
  if (!eventInfo.eventbriteId) return;

  if (eventInfo.isCompletelySoldOut) {
    return (
      <ButtonButton
        disabled
        aria-disabled='true'
        text='Fully booked'
        icon='ticketAvailable'
        extraClasses={`${font({s: 'HNM5'})} btn--full-width-s ${spacing({s: 2}, {margin: ['bottom']})}`}
      />
    );
  } else {
    return (
      <div className="js-eventbrite-ticket-button" data-eventbrite-ticket-id={eventInfo.eventbriteId}>
        <a className={`flex-inline flex--v-center flex--h-center btn btn--full-width-s ${font({s: 'HNM4'})} ${spacing({s: 2}, {margin: ['bottom']})}`}
          href={`https://www.eventbrite.com/e/${eventInfo.eventbriteId}/`}>
          <span><Icon name='ticketAvailable' /></span>
          <span className="js-eventbrite-ticket-button-text">Book free tickets</span>
        </a>
      </div>
    );
  }
}

const EventScheduleItem = ({event, eventInfo}: Props) => (
  <li className={`event-schedule__item drawer js-show-hide ${spacing({s: 2, l: 0}, {padding: ['left']})} ${spacing({s: 4}, {margin: ['bottom']})}`}>
    <button className='event-schedule__trigger plain-button no-margin no-padding pointer js-show-hide-trigger'>
      <div className='grid'>
        <div className={`${grid({s: 12, m: 12, l: 2, xl: 2})} ${spacing({s: 2, l: 0}, {margin: ['bottom']})} event-schedule__border event-schedule__border--top font-purple`}>
          {event.times.map(t => (
            <span key='TODO: lint'>{formatTime(t.range.startDateTime)}&mdash;{formatTime(t.range.endDateTime)}</span>
          ))}

        </div>
        <div className={grid({s: 12, m: 12, l: 7, xl: 7})}>
          {event.format &&
            <span className={`block ${font({s: 'HNM5', m: 'HNM4'})} ${spacing({s: 1}, {margin: ['bottom']})}`}>{event.format.title}</span>
          }
          <h3 className={`${font({s: 'WB7', m: 'WB6'})} ${spacing({s: 0}, {margin: ['top']})} ${spacing({s: 1}, {margin: ['bottom']})}`}>{event.title}</h3>
        </div>
        <div className={`${grid({s: 12, m: 12, l: 3, xl: 3})} ${spacing({s: 2}, {margin: ['top']})} ${spacing({l: 0}, {margin: ['top']})}`}>
          <div className='event-schedule__meta flex flex--h-space-between flex--v-start'>
            <div className="event-schedule__tickets">
              {event.isDropIn &&
                <div className={`${spacing({s: 1}, {margin: ['right', 'bottom']})} ${font({s: 'HNM5', m: 'HNM4'})}`}>No ticket required</div>
              }
              <div className={`${spacing({s: 1}, {margin: ['right', 'bottom']})} ${font({s: 'HNM5', m: 'HNM4'})}`}>{getTicketInfo(event, eventInfo)}</div>
              {event.interpretations.map(interpretation => (
                <Icon key={interpretation.interpretationType.title}
                  title={interpretation.interpretationType.title}
                  name={camelize(interpretation.interpretationType.title)} />
              ))}
            </div>
            <span className='event-schedule__toggle'>
              <Icon name='plus' />
            </span>
          </div>
        </div>
      </div>
    </button>
    <div className='grid js-show-hide-drawer'>
      <div className={`${grid({s: 12, m: 12, l: 2, xl: 2})} ${spacing({s: 2, l: 0}, {margin: ['bottom']})} event-schedule__border event-schedule__border--bottom`}></div>
      <div className={grid({s: 12, m: 12, l: 7, xl: 7})}>
        <div className='drawer__body'>
          <p className={`${spacing({s: 3}, {margin: ['top']})} ${spacing({s: 2}, {margin: ['bottom']})}`} dangerouslySetInnerHTML={{__html: event.description}} />

          <div className={spacing({s: 4}, {margin: ['bottom']})}>
            <MoreInfoLink url='#' name='More information' />
          </div>

          <Author name='Tim Bishop' image='http://fillmurray.com/200/200' />
        </div>
      </div>
      <div className={`${grid({s: 7, m: 6, l: 3, xl: 3})} ${spacing({s: 2}, {margin: ['top']})} drawer__body`}>
        {getTicketButton(eventInfo)}
        <div className="rounded-corners overflow-hidden">
          <Image
            width={600}
            height={400}
            contentUrl="http://fillmurray.com/600/400"
            lazyload={true} />
        </div>
      </div>
    </div>
  </li>
);

export default EventScheduleItem;
