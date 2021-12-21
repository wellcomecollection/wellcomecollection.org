import { getTodaysVenueHours } from '../../../services/prismic/opening-times';
import Space from '../styled/Space';
import { OpeningTimes } from '../../../model/opening-hours';
import {
  collectionVenueId,
  getNameFromCollectionVenue,
} from '@weco/common/services/prismic/hardcoded-id';
import { FunctionComponent, ReactElement } from 'react';

type Props = {
  openingTimes: OpeningTimes;
};

const FooterOpeningTimes: FunctionComponent<Props> = ({
  openingTimes,
}: Props): ReactElement<Props> => {
  return (
    <ul className="plain-list no-padding no-margin">
      {openingTimes.placesOpeningHours.map(venue => {
        // TODO placesOpeningHours should be Venues
        // TODO need exceptional time to override regular times if there are any
        const todaysHours = getTodaysVenueHours(venue);
        return (
          todaysHours && (
            <Space
              v={{
                size: 's',
                properties: ['margin-top'],
              }}
              as="li"
              key={venue.id}
            >
              {venue.id === collectionVenueId.restaurant.id
                ? 'Kitchen '
                : `${getNameFromCollectionVenue(venue.id)} `}
              {todaysHours.opens ? (
                <>
                  <time>{todaysHours.opens}</time>
                  {'—'}
                  <time>{todaysHours.closes}</time>
                </>
              ) : (
                'closed'
              )}
            </Space>
          )
        );
      })}
    </ul>
  );
};
export default FooterOpeningTimes;
