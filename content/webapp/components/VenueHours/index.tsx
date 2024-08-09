import { FunctionComponent } from 'react';
import { font } from '@weco/common/utils/classnames';
import MoreLink from '@weco/content/components/MoreLink/MoreLink';
import Divider from '@weco/common/views/components/Divider/Divider';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import { getCrop } from '@weco/common/model/image';
import {
  createExceptionalOpeningHoursDays,
  getUpcomingExceptionalOpeningHours,
  getOverrideDatesForAllVenues,
  groupOverrideDates,
  completeDateRangeForExceptionalPeriods,
} from '@weco/common/services/prismic/opening-times';
import { transformCollectionVenues } from '@weco/common/services/prismic/transformers/collection-venues';
import Space from '@weco/common/views/components/styled/Space';
import { usePrismicData } from '@weco/common/server-data/Context';
import { OverrideDate, Venue } from '@weco/common/model/opening-hours';
import {
  DayOfWeek,
  OpeningHours,
  VenueHoursImage,
  VenueHoursTimes,
} from './VenueHours.styles';
import VenueHoursJauntyBox from './VenueHours.JauntyBox';

type Props = {
  venue: Venue;
};

const VenueHours: FunctionComponent<Props> = ({ venue }) => {
  const { collectionVenues } = usePrismicData();
  const venues = transformCollectionVenues(collectionVenues);

  // TODO, this should be done at a higher level since it's the same for all venues
  // But there is no real higher level...
  // I'd love to only run this one per page load, how?
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

  // This filters out dates of type "other" as they are specific to their venue
  const upcomingGroupedExceptionalOpeningHours = getExceptionalHours(
    getOverrideDatesForAllVenues(venues)
  );

  // This takes care of "other" exceptional hours
  const upcomingVenueExceptionalOpeningHours = getExceptionalHours(
    venue.openingHours.exceptional.filter(e => e.overrideType === 'other')
  );

  const isFeatured = venue.isFeatured;

  return (
    <>
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

      {upcomingGroupedExceptionalOpeningHours.map(
        upcomingGroupedExceptionalPeriod => (
          <VenueHoursJauntyBox
            key={upcomingGroupedExceptionalPeriod[0].overrideDate.toString()}
            upcomingExceptionalPeriod={upcomingGroupedExceptionalPeriod}
            venue={venue}
          />
        )
      )}

      {upcomingVenueExceptionalOpeningHours.map(
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
    </>
  );
};

export default VenueHours;
