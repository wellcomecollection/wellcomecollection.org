// @flow
import {Fragment} from 'react';
import {spacing, font} from '../../../utils/classnames';
import {isDatePast, formatDayDate, formatTime} from '../../../utils/format-date';
import {UiImage} from '../Images/Images';
import LabelsList from '../LabelsList/LabelsList';
import Icon from '../Icon/Icon';
import StatusIndicator from '../StatusIndicator/StatusIndicator';
import type {EventPromo as EventPromoProps} from '../../../model/events';

type Props = {|
  ...EventPromoProps,
  position?: number,
|}

const EventPromo = ({
  id,
  title,
  url,
  start,
  end,
  isMultiDate,
  isFullyBooked,
  hasNotFullyBookedTimes,
  format,
  image,
  interpretations,
  eventbriteId,
  dateString,
  timeString,
  audience,
  schedule,
  series,
  position = 0
}: Props) => {
  const isPast = end && isDatePast(end);
  const eventInterpretations = interpretations && interpretations.map(interpretation => {
    return {
      url: null,
      text: interpretation.interpretationType.title
    };
  });
  const labels = [
    (format && {url: null, text: format.title}),
    (audience && {url: null, text: audience.title}),
    ...eventInterpretations
  ].filter(Boolean);
  return (
    <a data-component='EventPromo'
      data-component-state={JSON.stringify({ position: position })}
      data-track-event={JSON.stringify({category: 'component', action: 'EventPromo:click', label: `id : ${id}, position : ${position}`})}
      id={id}
      href={url}
      className='plain-link promo-link bg-cream rounded-corners overflow-hidden flex flex--column'>
      <div className='relative'>
        {image && <UiImage {...image}
          sizesQueries='(min-width: 1420px) 386px, (min-width: 960px) calc(28.64vw - 15px), (min-width: 600px) calc(50vw - 54px), calc(100vw - 36px)'
          showTasl={false} />}

        {(labels.length > 0) &&
          <div style={{position: 'absolute', bottom: 0}}>
            <LabelsList labels={labels} />
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
            {title}
          </h2>

          {start && end && !isPast &&
            <Fragment>
              <p className={`${font({s: 'HNL4'})} no-padding no-margin`}>
                <time dateTime={start}>{formatDayDate(start)}</time>
              </p>
              <p className={`${font({s: 'HNL4'})} no-margin no-padding`}>
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
            <p className={`${font({s: 'HNL4'})} no-padding no-margin`}>
              {timeString}
            </p>
          }

          {isFullyBooked && !isPast &&
            <div className={`${font({s: 'HNL5'})} flex flex--v-center`}>
              <span className={`${spacing({s: 1}, {margin: ['right']})} flex flex--v-center`}>
                <Icon name='statusIndicator' extraClasses={'icon--red icon--match-text'} />
              </span>
              Fully booked
            </div>
          }

          {start && end && isPast &&
            <StatusIndicator start={start} end={end} />
          }

          {eventbriteId && !isFullyBooked && !isPast &&
            <div
              data-eventbrite-ticket-id={eventbriteId}
              className='flex flex--h-space-between flex--wrap js-eventbrite-ticket-status'></div>
          }

          {schedule.length > 0 && !isPast &&
            <p className={`${font({s: 'HNM5'})} no-padding no-margin`}>
              {`${schedule.length} ${schedule.length > 1 ? 'events' : 'event'}`}
            </p>
          }

          {isMultiDate && !isPast && <p className={`${font({s: 'HNM5'})}`}>See all dates/times</p>}
        </div>

        {series.length > 0 &&
          <div className={spacing({s: 4}, {margin: ['top']})}>
            {series.map((series) => (
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
