// @flow
import { useState, useEffect } from 'react';
import { type TrackWorksParams } from '../../../services/catalogue/url-params';
import { trackRelevanceRating } from '../Tracker/Tracker';
import Rating from '../Rating/Rating';

type Props = {|
  position: number,
  id: string,
  query: string,
  page: ?number,
  workType: ?(string[]),
  trackParams: TrackWorksParams,
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
  trackParams,
}: Props) => {
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [currentlyRatedValue, setCurrentlyRatedValue] = useState(0);
  const trackingObject = {
    id,
    position,
    query,
    page: page || 1,
    workType,
  };
  useEffect(() => {
    setIsEnhanced(true);
  }, [trackingObject]);
  useEffect(() => {
    setCurrentlyRatedValue(getRating(JSON.stringify(trackingObject)));
  }, [trackingObject]);
  return (
    isEnhanced && (
      <Rating
        currentlyRatedValue={currentlyRatedValue}
        clickHandler={value => {
          trackRelevanceRating(trackParams, {
            ...trackingObject,
            rating: value,
          });
          storeRating(JSON.stringify(trackingObject), value);
        }}
      />
    )
  );
};

export default RelevanceRater;
