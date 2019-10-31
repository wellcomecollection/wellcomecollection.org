// @flow
import { useState, useEffect } from 'react';
import { trackRelevanceRating } from '../Tracker/Tracker';
import Rating from '@weco/common/views/components/Rating/Rating';

type Props = {|
  position: number,
  id: string,
  query: string,
  page: number,
  workType: ?(string[]),
  _queryType: ?string,
|};

const ratings = [
  { value: 1, text: 'Not relevant to my search' },
  { value: 2, text: 'A bit relevant' },
  { value: 3, text: 'Relevant' },
  { value: 4, text: 'Highly relevant' },
];
const RelevanceRater = ({
  id,
  position,
  query,
  page,
  workType,
  _queryType,
}: Props) => {
  const [showRatings, setShowRatings] = useState(false);
  useEffect(() => {
    setShowRatings(true);
  }, []);
  return (
    showRatings && (
      <Rating
        ratings={ratings}
        clickHandler={value => {
          trackRelevanceRating({
            id,
            position,
            rating: value,
            query,
            page,
            workType,
            _queryType,
          });
        }}
      />
    )
  );
};

export default RelevanceRater;
