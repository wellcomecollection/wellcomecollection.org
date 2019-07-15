// @flow
import { type UiEvent } from '../../../model/events';
import CompactCard from '../CompactCard/CompactCard';
import Image from '../Image/Image';
import StatusIndicator from '../StatusIndicator/StatusIndicator';
import EventDateRange from '../EventDateRange/EventDateRange';
import { classNames, font } from '../../../utils/classnames';

type Props = {|
  event: UiEvent,
  xOfY: {| x: number, y: number |},
|};

const EventCard = ({ event, xOfY }: Props) => {
  const DateRangeComponent = <EventDateRange event={event} />;

  const ImageComponent = event.image &&
    event.image.crops &&
    event.image.crops.square && <Image {...event.image.crops.square} />;

  const firstTime = event.times[0];
  const lastTime = event.times[event.times.length - 1];
  const StatusIndicatorComponent = event.isPast ? (
    <StatusIndicator
      start={firstTime.range.startDateTime}
      end={lastTime.range.endDateTime}
    />
  ) : null;

  return (
    <CompactCard
      url={`/events/${event.id}`}
      title={event.title}
      partNumber={null}
      color={null}
      labels={{ labels: event.labels }}
      description={null}
      urlOverride={event.promo && event.promo.link}
      Image={ImageComponent}
      DateInfo={DateRangeComponent}
      StatusIndicator={StatusIndicatorComponent}
      ExtraInfo={
        !event.isPast &&
        event.times.length > 1 && (
          <p
            className={classNames({
              [font({ s: 'HNM5' })]: true,
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
