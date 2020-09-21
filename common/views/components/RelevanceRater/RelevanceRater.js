// @flow
import { useState, useEffect } from 'react';
import { type CatalogueWorksApiProps } from '../../../services/catalogue/api';
import { trackRelevanceRating } from '../Tracker/Tracker';
import Rating from '../Rating/Rating';

type Props = {|
  position: number,
  id: string,
  query: string,
  page: ?number,
  workType: ?(string[]),
  apiProps: CatalogueWorksApiProps,
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
  apiProps,
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
          trackRelevanceRating(apiProps, { ...trackingObject, rating: value });
          storeRating(JSON.stringify(trackingObject), value);
        }}
      />
    )
  );
};

export default RelevanceRater;
