import { FunctionComponent } from 'react';

import { getCrop } from '@weco/common/model/image';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { font } from '@weco/common/utils/classnames';
import PrismicImage from '@weco/common/views/components/PrismicImage';
import Space from '@weco/common/views/components/styled/Space';
import CompactCard from '@weco/content/components/CompactCard';
import EventDateRange from '@weco/content/components/EventDateRange';
import StatusIndicator from '@weco/content/components/StatusIndicator';
import WatchLabel from '@weco/content/components/WatchLabel';
import { EventBasic } from '@weco/content/types/events';

type Props = {
  event: EventBasic;
  xOfY: { x: number; y: number };
};

const EventCard: FunctionComponent<Props> = ({ event, xOfY }) => {
  const DateRangeComponent = event.isPast ? undefined : (
    <EventDateRange eventTimes={event.times} />
  );

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
      quality="low"
    />
  );

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
        <Space $v={{ size: 'm', properties: ['margin-bottom'] }}>
          <Space $v={{ size: 's', properties: ['margin-top'] }}>
            <WatchLabel text="Available to watch" />
          </Space>
        </Space>
      </>
    ) : !event.isPast && event.times.length > 1 ? (
      <p className={font('intb', 4)} style={{ marginBottom: 0 }}>
        See all dates/times
      </p>
    ) : undefined;

  return (
    <CompactCard
      url={linkResolver(event)}
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
