// @flow
import styled from 'styled-components';
import { classNames } from '../../../utils/classnames';
import {
  track,
  RelevanceRatingEventNames,
  type RelevanceRatingResource,
} from '../SearchLogger/SearchLogger';

const RelevanceRaterStyle = styled.div.attrs(props => ({
  className: classNames({
    flex: true,
  }),
}))``;

const RelevanceRating = styled.button.attrs(props => {})``;

type Props = {| position: number, id: string |};

function createEvent(rating: RelevanceRatingResource) {
  return {
    service: 'relevance_rating',
    name: RelevanceRatingEventNames.RateResultRelevance,
    resource: rating,
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
