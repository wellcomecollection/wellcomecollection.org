import { getTodaysVenueHours } from '../../../services/prismic/opening-times';
import Space from '../styled/Space';
import { Venue } from '../../../model/opening-hours';
import {
  collectionVenueId,
  getNameFromCollectionVenue,
} from '@weco/common/data/hardcoded-ids';
import { FunctionComponent, ReactElement } from 'react';

type Props = {
  venues: Venue[];
};

const OpeningTimes: FunctionComponent<Props> = ({
  venues,
}: Props): ReactElement<Props> => {
  return (
    <ul className="plain-list no-padding no-margin">
      {venues.map(venue => {
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
              {todaysHours.isClosed ? (
                'closed'
              ) : (
                <>
                  <time>{todaysHours.opens}</time>
                  {' – '}
                  <time>{todaysHours.closes}</time>
                </>
              )}
            </Space>
          )
        );
      })}
    </ul>
  );
};
export default OpeningTimes;
