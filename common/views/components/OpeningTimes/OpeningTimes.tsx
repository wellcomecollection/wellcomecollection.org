import { getTodaysVenueHours } from '../../../services/prismic/opening-times';
import Space from '../styled/Space';
import { Venue } from '../../../model/opening-hours';
import {
  collectionVenueId,
  getNameFromCollectionVenue,
} from '@weco/common/data/hardcoded-ids';
import { FC } from 'react';
import styled from 'styled-components';

type Props = {
  venues: Venue[];
};

const OpeningTimesList = styled.ul.attrs({
  'data-chromatic': 'ignore',
})`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const OpeningTimes: FC<Props> = ({ venues }) => (
  <OpeningTimesList>
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
  </OpeningTimesList>
);
export default OpeningTimes;
