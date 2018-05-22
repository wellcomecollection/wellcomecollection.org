// @flow
import {Fragment} from 'react';
import {spacing, font} from '../../../utils/classnames';
import {isDatePast, formatDayDate, formatTime} from '../../../utils/format-date';
import {UiImage} from '../Images/Images';
import Icon from '../Icon/Icon';
import type {EventPromo as Props} from '../../../model/events';

function capitalize(word) {
  return `${word.slice(0, 1).toUpperCase()}${word.slice(1).toLowerCase()}`;
}

function camelize(text, separator = '_') {
  const words = text.split(separator);
  return [words[0].toLowerCase(), words.slice(1).map((word) =>  capitalize(word)).join('')].join('');
}

const EventPromo = ({
  id,
  title,
  url,
  start,
  end,
  isFullyBooked,
  hasNotFullyBookedTimes,
  description,
  format,
  bookingType,
  image,
  interpretations,
  eventbriteId,
  dateString,
  timeString,
  audience,
  schedule,
  series
}: Props) => {
  const isPast = end && isDatePast(end);
  return (
    <a data-component='EventPromo'
      data-track-event={JSON.stringify({category: 'component', action: 'EventPromo:click', label: `id : ${id}`})}
      id={id}
      href={url}
      className='plain-link promo-link bg-cream rounded-corners overflow-hidden flex flex--column'>
      {image && <UiImage
        contentUrl={image.contentUrl}
        width={image.width || 0}
        height={image.height || 0}
        alt={image.alt || ''}
        tasl={image.tasl}
        sizesQueries='(min-width: 1420px) 386px, (min-width: 960px) calc(28.64vw - 15px), (min-width: 600px) calc(50vw - 54px), calc(100vw - 36px)'
        showTasl={false} />}

      <div className={`
          flex flex--column flex-1
          ${spacing({s: 2}, {padding: ['top']})}
          ${spacing({s: 3}, {padding: ['left', 'right']})}
          ${spacing({s: 4}, {padding: ['bottom']})}
        `}>
        <div className={`
            no-padding flex flex--v-center
            ${spacing({s: 2}, {margin: ['bottom']})}
            ${font({s: 'HNM5'})}
          `}>
          {interpretations.map(interpretation => {
            const icon = interpretation.interpretationType.title.replace(/ /g, '_').replace(/-/g, '_');
            return (
              <span key={icon} className={spacing({s: 1}, {margin: ['right']})}>
                <Icon name={camelize(icon)} />
              </span>
            );
          })}
          <span>
            {format && format.title}
            {audience && audience.title && ` for ${audience.title}`}
          </span>
        </div>

        <h2 className={`
            promo-link__title
            ${font({s: 'WB5'})}
            ${spacing({s: 0}, {margin: ['top', 'bottom']})})
          `}>
          {title}
        </h2>

        {schedule.length > 0 &&
          <p className={`${font({s: 'HNM4'})} no-padding no-margin`}>
            {schedule.length} events
          </p>
        }

        {series.map((series) => (
          <div key={series.title} className={font({s: 'HNM5'})}>
            {series.title}
          </div>
        ))}

        <div className={spacing({s: 2}, {margin: ['bottom']})}
        ></div>

        {start && end && !isPast &&
            <Fragment>
              <p className={`${font({s: 'HNL4'})} no-padding no-margin`}>
                <time dateTime={start}>{formatDayDate(start)}</time>
              </p>
              <p className={`${font({s: 'HNL4'})} ${spacing({s: 2}, {margin: ['bottom']})} no-padding`}>
                <time dateTime={start}>{formatTime(start)}</time>&mdash;<time dateTime={end}>{formatTime(end)}</time>
              </p>
            </Fragment>
        }

        {dateString &&
            <p className={`${font({s: 'HNL4'})} no-padding no-margin`}>
              {dateString}
            </p>
        }

        {timeString &&
            <p className={`${font({s: 'HNL4'})} ${spacing({s: 2}, {margin: ['bottom']})} no-padding no-margin`}>
              {timeString}
            </p>
        }

        {isFullyBooked && !isPast &&
            <div className={`${font({s: 'HNM5'})} flex flex--v-center margin-top-auto`}>
              <span className={`${spacing({s: 1}, {margin: ['right']})} flex flex--v-center`}>
                <Icon name='statusIndicator' extraClasses={'icon--red icon--match-text'} />
              </span>
              Fully booked
              {hasNotFullyBookedTimes && ', more dates available'}
            </div>
        }

        {isPast &&
            <div className={`${font({s: 'HNM5'})} flex flex--v-center margin-top-auto`}>
              <span className={`${spacing({s: 1}, {margin: ['right']})} flex flex--v-center`}>
                <Icon name='statusIndicator' extraClasses={'icon--red icon--match-text'} />
              </span>
              Past event
            </div>
        }

        {eventbriteId && !isFullyBooked && !isPast &&
            <div
              data-eventbrite-ticket-id={eventbriteId}
              className='flex flex--h-space-between flex--wrap margin-top-auto js-eventbrite-ticket-status'></div>
        }
      </div>
    </a>
  );
};

export default EventPromo;
