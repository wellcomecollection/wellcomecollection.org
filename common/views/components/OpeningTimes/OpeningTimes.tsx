import { getTodaysVenueHours } from '../../../services/prismic/opening-times';
import Space from '../styled/Space';
import { Venue } from '../../../model/opening-hours';
import { getNameFromCollectionVenue } from '@weco/common/data/hardcoded-ids';
import { FunctionComponent } from 'react';
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

// This is chosen to be wider than any of the venue names, but not so wide as
// to leave lots of space between the name and the opening hours.
//
// The exact value is somewhat arbitrary, based on what looked okay locally.
const VenueName = styled.div`
  display: inline-block;
  width: 90px;
`;

const OpeningTimes: FunctionComponent<Props> = ({ venues }) => (
  <OpeningTimesList>
    {venues.map(venue => {
      const todaysHours = getTodaysVenueHours(venue);
      return (
        todaysHours && (
          <Space
            v={{
              size: 'xs',
              properties: ['margin-top'],
            }}
            as="li"
            key={venue.id}
          >
            <VenueName>{getNameFromCollectionVenue(venue.id)}</VenueName>
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
