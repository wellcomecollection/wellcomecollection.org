// @flow
import styled from 'styled-components';
import { classNames } from '../../../utils/classnames';
import {
  track,
  type RelevanceRating as RelevanceRatingType,
} from '../SearchLogger/SearchLogger';

const RelevanceRaterStyle = styled.div.attrs(props => ({
  className: classNames({
    flex: true,
  }),
}))``;

const RelevanceRating = styled.button.attrs(props => {})``;

type Props = {| position: number, id: string |};

function createEvent(rating: RelevanceRatingType) {
  return {
    service: 'relevance_rating',
    event: 'Rate Result Relevance',
    rating: rating,
  };
}

const RelevanceRater = ({ id, position }: Props) => {
  return (
    <RelevanceRaterStyle>
      <RelevanceRating
        onClick={() => track(createEvent({ id, position, rating: 1 }))}
      >
        1
      </RelevanceRating>
      <RelevanceRating
        onClick={() => track(createEvent({ id, position, rating: 2 }))}
      >
        2
      </RelevanceRating>
      <RelevanceRating
        onClick={() => track(createEvent({ id, position, rating: 3 }))}
      >
        3
      </RelevanceRating>
      <RelevanceRating
        onClick={() => track(createEvent({ id, position, rating: 4 }))}
      >
        4
      </RelevanceRating>
    </RelevanceRaterStyle>
  );
};

export default RelevanceRater;
