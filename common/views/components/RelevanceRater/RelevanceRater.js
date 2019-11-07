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

const RelevanceRater = ({
  id,
  position,
  query,
  page,
  workType,
  _queryType,
}: Props) => {
  const [isEnhanced, setIsEnhanced] = useState(false);
  useEffect(() => {
    setIsEnhanced(true);
  }, []);
  return (
    isEnhanced && (
      <Rating
        clickHandler={value => {
          trackRelevanceRating({
            id,
            position,
            rating: value,
            query,
            page: page || 1,
            workType,
            _queryType,
          });
        }}
      />
    )
  );
};

export default RelevanceRater;
