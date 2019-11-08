// @flow
import { useState, useEffect } from 'react';
import { trackRelevanceRating } from '../Tracker/Tracker';
import Rating from '@weco/common/views/components/Rating/Rating';

type Props = {|
  position: number,
  id: string,
  query: string,
  page: ?number,
  workType: ?(string[]),
  _queryType: ?string,
|};

function storeRating(key, value) {
  window.localStorage.setItem(key, value.toString());
}

function getRating(key) {
  return window.localStorage.getItem(key)
    ? parseInt(window.localStorage.getItem(key))
    : 0;
}

const RelevanceRater = ({
  id,
  position,
  query,
  page,
  workType,
  _queryType,
}: Props) => {
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [currentlyRatedValue, setCurrentlyRatedValue] = useState(0);
  const trackingObject = {
    id,
    position,
    query,
    page: page || 1,
    workType,
    _queryType,
  };
  useEffect(() => {
    setIsEnhanced(true);
    setCurrentlyRatedValue(getRating(JSON.stringify(trackingObject)));
  }, []);
  return (
    isEnhanced && (
      <Rating
        currentlyRatedValue={currentlyRatedValue}
        clickHandler={value => {
          trackRelevanceRating({ ...trackingObject, rating: value });
          storeRating(JSON.stringify(trackingObject), value);
        }}
      />
    )
  );
};

export default RelevanceRater;
