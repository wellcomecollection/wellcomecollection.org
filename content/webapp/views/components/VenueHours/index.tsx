import { FunctionComponent } from 'react';

import { getCrop } from '@weco/common/model/image';
import { OverrideDate, Venue } from '@weco/common/model/opening-hours';
import { usePrismicData } from '@weco/common/server-data/Context';
import {
  completeDateRangeForExceptionalPeriods,
  createExceptionalOpeningHoursDays,
  getOverrideDatesForAllVenues,
  getOverrideDatesForSpecificVenue,
  getUpcomingExceptionalOpeningHours,
  groupOverrideDates,
} from '@weco/common/services/prismic/opening-times';
import { transformCollectionVenues } from '@weco/common/services/prismic/transformers/collection-venues';
import { font } from '@weco/common/utils/classnames';
import Divider from '@weco/common/views/components/Divider';
import PrismicImage from '@weco/common/views/components/PrismicImage';
import Space from '@weco/common/views/components/styled/Space';
import MoreLink from '@weco/content/views/components/MoreLink';

import VenueHoursJauntyBox from './VenueHours.JauntyBox';
import {
  DayOfWeek,
  OpeningHours,
  VenueHoursImage,
  VenueHoursTimes,
} from './VenueHours.styles';

type Props = {
  venue: Venue;
};

const VenueHours: FunctionComponent<Props> = ({ venue }) => {
  const { collectionVenues } = usePrismicData();
  const venues = transformCollectionVenues(collectionVenues);

  const getExceptionalHours = (overrideDates: OverrideDate[]) => {
    const exceptionalPeriods = groupOverrideDates(overrideDates);
    const completeExceptionalPeriods =
      completeDateRangeForExceptionalPeriods(exceptionalPeriods);
    const exceptionalOpeningHours = createExceptionalOpeningHoursDays(
      venue,
      completeExceptionalPeriods
    );

    return (
      exceptionalOpeningHours &&
      getUpcomingExceptionalOpeningHours(exceptionalOpeningHours)
    );
  };

  const upcomingExceptionalOpeningHours = {
    grouped: getExceptionalHours(getOverrideDatesForAllVenues(venues)),
    venueSpecific: getExceptionalHours(getOverrideDatesForSpecificVenue(venue)),
  };

  const isFeatured = venue.isFeatured;

  return (
    <div data-component="venue-hours">
      {isFeatured && (
        <>
          <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
            <span className="is-hidden-s">
              <Divider />
            </span>
          </Space>
          <VenueHoursImage $v={{ size: 'm', properties: ['margin-bottom'] }}>
            {venue.image?.contentUrl && (
              <PrismicImage
                image={{
                  contentUrl: getCrop(venue.image, '16:9')?.contentUrl || '',
                  width: 1600,
                  height: 900,
                  alt: venue.image?.alt,
                }}
                sizes={{
                  xlarge: 1 / 6,
                  large: 1 / 6,
                  medium: 1 / 2,
                  small: 1,
                }}
                quality="low"
              />
            )}
          </VenueHoursImage>
        </>
      )}

      <VenueHoursTimes $v={{ size: 'm', properties: ['margin-bottom'] }}>
        <Space
          as="h2"
          className={font('wb', 3)}
          $h={{ size: 'm', properties: ['padding-right'] }}
        >
          {isFeatured ? venue.name : 'Opening hours'}
        </Space>
        <OpeningHours>
          {venue.openingHours.regular.map(
            ({ dayOfWeek, opens, closes, isClosed }) => (
              <li key={dayOfWeek}>
                <DayOfWeek>{dayOfWeek}</DayOfWeek>{' '}
                {isClosed ? 'Closed' : `${opens} – ${closes}`}
              </li>
            )
          )}
        </OpeningHours>
      </VenueHoursTimes>

      {upcomingExceptionalOpeningHours.grouped.map(
        upcomingGroupedExceptionalPeriod => (
          <VenueHoursJauntyBox
            key={upcomingGroupedExceptionalPeriod[0].overrideDate.toString()}
            upcomingExceptionalPeriod={upcomingGroupedExceptionalPeriod}
            venue={venue}
          />
        )
      )}

      {upcomingExceptionalOpeningHours.venueSpecific.map(
        upcomingVenueExceptionalPeriod => (
          <VenueHoursJauntyBox
            key={upcomingVenueExceptionalPeriod[0].overrideDate.toString()}
            upcomingExceptionalPeriod={upcomingVenueExceptionalPeriod}
            venue={venue}
          />
        )
      )}

      <Space
        $v={{ size: 's', properties: ['margin-top'] }}
        style={{ clear: 'both' }}
      >
        {isFeatured && venue.linkText && venue.url && (
          <MoreLink url={venue.url} name={venue.linkText} />
        )}
      </Space>
    </div>
  );
};

export default VenueHours;
