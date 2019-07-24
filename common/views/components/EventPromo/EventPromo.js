// @flow
import { spacing, font, classNames } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';
import { UiImage } from '../Images/Images';
import LabelsList from '../LabelsList/LabelsList';
import Icon from '../Icon/Icon';
import EventDateRange from '../EventDateRange/EventDateRange';
import { type UiEvent, isEventFullyBooked } from '../../../model/events';
import Moment from 'moment';
import VerticalSpace from '../styled/VerticalSpace';

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

      <VerticalSpace
        size="m"
        properties={['padding-top', 'padding-bottom']}
        className={classNames({
          'flex flex--column flex-1 flex--h-space-between': true,
          [spacing({ s: 2 }, { padding: ['left', 'right'] })]: true,
        })}
      >
        <div>
          <VerticalSpace
            size="s"
            as="h2"
            className={classNames({
              'promo-link__title': true,
              [font('wb', 3)]: true,
            })}
          >
            {event.title}
          </VerticalSpace>

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
            <div className={`${font('hnl', 5)} flex flex--v-center`}>
              <span
                className={`${spacing(
                  { s: 1 },
                  { margin: ['right'] }
                )} flex flex--v-center`}
              >
                <Icon
                  name="statusIndicator"
                  extraClasses={'icon--red icon--match-text'}
                />
              </span>
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
              <span
                className={`${spacing(
                  { s: 1 },
                  { margin: ['right'] }
                )} flex flex--v-center`}
              >
                <Icon
                  name="statusIndicator"
                  extraClasses={'icon--marble icon--match-text'}
                />
              </span>
              Past
            </div>
          )}
        </div>

        {event.series.length > 0 && (
          <VerticalSpace size="l" properties={['margin-top']}>
            {event.series.map(series => (
              <p key={series.title} className={`${font('hnm', 6)} no-margin`}>
                <span className={font('hnl', 6)}>Part of</span> {series.title}
              </p>
            ))}
          </VerticalSpace>
        )}
      </VerticalSpace>
    </a>
  );
};

export default EventPromo;
