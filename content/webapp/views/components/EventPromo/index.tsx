import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { inOurBuilding } from '@weco/common/data/microcopy';
import { location } from '@weco/common/icons';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { font } from '@weco/common/utils/classnames';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import Divider from '@weco/common/views/components/Divider';
import HTMLDateAndTime from '@weco/common/views/components/HTMLDateAndTime';
import Icon from '@weco/common/views/components/Icon';
import LabelsList from '@weco/common/views/components/LabelsList';
import PrismicImage from '@weco/common/views/components/PrismicImage';
import Space from '@weco/common/views/components/styled/Space';
import { upcomingDatesFullyBooked } from '@weco/content/services/prismic/events';
import { EventDocumentPlace } from '@weco/content/services/wellcome/content/types/api';
import { EventBasic } from '@weco/content/types/events';
import { PlaceBasic } from '@weco/content/types/places';
import {
  CardBody,
  CardImageWrapper,
  CardLabels,
  CardOuter,
  CardPostBody,
  CardTitle,
} from '@weco/content/views/components/Card';
import EventDateRange from '@weco/content/views/components/EventDateRange';
import TextWithDot from '@weco/content/views/components/TextWithDot';
import WatchLabel from '@weco/content/views/components/WatchLabel';

type Props = {
  event: EventBasic;
  position?: number;
  dateString?: string;
  timeString?: string;
  fromDate?: Date;
  isInPastListing?: boolean;
};

export function getLocationText(
  isOnline?: boolean,
  places?: PlaceBasic[] | EventDocumentPlace[]
): string | undefined {
  // Acceptance criteria from https://github.com/wellcomecollection/wellcomecollection.org/issues/7818
  // * If an event is only in venue, in a single location, we display the specific location (e.g. 'Reading Room')
  // * If an event is only in venue, in multiple locations, we display 'In our building'
  // * If an event is only online, we display 'Online'
  // * If an event is online and in venue, we display 'Online | In our building'
  // * If an event has a single Prismic location, 'Throughout our building', we display 'In our building'
  //   This is how the editorial team used to do multi-location events before we added proper support
  //   for multiple locations.
  if (!isOnline && isNotUndefined(places) && places.length === 1) {
    // Content API's EventDocumentPlace has a type, PlaceBasic doesn't.
    const firstEventLabel =
      'type' in places[0] ? places[0].label : places[0].title;

    return firstEventLabel === 'Throughout our building'
      ? inOurBuilding
      : firstEventLabel;
  }

  if (!isOnline && isNotUndefined(places) && places.length > 1) {
    return inOurBuilding;
  }

  return `Online${
    isNotUndefined(places) && places.length > 0 ? ` | ${inOurBuilding}` : ''
  }`;
}

const DateInfo = styled.p.attrs({
  className: font('intr', 5),
})`
  padding: 0;
  margin: 0;
`;

const LocationWrapper = styled(Space).attrs({
  className: font('intr', 5),
  $v: { size: 's', properties: ['margin-top', 'margin-bottom'] },
})`
  display: flex;
  align-items: center;
`;

const EventPromo: FunctionComponent<Props> = ({
  event,
  position = 0,
  dateString,
  timeString,
  fromDate,
  isInPastListing,
}) => {
  const isPast = isInPastListing || event.isPast;
  const locationText = getLocationText(event.isOnline, event.locations);
  const dateRanges = event.times.sort(
    (a, b) => Number(a.range.startDateTime) - Number(b.range.startDateTime)
  );

  return (
    <CardOuter
      data-component="event-promo"
      data-component-state={JSON.stringify({ position })}
      href={(event.promo && event.promo.link) || linkResolver(event)}
    >
      <CardImageWrapper>
        {event.promo?.image && (
          <PrismicImage
            // We intentionally omit the alt text on promos, so screen reader
            // users don't have to listen to the alt text before hearing the
            // title of the item in the list.
            image={{
              ...event.promo.image,
              alt: '',
            }}
            sizes={{
              xlarge: 1 / 4,
              large: 1 / 3,
              medium: 1 / 2,
              small: 1,
            }}
            quality="low"
          />
        )}

        {event.primaryLabels.length > 0 && (
          <CardLabels labels={event.primaryLabels} />
        )}
      </CardImageWrapper>

      <CardBody>
        <div>
          <CardTitle>{event.title}</CardTitle>
          {locationText && !isInPastListing && (
            <LocationWrapper>
              <Icon icon={location} matchText />
              <Space $h={{ size: 'xs', properties: ['margin-left'] }}>
                {locationText}
              </Space>
            </LocationWrapper>
          )}
          {event.availableOnline && (
            <Space $v={{ size: 's', properties: ['margin-top'] }}>
              <WatchLabel text="Available to watch" />
            </Space>
          )}
          {isPast && event.times.length > 1 && (
            <DateInfo>
              <HTMLDateAndTime
                variant="date"
                date={dateRanges[0].range.startDateTime}
              />{' '}
              -{' '}
              <HTMLDateAndTime
                variant="date"
                date={dateRanges[dateRanges.length - 1].range.endDateTime}
              />
            </DateInfo>
          )}

          {(!isPast || (isPast && event.times.length === 1)) && (
            <>
              <DateInfo>
                <EventDateRange
                  eventTimes={event.times}
                  splitTime={true}
                  fromDate={fromDate}
                />
              </DateInfo>
              {dateString && <DateInfo>{dateString}</DateInfo>}
              {timeString && <DateInfo>{timeString}</DateInfo>}
            </>
          )}
          {upcomingDatesFullyBooked(event.times) && (
            <Space $v={{ size: 'm', properties: ['margin-top'] }}>
              <TextWithDot
                className={font('intr', 5)}
                dotColor="validation.red"
                text="Fully booked"
              />
            </Space>
          )}
          {!isPast && event.times.length > 1 && (
            <p className={font('intb', 6)}>See all dates/times</p>
          )}
          {isPast && !event.availableOnline && !isInPastListing && (
            <div>
              <TextWithDot
                className={font('intr', 5)}
                dotColor="neutral.500"
                text="Past"
              />
            </div>
          )}
        </div>
      </CardBody>
      {event.series.length > 0 && (
        <CardPostBody>
          {event.series.map(series => (
            <p
              key={series.title}
              className={font('intb', 6)}
              style={{ marginBottom: 0 }}
            >
              <span className={font('intr', 6)}>Part of</span> {series.title}
            </p>
          ))}
        </CardPostBody>
      )}
      {event.secondaryLabels.length > 0 && (
        <Space
          $h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
          $v={{ size: 'm', properties: ['padding-bottom'] }}
        >
          <Divider lineColor="white" />
          <Space $v={{ size: 's', properties: ['padding-top'] }}>
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
