import { getTodaysVenueHours } from '@weco/common/services/prismic/opening-times';
import Space from '../styled/Space';
import { CollectionOpeningTimes } from '@weco/common/model/opening-hours';
import {
  collectionVenueId,
  getNameFromCollectionVenue,
} from '@weco/common/services/prismic/hardcoded-id';

type Props = {
  collectionOpeningTimes: CollectionOpeningTimes;
};

const FooterOpeningTimes = ({ collectionOpeningTimes }: Props): JSX.Element => {
  return (
    <ul className="plain-list no-padding no-margin">
      {collectionOpeningTimes.placesOpeningHours.map(venue => {
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
