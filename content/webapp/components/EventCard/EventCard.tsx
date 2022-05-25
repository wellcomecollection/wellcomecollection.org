import { FC } from 'react';
import { EventBasic } from '../../types/events';
import CompactCard from '../CompactCard/CompactCard';
import Image from '@weco/common/views/components/Image/Image';
import StatusIndicator from '@weco/common/views/components/StatusIndicator/StatusIndicator';
import EventDateRange from '../EventDateRange/EventDateRange';
import { classNames, font } from '@weco/common/utils/classnames';
import { getCrop } from '@weco/common/model/image';
import { dateFromDateOrString } from '@weco/common/utils/dates';

type Props = {
  event: EventBasic;
  xOfY: { x: number; y: number };
};

const EventCard: FC<Props> = ({ event, xOfY }) => {
  const eventTimes = event.times.map(time => ({
    ...time,
    range: {
      startDateTime: dateFromDateOrString(time.range.startDateTime),
      endDateTime: dateFromDateOrString(time.range.endDateTime),
    },
  }));
  const eventWithDates = {
    ...event,
    times: eventTimes,
  };
  const DateRangeComponent = <EventDateRange event={eventWithDates} />;

  const squareImage = getCrop(eventWithDates.image, 'square');
  const ImageComponent = squareImage && <Image {...squareImage} />;

  const firstTime = eventWithDates.times[0];
  const lastTime = eventWithDates.times[eventWithDates.times.length - 1];
  const StatusIndicatorComponent = eventWithDates.isPast ? (
    <StatusIndicator
      start={firstTime.range.startDateTime}
      end={lastTime.range.endDateTime}
    />
  ) : undefined;

  return (
    <CompactCard
      url={`/events/${eventWithDates.id}`}
      title={eventWithDates.title}
      primaryLabels={eventWithDates.primaryLabels}
      secondaryLabels={eventWithDates.secondaryLabels}
      urlOverride={eventWithDates.promo && eventWithDates.promo.link}
      Image={ImageComponent}
      DateInfo={DateRangeComponent}
      StatusIndicator={StatusIndicatorComponent}
      ExtraInfo={
        !eventWithDates.isPast &&
        eventWithDates.times.length > 1 && (
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
