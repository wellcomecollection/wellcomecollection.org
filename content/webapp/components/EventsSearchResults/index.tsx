import { FunctionComponent } from 'react';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';
import { font } from '@weco/common/utils/classnames';
import PrismicImage, {
  BreakpointSizes,
} from '@weco/common/views/components/PrismicImage/PrismicImage';
import { getCrop } from '@weco/common/model/image';
import { EventDocument } from '@weco/content/services/wellcome/content/types/api';

import linkResolver from '@weco/common/services/prismic/link-resolver';
import { transformImage } from '@weco/common/services/prismic/transformers/images';
import {
  DesktopLabel,
  Details,
  EventInformation,
  EventWrapper,
  EventsContainer,
  ImageWrapper,
  LocationWrapper,
  MobileLabel,
} from './EventsSearchResults.styles';
import Space from '@weco/common/views/components/styled/Space';
import WatchLabel from '@weco/content/components/WatchLabel/WatchLabel';
import EventDateRange from '@weco/content/components/EventDateRange';
import {
  getLastEndTime,
  transformEventTimes,
} from '@weco/content/services/prismic/transformers/events';
import StatusIndicator from '@weco/content/components/StatusIndicator/StatusIndicator';
import { isPast as checkIfIsPast } from '@weco/common/utils/dates';
import Icon from '@weco/common/views/components/Icon/Icon';
import { getLocationText } from 'components/EventPromo/EventPromo';
import { location } from '@weco/common/icons';
import { PlaceBasic } from '@weco/content/types/places';
import { isNotUndefined } from '@weco/common/utils/type-guards';

type Props = {
  events: EventDocument[];
  dynamicImageSizes?: BreakpointSizes;
  isDetailed?: boolean;
};

const EventsSearchResults: FunctionComponent<Props> = ({
  events,
  dynamicImageSizes,
  isDetailed,
}: Props) => {
  // Past events that are available online don't have a status indicator
  // as they display online availability information.
  return (
    <EventsContainer $isDetailed={isDetailed}>
      {events.map(event => {
        const image = transformImage(event.image);
        const croppedImage = getCrop(image, isDetailed ? '16:9' : '32:15');

        const times = transformEventTimes(event.id, event.times);

        const lastEndTime = getLastEndTime(times);
        const isPast = lastEndTime ? checkIfIsPast(lastEndTime) : true;

        const isOnline = Boolean(
          event.locations.find(l => l.label === 'Online')
        );

        const locations: PlaceBasic[] = event.locations
          .map(l => {
            return l.label ? { title: l.label } : undefined;
          })
          .filter(t => isNotUndefined(t)) as PlaceBasic[];

        return (
          <EventWrapper
            key={event.id}
            as="a"
            href={linkResolver({ id: event.id, type: 'events' })}
            $isDetailed={isDetailed}
          >
            {croppedImage && (
              <ImageWrapper $isDetailed={isDetailed}>
                <PrismicImage
                  image={{
                    // We intentionally omit the alt text on promos, so screen reader
                    // users don't have to listen to the alt text before hearing the
                    // title of the item in the list.
                    //
                    // See https://github.com/wellcomecollection/wellcomecollection.org/issues/6007
                    ...croppedImage,
                    alt: '',
                  }}
                  sizes={dynamicImageSizes}
                  quality="low"
                />
                <MobileLabel $isDetailed={isDetailed}>
                  <LabelsList labels={[{ text: event.format.label }]} />
                </MobileLabel>
              </ImageWrapper>
            )}
            <Details $isDetailed={isDetailed}>
              {isDetailed && (
                <DesktopLabel>
                  <LabelsList labels={[{ text: event.format.label }]} />
                </DesktopLabel>
              )}

              <h3 className={font('wb', 4)}>{event.title}</h3>

              <EventInformation>
                {isPast && !event.isAvailableOnline && (
                  <StatusIndicator
                    start={times[0].range.startDateTime}
                    end={times[times.length - 1].range.endDateTime}
                  />
                )}

                {(isOnline || event.locations.length > 0) && (
                  <LocationWrapper>
                    <Icon icon={location} matchText />
                    <Space $h={{ size: 'xs', properties: ['margin-left'] }}>
                      {getLocationText(isOnline, locations)}
                    </Space>
                  </LocationWrapper>
                )}

                <EventDateRange eventTimes={times} />

                {isPast && event.isAvailableOnline ? (
                  <Space $v={{ size: 'm', properties: ['margin-bottom'] }}>
                    <Space $v={{ size: 's', properties: ['margin-top'] }}>
                      <WatchLabel text="Available to watch" />
                    </Space>
                  </Space>
                ) : (
                  !isPast &&
                  times.length > 1 && (
                    <p className={font('intb', 4)} style={{ marginBottom: 0 }}>
                      See all dates/times
                    </p>
                  )
                )}
              </EventInformation>
            </Details>
          </EventWrapper>
        );
      })}
    </EventsContainer>
  );
};

export default EventsSearchResults;
