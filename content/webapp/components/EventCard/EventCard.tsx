import { EventBasic } from '../../types/events';
import CompactCard from '../CompactCard/CompactCard';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import StatusIndicator from '@weco/common/views/components/StatusIndicator/StatusIndicator';
import EventDateRange from '../EventDateRange/EventDateRange';
import { classNames, font } from '@weco/common/utils/classnames';
import { getCrop } from '@weco/common/model/image';

type Props = {
  event: EventBasic;
  xOfY: { x: number; y: number };
};

const EventCard = ({ event, xOfY }: Props) => {
  const DateRangeComponent = <EventDateRange event={event} />;

  const squareImage = getCrop(event.image, 'square');
  const ImageComponent = squareImage && (
    <PrismicImage
      image={{
        // We intentionally omit the alt text on promos, so screen reader
        // users don't have to listen to the alt text before hearing the
        // title of the item in the list.
        //
        // See https://github.com/wellcomecollection/wellcomecollection.org/issues/6007
        ...squareImage,
        alt: '',
      }}
      sizes={{
        xlarge: 1 / 6,
        large: 1 / 6,
        medium: 1 / 5,
        small: 1 / 4,
      }}
    />
  );

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
