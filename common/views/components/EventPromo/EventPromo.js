// @flow
import { font, classNames } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';
import { UiImage } from '../Images/Images';
import LabelsList from '../LabelsList/LabelsList';
import Icon from '../Icon/Icon';
import EventDateRange from '../EventDateRange/EventDateRange';
import { type UiEvent, isEventFullyBooked } from '../../../model/events';
import Moment from 'moment';
import Space from '../styled/Space';

type Props = {|
  event: UiEvent,
  position?: number,
  dateString?: string,
  timeString?: string,
  fromDate?: Moment,
|};

const EventPromo = ({
  event,
  position = 0,
  dateString,
  timeString,
  fromDate,
}: Props) => {
  const fullyBooked = isEventFullyBooked(event);
  const isPast = event.isPast;
  return (
    <a
      data-component="EventPromo"
      data-component-state={JSON.stringify({ position: position })}
      href={(event.promo && event.promo.link) || `/events/${event.id}`}
      className="plain-link promo-link bg-cream rounded-corners overflow-hidden flex-ie-block flex--column"
      onClick={() => {
        trackEvent({
          category: 'EventPromo',
          action: 'follow link',
          label: `${event.id} | position: ${position}`,
        });
      }}
    >
      <div className="relative">
        {/* FIXME: Image type tidy */}
        {event.promoImage && (
          // $FlowFixMe
          <UiImage
            {...event.promoImage}
            sizesQueries="(min-width: 1420px) 386px, (min-width: 960px) calc(28.64vw - 15px), (min-width: 600px) calc(50vw - 54px), calc(100vw - 36px)"
            showTasl={false}
          />
        )}

        {event.labels.length > 0 && (
          <div style={{ position: 'absolute', bottom: 0 }}>
            <LabelsList labels={event.labels} />
          </div>
        )}
      </div>

      <Space
        v={{
          size: 'm',
          properties: ['padding-top', 'padding-bottom'],
        }}
        h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
        className={classNames({
          'flex flex--column flex-1 flex--h-space-between': true,
        })}
      >
        <div>
          <Space
            v={{
              size: 's',
              properties: ['margin-bottom'],
            }}
            as="h2"
            className={classNames({
              'promo-link__title': true,
              [font('wb', 3)]: true,
            })}
          >
            {event.title}
          </Space>

          {!isPast && (
            <p className={`${font('hnl', 5)} no-padding no-margin`}>
              <EventDateRange
                event={event}
                splitTime={true}
                fromDate={fromDate}
              />
            </p>
          )}

          {!isPast && dateString && (
            <p className={`${font('hnl', 5)} no-padding no-margin`}>
              {dateString}
            </p>
          )}

          {!isPast && timeString && (
            <p className={`${font('hnl', 5)} no-padding no-margin`}>
              {timeString}
            </p>
          )}

          {!isPast && fullyBooked && (
            <div className={`${font('hnl', 6)} flex flex--v-center`}>
              <Space
                as="span"
                h={{ size: 's', properties: ['margin-right'] }}
                className={`flex flex--v-center`}
              >
                <Icon
                  name="statusIndicator"
                  extraClasses={'icon--red icon--match-text'}
                />
              </Space>
              Fully booked
            </div>
          )}
          {!isPast && event.scheduleLength > 0 && (
            <p className={`${font('hnm', 5)} no-padding no-margin`}>
              {`${event.scheduleLength} ${
                event.scheduleLength > 1 ? 'events' : 'event'
              }`}
            </p>
          )}

          {!isPast && event.times.length > 1 && (
            <p className={`${font('hnm', 6)}`}>See all dates/times</p>
          )}

          {isPast && (
            <div className={`${font('hnl', 5)} flex flex--v-center`}>
              <Space
                as="span"
                h={{ size: 's', properties: ['margin-right'] }}
                className={`flex flex--v-center`}
              >
                <Icon
                  name="statusIndicator"
                  extraClasses={'icon--marble icon--match-text'}
                />
              </Space>
              Past
            </div>
          )}
        </div>

        {event.series.length > 0 && (
          <Space v={{ size: 'l', properties: ['margin-top'] }}>
            {event.series.map(series => (
              <p key={series.title} className={`${font('hnm', 6)} no-margin`}>
                <span className={font('hnl', 6)}>Part of</span> {series.title}
              </p>
            ))}
          </Space>
        )}
      </Space>
    </a>
  );
};

export default EventPromo;
