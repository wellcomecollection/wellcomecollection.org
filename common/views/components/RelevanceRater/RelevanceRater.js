// @flow
import { useState, useEffect } from 'react';
import {
  trackRelevanceRating,
  RelevanceRatingEventNames,
} from '../Tracker/Tracker';
import Rating from '../Rating/Rating';

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

function createEvent(rating) {
  return {
    event: RelevanceRatingEventNames.RateResultRelevance,
    data: rating,
  };
}

const RelevanceRater = ({
  id,
  position,
  query,
  page,
  workType,
  _queryType,
}: Props) => {
  const [addRatings, setAddRatings] = useState(false);
  useEffect(() => {
    setAddRatings(true);
  }, []);
  return (
    addRatings && (
      <Rating
        ratings={ratings}
        clickHandler={value => {
          trackRelevanceRating(
            createEvent({
              id,
              position,
              rating: value,
              query,
              page,
              workType,
              _queryType,
            })
          );
        }}
      />
    )
  );
};

export default RelevanceRater;
