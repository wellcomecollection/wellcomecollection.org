// @flow
import {spacing, font} from '../../../utils/classnames';
import {UiImage} from '../Images/Images';
import LabelsList from '../LabelsList/LabelsList';
import Icon from '../Icon/Icon';
import EventDateRange from '../EventDateRange/EventDateRange';
import {isEventFullyBooked} from '../../../model/events';
import type {UiEvent} from '../../../model/events';
import Moment from 'moment';

type Props = {|
  event: UiEvent,
  position?: number,
  dateString?: string,
  timeString?: string,
  fromDate?: Moment
|}

const EventPromo = ({
  event,
  position = 0,
  dateString,
  timeString,
  fromDate
}: Props) => {
  const fullyBooked = isEventFullyBooked(event);
  const isPast = event.isPast;

  return (
    <a data-component='EventPromo'
      data-component-state={JSON.stringify({ position: position })}
      data-track-event={JSON.stringify({category: 'component', action: 'EventPromo:click', label: `id : ${event.id}, position : ${position}`})}
      href={event.promo && event.promo.link || `/events/${event.id}`}
      className='plain-link promo-link bg-cream rounded-corners overflow-hidden flex flex--column'>
      <div className='relative'>
        {/* FIXME: Image type tidy */}
        {/* $FlowFixMe */}
        {event.promoImage && <UiImage {...event.promoImage}
          sizesQueries='(min-width: 1420px) 386px, (min-width: 960px) calc(28.64vw - 15px), (min-width: 600px) calc(50vw - 54px), calc(100vw - 36px)'
          showTasl={false} />}

        {event.labels.length > 0 &&
          <div style={{position: 'absolute', bottom: 0}}>
            <LabelsList labels={event.labels} />
          </div>
        }
      </div>

      <div className={`
          flex flex--column flex-1 flex--h-space-between
          ${spacing({s: 2}, {padding: ['top']})}
          ${spacing({s: 2}, {padding: ['left', 'right']})}
          ${spacing({s: 4}, {padding: ['bottom']})}
        `}>

        <div>
          <h2 className={`
            promo-link__title
            ${font({s: 'WB5'})}
            ${spacing({s: 0}, {margin: ['top']})}
            ${spacing({s: 1}, {margin: ['bottom']})}
          `}>
            {event.title}
          </h2>

          {!isPast &&
            <p className={`${font({s: 'HNL4'})} no-padding no-margin`}>
              <EventDateRange event={event} splitTime={true} fromDate={fromDate} />
            </p>
          }

          {!isPast && dateString &&
            <p className={`${font({s: 'HNL4'})} no-padding no-margin`}>
              {dateString}
            </p>
          }

          {!isPast && timeString &&
            <p className={`${font({s: 'HNL4'})} no-padding no-margin`}>
              {timeString}
            </p>
          }

          {!isPast && fullyBooked &&
            <div className={`${font({s: 'HNL5'})} flex flex--v-center`}>
              <span className={`${spacing({s: 1}, {margin: ['right']})} flex flex--v-center`}>
                <Icon name='statusIndicator' extraClasses={'icon--red icon--match-text'} />
              </span>
              Fully booked
            </div>
          }

          {!isPast && event.schedule && event.schedule.length > 0 &&
            <p className={`${font({s: 'HNM5'})} no-padding no-margin`}>
              {`${event.schedule.length} ${event.schedule.length > 1 ? 'events' : 'event'}`}
            </p>
          }

          {!isPast && event.times.length > 1 &&
            <p className={`${font({s: 'HNM5'})}`}>See all dates/times</p>
          }

          {isPast &&
            <div className={`${font({s: 'HNL5'})} flex flex--v-center`}>
              <span className={`${spacing({s: 1}, {margin: ['right']})} flex flex--v-center`}>
                <Icon name='statusIndicator' extraClasses={'icon--marble icon--match-text'} />
              </span>
              Past
            </div>
          }
        </div>

        {event.series.length > 0 &&
          <div className={spacing({s: 4}, {margin: ['top']})}>
            {event.series.map((series) => (
              <p key={series.title} className={`${font({s: 'HNM5'})} no-margin`}>
                <span className={font({s: 'HNL5'})}>Part of</span>{' '}{series.title}
              </p>
            ))}
          </div>
        }
      </div>
    </a>
  );
};

export default EventPromo;
