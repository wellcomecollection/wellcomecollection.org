// @flow
import styled from 'styled-components';
import { classNames } from '../../../utils/classnames';
import {
  trackRelevanceRating,
  RelevanceRatingEventNames,
} from '../Tracker/Tracker';

const RelevanceRaterStyle = styled.div.attrs(props => ({
  className: classNames({
    flex: true,
  }),
}))``;

const RelevanceRating = styled.button.attrs(props => {})``;

type Props = {|
  position: number,
  id: string,
|};

function createEvent(rating) {
  return {
    name: RelevanceRatingEventNames.RateResultRelevance,
    data: rating,
  };
}

const RelevanceRater = ({ id, position }: Props) => {
  return (
    <RelevanceRaterStyle>
      <RelevanceRating
        onClick={() =>
          trackRelevanceRating(createEvent({ id, position, rating: 1 }))
        }
      >
        1
      </RelevanceRating>
      <RelevanceRating
        onClick={() =>
          trackRelevanceRating(createEvent({ id, position, rating: 2 }))
        }
      >
        2
      </RelevanceRating>
      <RelevanceRating
        onClick={() =>
          trackRelevanceRating(createEvent({ id, position, rating: 3 }))
        }
      >
        3
      </RelevanceRating>
      <RelevanceRating
        onClick={() =>
          trackRelevanceRating(createEvent({ id, position, rating: 4 }))
        }
      >
        4
      </RelevanceRating>
    </RelevanceRaterStyle>
  );
};

export default RelevanceRater;
