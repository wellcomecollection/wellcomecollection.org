import moment from 'moment';
import { font, classNames } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';
import Dot from '@weco/common/views/components/Dot/Dot';
import EventDateRange from '@weco/common/views/components/EventDateRange/EventDateRange';
import { UiEvent, isEventFullyBooked } from '@weco/common/model/events';
import Space from '@weco/common/views/components/styled/Space';
import {
  CardOuter,
  CardBody,
  CardPostBody,
} from '@weco/common/views/components/Card/Card';
import Divider from '@weco/common/views/components/Divider/Divider';
import WatchLabel from '@weco/common/views/components/WatchLabel/WatchLabel';
import PrismicImage from '../PrismicImage/PrismicImage';

type Props = {
  event: UiEvent;
  position?: number;
  dateString?: string;
  timeString?: string;
  fromDate?: moment.Moment;
};

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
    <CardOuter
      data-component="EventPromo"
      data-component-state={JSON.stringify({ position: position })}
      href={(event.promo && event.promo.link) || `/events/${event.id}`}
      onClick={() => {
        trackEvent({
          category: 'EventPromo',
          action: 'follow link',
          label: `${event.id} | position: ${position}`,
        });
      }}
    >
      <div className="relative">
        {event.promoImage && (
          <PrismicImage
            image={{
              url: event.promoImage.contentUrl,
              dimensions: {
                width: event.promoImage.width,
                height: event.promoImage.height || 0,
              },
              alt: event.promoImage.alt,
              copyright: '',
            }}
            sizes={{
              xlarge: 1 / 3,
              large: 1 / 3,
              medium: 1 / 2,
              small: 1,
            }}
          />
        )}

        {event.primaryLabels.length > 0 && (
          <div style={{ position: 'absolute', bottom: 0 }}>
            <LabelsList labels={event.primaryLabels} />
          </div>
        )}
      </div>

      <CardBody>
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

          {event.isOnline && !event.availableOnline && (
            <LabelsList
              labels={[{ text: 'Online', labelColor: 'transparent' }]}
            />
          )}

          {event.availableOnline && (
            <Space v={{ size: 's', properties: ['margin-top'] }}>
              <WatchLabel text={`Available to watch`} />
            </Space>
          )}

          {!isPast && (
            <p className={`${font('hnr', 5)} no-padding no-margin`}>
              <EventDateRange
                event={event}
                splitTime={true}
                fromDate={fromDate}
              />
            </p>
          )}

          {!isPast && dateString && (
            <p className={`${font('hnr', 5)} no-padding no-margin`}>
              {dateString}
            </p>
          )}

          {!isPast && timeString && (
            <p className={`${font('hnr', 5)} no-padding no-margin`}>
              {timeString}
            </p>
          )}

          {!isPast && fullyBooked && (
            <Space
              v={{ size: 'm', properties: ['margin-top'] }}
              className={`${font('hnr', 5)} flex flex--v-center`}
            >
              <Space
                as="span"
                h={{ size: 'xs', properties: ['margin-right'] }}
                className={`flex flex--v-center`}
              >
                <Dot color={'red'} />
              </Space>
              Fully booked
            </Space>
          )}
          {!isPast && event.scheduleLength > 0 && (
            <p className={`${font('hnb', 5)} no-padding no-margin`}>
              {`${event.scheduleLength} ${
                event.scheduleLength > 1 ? 'events' : 'event'
              }`}
            </p>
          )}

          {!isPast && event.times.length > 1 && (
            <p className={`${font('hnb', 6)}`}>See all dates/times</p>
          )}

          {isPast && !event.availableOnline && (
            <div className={`${font('hnr', 5)} flex flex--v-center`}>
              <Space
                as="span"
                h={{ size: 'xs', properties: ['margin-right'] }}
                className={`flex flex--v-center`}
              >
                <Dot color={'marble'} />
              </Space>
              Past
            </div>
          )}
        </div>
      </CardBody>
      {event.series.length > 0 && (
        <CardPostBody>
          {event.series.map(series => (
            <p key={series.title} className={`${font('hnb', 6)} no-margin`}>
              <span className={font('hnr', 6)}>Part of</span> {series.title}
            </p>
          ))}
        </CardPostBody>
      )}
      {event.secondaryLabels.length > 0 && (
        <Space
          h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
          v={{ size: 'm', properties: ['padding-bottom'] }}
        >
          <Divider color={`white`} isKeyline={true} />
          <Space v={{ size: 's', properties: ['padding-top'] }}>
            <LabelsList
              labels={event.secondaryLabels}
              defaultLabelColor="black"
            />
          </Space>
        </Space>
      )}
    </CardOuter>
  );
};

export default EventPromo;
