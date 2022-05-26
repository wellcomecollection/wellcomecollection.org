import { FC } from 'react';
import { EventBasic } from '../../types/events';
import CompactCard from '../CompactCard/CompactCard';
import Image from '@weco/common/views/components/Image/Image';
import StatusIndicator from '@weco/common/views/components/StatusIndicator/StatusIndicator';
import EventDateRange from '../EventDateRange/EventDateRange';
import { classNames, font } from '@weco/common/utils/classnames';
import { getCrop } from '@weco/common/model/image';
import { fixEventDatesInJson } from '../../services/prismic/transformers/events';

type Props = {
  event: EventBasic;
  xOfY: { x: number; y: number };
};

const EventCard: FC<Props> = ({ event: jsonEvent, xOfY }) => {
  const event = fixEventDatesInJson(jsonEvent);
  const DateRangeComponent = <EventDateRange event={eventWithDates} />;

  const squareImage = getCrop(event.image, 'square');
  const ImageComponent = squareImage && <Image {...squareImage} />;

  const firstTime = event.times[0];
  const lastTime = event.times[event.times.length - 1];
  const StatusIndicatorComponent = event.isPast ? (
    <StatusIndicator
      start={firstTime.range.startDateTime}
      end={lastTime.range.endDateTime}
    />
  ) : undefined;

  return (
    <CompactCard
      url={`/events/${event.id}`}
      title={event.title}
      primaryLabels={event.primaryLabels}
      secondaryLabels={event.secondaryLabels}
      urlOverride={event.promo && event.promo.link}
      Image={ImageComponent}
      DateInfo={DateRangeComponent}
      StatusIndicator={StatusIndicatorComponent}
      ExtraInfo={
        !event.isPast &&
        event.times.length > 1 && (
          <p
            className={classNames({
              [font('hnb', 4)]: true,
              'no-margin': true,
            })}
          >
            See all dates/times
          </p>
        )
      }
      xOfY={xOfY}
    />
  );
};

export default EventCard;
