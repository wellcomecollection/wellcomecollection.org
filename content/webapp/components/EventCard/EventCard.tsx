import { FC } from 'react';
import { EventBasic } from '../../types/events';
import CompactCard from '../CompactCard/CompactCard';
import Image from '@weco/common/views/components/Image/Image';
import StatusIndicator from '@weco/common/views/components/StatusIndicator/StatusIndicator';
import EventDateRange from '../EventDateRange/EventDateRange';
import { classNames, font } from '@weco/common/utils/classnames';
import { getCrop } from '@weco/common/model/image';
import { fixEventDatesInJson } from '../../services/prismic/transformers/events';
import Space from '@weco/common/views/components/styled/Space';
import WatchLabel from '@weco/common/views/components/WatchLabel/WatchLabel';

type Props = {
  event: EventBasic;
  xOfY: { x: number; y: number };
};

const EventCard: FC<Props> = ({ event: jsonEvent, xOfY }) => {
  const event = fixEventDatesInJson(jsonEvent);
  const DateRangeComponent = event.isPast ? undefined : (
    <EventDateRange event={event} />
  );

  const squareImage = getCrop(event.image, 'square');
  const ImageComponent = squareImage && <Image {...squareImage} />;

  const firstTime = event.times[0];
  const lastTime = event.times[event.times.length - 1];

  // Past events that are available online don't have a status indicator…
  const StatusIndicatorComponent =
    event.isPast && !event.availableOnline ? (
      <StatusIndicator
        start={firstTime.range.startDateTime}
        end={lastTime.range.endDateTime}
      />
    ) : undefined;
  // …and they display online availability information.
  const ExtraInfo =
    event.isPast && event.availableOnline ? (
      <>
        <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
          <Space v={{ size: 's', properties: ['margin-top'] }}>
            <WatchLabel text={`Available to watch`} />
          </Space>
        </Space>
      </>
    ) : !event.isPast && event.times.length > 1 ? (
      <p
        className={classNames({
          [font('hnb', 4)]: true,
          'no-margin': true,
        })}
      >
        See all dates/times
      </p>
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
      ExtraInfo={ExtraInfo}
      xOfY={xOfY}
    />
  );
};

export default EventCard;
